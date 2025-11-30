
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

const Provider = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  if (user) {
    const existingUser = await prisma.user.findFirst({
      where: { email: user.primaryEmailAddress?.emailAddress },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          imageUrl: user.imageUrl,
        },
      });
    }
  }

  return <>{children}</>;
};

export default Provider;