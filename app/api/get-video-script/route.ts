import {runGeminiStream } from "@/lib/Aimodel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {prompt} = await req.json();
    try {
        console.log(prompt);

            const result:any = await runGeminiStream(prompt)
            let finalText = ""
            for await (const chunk of result) {
                finalText += chunk.text
            }
            console.log("final text is ready")
            finalText = finalText.replace(/```json/, "").replace(/```/, "")
            console.log("......replace-----")
            finalText = finalText.trim()
            console.log("......trim--trim---trim--trim--trim---")
            const parsed = JSON.parse(finalText)
            console.log("........parsed........")
            return NextResponse.json({
                result: parsed
            })
    } catch (error) {
        return NextResponse.json({'Error:' : error})
    }
}