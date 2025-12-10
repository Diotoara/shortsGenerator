import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

    const {script, audioUrl, caption, imageUrls, user } = await req.json();

    try {   
        const newProject = await prisma.videoProject.create({
            data: {
                script, // Prisma handles mapping JS object to JSON type
                audioUrl,
                caption, // Prisma handles mapping JS object to JSON type
                imageUrls,
                createdBy : user?.primaryEmailAddress?.emailAddress || ""
                // createdBy : user
            },
        });
        return NextResponse.json({ 
            message: 'Video project saved successfully',
            projectId: newProject.id 
        },{
            status:200
        });

    } catch (error) {
        console.error('Prisma Save Error:', error);
        return NextResponse.json({ 
            message: 'Failed to save video project',
            error: error
        },{
            status:411,
        });
    }
}