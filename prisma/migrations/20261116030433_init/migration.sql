-- CreateEnum
CREATE TYPE "stages" AS ENUM ('Saved', 'Applied', 'Interview', 'Closed');

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "url" TEXT,
    "stage" "stages" NOT NULL DEFAULT 'Saved',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);
