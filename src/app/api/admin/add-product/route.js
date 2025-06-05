import { NextResponse } from "next/server";
import Product from "../../../../models/Product"; // Adjust the import path as necessary
import dbConnect from "../../../../db/db";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    // Remove id if present, let MongoDB handle _id
    if (data.id) delete data.id;
    // Create product
    const product = await Product.create(data);
    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Get paginated products
    const products = await Product.find({}).skip(skip).limit(limit);
    const total = await Product.countDocuments({});
    
    return NextResponse.json({ 
      success: true, 
      products,
      pagination: {
        total,
        hasMore: skip + products.length < total
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
