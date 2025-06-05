const dbConnect = require("../../../db/db");
const Order = require("../../../models/Order");
const { NextResponse } = require("next/server");
const Stripe = require("stripe");
const mongoose = require("mongoose");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    console.log('Processing payment verification...');
    
    const { sessionId } = await request.json();

    if (!sessionId) {
      console.log('Session ID is missing');
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    await dbConnect();
    console.log('Connected to database');
    
    // Retrieve the session from Stripe with expanded customer details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'line_items', 'shipping']
    });
    console.log('Retrieved session from Stripe:', session.id);
    
    // Find the order using the session ID
    const order = await Order.findOne({ paymentId: sessionId });

    if (!order) {
      console.log('Order not found for session:', sessionId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    console.log('Found order:', order._id);

    // Update order status based on payment status
    if (session.payment_status === "paid") {
      order.status = "processing"; // Change from pending to processing
      order.paymentStatus = "completed";
      
      // Update shipping address if available from Stripe
      if (session.shipping && session.shipping.address) {
        const address = session.shipping.address;
        order.shippingAddress = {
          street: address.line1 || "Not provided",
          city: address.city || "Not provided",
          state: address.state || "Not provided",
          postalCode: address.postal_code || "Not provided",
          country: address.country || "Not provided"
        };
        console.log('Updated shipping address from Stripe');
      }
    } else {
      order.status = "cancelled";
      order.paymentStatus = "failed";
      console.log('Payment not completed, marking order as cancelled');
    }

    await order.save();
    console.log('Order updated successfully');

    return NextResponse.json({ 
      success: session.payment_status === "paid",
      orderId: order._id.toString(),
      status: order.status
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        success: false
      },
      { status: 500 }
    );
  }
}
