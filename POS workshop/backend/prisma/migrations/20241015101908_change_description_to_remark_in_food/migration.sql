/*
  Warnings:

  - You are about to drop the column `description` on the `Food` table. All the data in the column will be lost.
  - Added the required column `remark` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Food" DROP COLUMN "description",
ADD COLUMN     "remark" TEXT NOT NULL;
