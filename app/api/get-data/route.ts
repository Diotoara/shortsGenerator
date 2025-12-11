import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {id} = await req.json();
    const result = await prisma.videoProject.findFirst({
        where:{
            id : id
        }
    })
    return NextResponse.json({
        result
    })
}