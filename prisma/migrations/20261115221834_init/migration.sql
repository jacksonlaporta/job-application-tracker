-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('Saved', 'Applied', 'Interview', 'Closed');

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "url" TEXT,
    "stage" "Stage" NOT NULL DEFAULT 'Saved',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
