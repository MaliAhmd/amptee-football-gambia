"use server";

import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
// Note: If you have a different "Cloud Name" than "amptee-football-gambia", please update it here!
cloudinary.config({
  cloud_name: "dqlbidkyx",
  api_key: "418619641989253",
  api_secret: "cS-YcvgiKh29zzabLRTVtAHeOHg",
  secure: true,
});

export async function uploadImage(formData) {
  try {
    const file = formData.get("file");
    if (!file) {
      throw new Error("No file uploaded");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "amptee-football" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(new Error(error.message || "Failed to upload image. P.S Make sure your Cloud Name is exactly correct!"));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Server Action Exception:", error);
    throw new Error(error.message);
  }
}
