const { NextResponse } = require("next/server");
const jwt = require("jsonwebtoken");
const dbConnect = require("../../../db/db");
const User = require("../../../models/User");
const Cart = require("../../../models/Cart");

export async function GET(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await dbConnect();

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cart = await Cart.findOne({ user: user._id }).populate(
      "items.product"
    );

    return NextResponse.json({ user, cart });
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
