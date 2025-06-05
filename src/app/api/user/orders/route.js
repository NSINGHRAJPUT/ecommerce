const { NextResponse, userAgent } = require("next/server");
const jwt = require("jsonwebtoken");
const dbConnect = require("../../../../db/db");
const Order = require("../../../../models/Order");
const User = require("../../../../models/User");
const Product = require("../../../../models/Product");

export async function GET(request) {
  console.log("GET /api/orders - Start");
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    console.log("Token received:", token ? "Valid token" : "No token");

    if (!token) {
      console.log("GET /api/orders - Unauthorized: No token provided");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully for user:", decoded.id);

    await dbConnect();
    console.log("Database connection established");

    const user = await User.findById(decoded.id);
    console.log(
      "User lookup result:",
      user ? "User found" : "User not found",
      user
    );

    if (!user) {
      console.log("GET /api/orders - User not found:", decoded.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const orders = await Order.find({ user: user._id });
    
    // Fetch product details from external API for each order item
    const ordersWithProducts = await Promise.all(orders.map(async (order) => {
      const itemsWithProducts = await Promise.all(order.items.map(async (item) => {
        console.log("Fetching product data for item:", item.product);
        const response = await fetch(`https://dummyjson.com/products/${item.product}`);
        const productData = await response.json();
        console.log("Product data fetched:", productData);
        return {
          ...item.toObject(),
          product: {
            name: productData.title,
            price: productData.price,
            description: productData.description,
            image: productData.thumbnail
          }
        };
      }));
      return {
        ...order.toObject(),
        items: itemsWithProducts
      };
    }));

    console.log(`Found ${ordersWithProducts.length} orders for user:`, user._id);

    console.log("GET /api/orders - Success");
    return NextResponse.json({ orders: ordersWithProducts });
  } catch (error) {
    console.error("Server error:", error);
    console.log("GET /api/orders - Error:", error.message);
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
