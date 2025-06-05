import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: 'dkgrxaveu',
  api_key: '622843483976115',
  api_secret: 'XJoxseONgDjeCS6deiY9DFTEDx4',
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert buffer to base64
    const base64String = buffer.toString('base64');
    const fileType = file.type;
    const dataURI = `data:${fileType};base64,${base64String}`;
    
    // Upload to Cloudinary with signed upload
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    return NextResponse.json({ 
      url: result.secure_url,
      public_id: result.public_id 
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: error.message || "Error uploading file" },
      { status: 500 }
    );
  }
}