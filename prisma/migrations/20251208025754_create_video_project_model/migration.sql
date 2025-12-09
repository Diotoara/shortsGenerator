-- CreateTable
CREATE TABLE "VideoProject" (
    "id" TEXT NOT NULL,
    "script" JSONB NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "caption" JSONB NOT NULL,
    "imageUrls" TEXT[],
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "VideoProject_pkey" PRIMARY KEY ("id")
);
