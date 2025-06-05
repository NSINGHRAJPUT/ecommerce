const { NextResponse } = require("next/server");
const dbConnect = require("../../../db/db");
const Order = require("../../../models/Order");

async function POST(request) {
  try {
    const { paymentIntentId } = await request.json();

    await dbConnect();

    const order = await Order.findOneAndUpdate(
      { paymentId: paymentIntentId },
      { status: "completed", paymentStatus: "completed" },
      { new: true }
    );

    if (!order) {
      throw new Error("Order not found");
    }

    return NextResponse.json({ success: true });
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

module.exports = { POST };
