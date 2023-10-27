/*
  Warnings:

  - You are about to drop the column `message` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `urlPath` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `otherUserId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "message",
DROP COLUMN "urlPath",
ADD COLUMN     "otherUserId" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_otherUserId_fkey" FOREIGN KEY ("otherUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
