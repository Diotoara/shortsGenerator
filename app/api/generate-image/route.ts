import { InferenceClient } from '@huggingface/inference';
import {v2 as cloudinary} from 'cloudinary'
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const HF_TOKEN = process.env.HF_TOKEN;
const client = new InferenceClient(HF_TOKEN);


export async function POST(req:NextRequest) {
  const {prompt, id} = await req.json();
  const modelId = "stabilityai/stable-diffusion-xl-base-1.0"; 

  console.log(`Generating image for prompt: "${prompt}"...`);
    try {
        const imageBlob:any = await client.textToImage({
            model: modelId,
            inputs: prompt,
            parameters: {
                negative_prompt: "blurry, low quality, watermarks, text",
            }
        });

        const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
        const base64Data = imageBuffer.toString('base64');
        const dataURI = `data:image/png;base64,${base64Data}`;
    
        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: "image", 
            folder: "ai-short-video-files/images", 
            public_id: id, 
            format: "png"
        });

        // const filename = `generated_image_${id}.png`;
        // fs.writeFileSync(filename, imageBuffer);

        return NextResponse.json({
          "result": result.secure_url,
        })


    } catch (error) {
        return NextResponse.json({
            "An error occurred during API call:": error
        },{
            status : 404
        })
    }
}


//below one also working, just takes more time.

// import { Client } from "@gradio/client";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req:NextRequest){  
//   const {prompt} = await req.json();

//   const client = await Client.connect("jonasflann/jonas-text-to-image");
//   const result:any = await client.predict("/infer", { 		
//       prompt: {prompt},
//       negative_prompt: "lurry, low quality, distorted, extra limbs, deformed hands, unnatural anatomy, bad proportions, low resolution, noise, grainy!", 		
//       seed: 0, 		
//       randomize_seed: true, 		
//       width: 576, 		
//       height: 1024,
//       guidance_scale: 0, 		
//       num_inference_steps: 1, 
//   });

//   return NextResponse.json({
//     "path": result.data[0].path,
//     "url": result.data[0].url
//   },{
//     status:200
//   })
// }