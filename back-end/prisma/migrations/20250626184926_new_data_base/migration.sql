/*
  Warnings:

  - You are about to drop the column `pfp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `equipment` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the `Stat` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `height` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `age` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `bodyPart` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reps` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Stat" DROP CONSTRAINT "Stat_movementId_fkey";

-- DropForeignKey
ALTER TABLE "Stat" DROP CONSTRAINT "Stat_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pfp",
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "weight" SET NOT NULL,
ALTER COLUMN "age" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL;

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "difficulty",
DROP COLUMN "equipment",
DROP COLUMN "instructions",
DROP COLUMN "type",
ADD COLUMN     "bodyPart" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "exerciseId" INTEGER,
ADD COLUMN     "max" INTEGER NOT NULL,
ADD COLUMN     "reps" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "weight" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Stat";

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bodyParts" TEXT[],
    "targetMuscle" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "exerciseTips" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuscleStat" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "muscle" TEXT NOT NULL,
    "exerciseId" INTEGER,
    "max" INTEGER NOT NULL,
    "bodyPartStatId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MuscleStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyPartStat" (
    "id" SERIAL NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BodyPartStat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuscleStat" ADD CONSTRAINT "MuscleStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuscleStat" ADD CONSTRAINT "MuscleStat_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuscleStat" ADD CONSTRAINT "MuscleStat_bodyPartStatId_fkey" FOREIGN KEY ("bodyPartStatId") REFERENCES "BodyPartStat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyPartStat" ADD CONSTRAINT "BodyPartStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
