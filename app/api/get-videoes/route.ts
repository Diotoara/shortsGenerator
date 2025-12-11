import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {user} = await req.json();
    const result = await prisma.videoProject.findMany({
        where:{
            createdBy : user,
        }
    })
    return NextResponse.json({
        result
    })
}