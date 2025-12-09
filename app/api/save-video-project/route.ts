import { prisma } from '@/lib/prisma';
import { useUser } from '@clerk/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    const {user} = useUser();

    // Deconstruct the data sent from the frontend
    const { 
        script, 
        audioUrl, 
        caption, 
        imageUrls 
    } = req.body;

    try {   
        const newProject = await prisma.videoProject.create({
            data: {
                script, // Prisma handles mapping JS object to JSON type
                audioUrl,
                caption, // Prisma handles mapping JS object to JSON type
                imageUrls,
                createdBy : user?.primaryEmailAddress?.emailAddress || ""
            },
        });
        return res.status(200).json({ 
            message: 'Video project saved successfully',
            projectId: newProject.id 
        });

    } catch (error) {
        console.error('Prisma Save Error:', error);
        return res.status(500).json({ 
            message: 'Failed to save video project',
            error: error
        });
    }
}