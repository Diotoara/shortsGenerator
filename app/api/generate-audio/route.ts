import { storage } from "@/lib/FirebaseConfig";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary'
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


export async function POST(req:NextRequest) {
  const {text,id} = await req.json();
  try {
    const response = await axios.post("http://localhost:8000/generate", {
      text: text
    },{
      responseType:'arraybuffer'
    });
    const audioBuffer: ArrayBuffer = response.data;
    const audioFileBuffer = Buffer.from(audioBuffer);
    const base64Data = audioFileBuffer.toString('base64');
    const dataURI = `data:audio/wav;base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "video", // Use 'video' for audio files in Cloudinary
        folder: "ai-short-video-files/audio", // Organizes files into a folder
        public_id: id, // Use the UUID as the unique filename
        format: "wav" // Ensure it's stored as WAV
    });

    return NextResponse.json({
      success: true,
      audioUrl: result.secure_url,
      publicId: result.public_id
    }, {
      status: 200
    });
  } catch (error) {
    console.error("Error generating or uploading audio to Cloudinary:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to generate or upload audio."
    }, {
      status: 500
    });
  }
}