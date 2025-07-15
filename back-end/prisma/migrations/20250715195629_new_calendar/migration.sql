/*
  Warnings:

  - A unique constraint covering the columns `[workoutId]` on the table `CalendarEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CalendarEvent" ADD COLUMN     "workoutId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "CalendarEvent_workoutId_key" ON "CalendarEvent"("workoutId");

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
