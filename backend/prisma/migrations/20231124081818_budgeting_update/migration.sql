/*
  Warnings:

  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Category` table. All the data in the column will be lost.
  - Added the required column `title` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;
