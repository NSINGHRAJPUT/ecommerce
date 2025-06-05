import { NextResponse } from "next/server";
import dbConnect from "../../../../db/db";
import Category from "../../../../models/Category";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const category = await Category.create(data);
    return NextResponse.json({ success: true, category });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
