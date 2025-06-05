const { NextResponse } = require("next/server");

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const response = await fetch(
      `https://dummyjson.com/products/category/${slug}`
    );
    const products = await response.json();
    console.log(products);
    return NextResponse.json(products);
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
