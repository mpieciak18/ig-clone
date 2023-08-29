/*
  Warnings:

  - You are about to drop the column `file` on the `Post` table. All the data in the column will be lost.
  - Added the required column `image` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Post_file_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "file",
ADD COLUMN     "image" BYTEA NOT NULL;
