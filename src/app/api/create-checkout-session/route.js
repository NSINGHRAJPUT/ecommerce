const dbConnect = require("../../../db/db");
const User = require("../../../models/User");
const Order = require("../../../models/Order");
const { NextResponse } = require("next/server");
const Stripe = require("stripe");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    console.log('Processing checkout request...');
    
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      console.log('Authorization token missing');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, connecting to database...');
    await dbConnect();

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found:', decoded.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log('User found:', user._id);

    const { items } = await request.json();
    console.log('Cart items received:', items);

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    console.log('Line items created for Stripe');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'],
      },
      billing_address_collection: 'required',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create placeholder ObjectIds for products if they don't have MongoDB IDs
    const orderItems = items.map(item => ({
      product: mongoose.Types.ObjectId.isValid(item._id) ? item._id : new mongoose.Types.ObjectId(),
      quantity: item.quantity,
      price: item.price
    }));

    // Create order with default shipping address that will be updated after payment
    const order = await Order.create({
      user: user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: {
        street: "To be updated after checkout",
        city: "To be updated after checkout",
        state: "To be updated after checkout",
        postalCode: "To be updated after checkout",
        country: "To be updated after checkout"
      },
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "card",
      paymentId: session.id
    });

    console.log('Order created successfully:', order._id);
    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
