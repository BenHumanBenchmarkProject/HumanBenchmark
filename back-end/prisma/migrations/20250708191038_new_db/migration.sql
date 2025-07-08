/*
  Warnings:

  - You are about to drop the column `bodyPart` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseId` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `max` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `muscle` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `reps` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Workout` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_exerciseId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "overallStat" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "bodyPart",
DROP COLUMN "exerciseId",
DROP COLUMN "max",
DROP COLUMN "muscle",
DROP COLUMN "reps",
DROP COLUMN "updatedAt",
DROP COLUMN "weight",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Movement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "reps" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "muscle" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "exerciseId" INTEGER,
    "workoutId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
