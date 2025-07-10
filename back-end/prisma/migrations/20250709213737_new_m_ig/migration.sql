/*
  Warnings:

  - A unique constraint covering the columns `[userId,bodyPart]` on the table `BodyPartStat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,muscle]` on the table `MuscleStat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BodyPartStat_userId_bodyPart_key" ON "BodyPartStat"("userId", "bodyPart");

-- CreateIndex
CREATE UNIQUE INDEX "MuscleStat_userId_muscle_key" ON "MuscleStat"("userId", "muscle");
