import { NextResponse } from "next/server";
import dbConnect from "../../../db/db";
import Category from "../../../models/Category";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 }); // Get all fields and sort by name
    return NextResponse.json({ categories });
  } catch (err) {
    return NextResponse.json(
      { categories: [], error: err.message },
      { status: 500 }
    );
  }
}
