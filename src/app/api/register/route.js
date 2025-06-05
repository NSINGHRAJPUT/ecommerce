const { NextResponse } = require("next/server");
const dbConnect = require("../../../db/db");
const User = require("../../../models/User");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { name, email, password, profilePicture } = await request.json();

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    let profilePictureUrl = "";
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${profilePicture}`,
        {
          public_id: `profile_pictures/${email}`,
          folder: "ecommerce",
        }
      );
      profilePictureUrl = uploadResponse.secure_url;
    }

    const user = await User.create({
      name,
      email,
      password,
      profilePicture: profilePictureUrl,
    });

    return NextResponse.json({ success: true, user });
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
