import { runAiStream } from "@/lib/Aimodel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();
    try {

        const result: any = await runAiStream(prompt)

        let newAns = JSON.parse(result)


        return NextResponse.json({
            result: newAns
        })
    } catch (error) {
        return NextResponse.json({ 'Error:': error })
    }
}