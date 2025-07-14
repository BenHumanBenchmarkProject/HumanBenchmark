-- CreateTable
CREATE TABLE "FriendRecommendation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recommendedUserId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FriendRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FriendRecommendation_userId_recommendedUserId_key" ON "FriendRecommendation"("userId", "recommendedUserId");

-- AddForeignKey
ALTER TABLE "FriendRecommendation" ADD CONSTRAINT "FriendRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRecommendation" ADD CONSTRAINT "FriendRecommendation_recommendedUserId_fkey" FOREIGN KEY ("recommendedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
