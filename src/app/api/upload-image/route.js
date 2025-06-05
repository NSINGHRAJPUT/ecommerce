const { NextResponse } = require("next/server");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function POST(request) {
  try {
    const { buffer, filename } = await request.json();

    if (!buffer || !filename) {
      throw new Error("Buffer and filename are required");
    }

    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${buffer}`,
      {
        public_id: filename,
        folder: "ecommerce",
      }
    );

    return NextResponse.json({
      url: uploadResponse.secure_url,
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

module.exports = { POST };
