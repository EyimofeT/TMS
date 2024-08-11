/*
  Warnings:

  - You are about to drop the column `assigned_by_user_id` on the `task` table. All the data in the column will be lost.
  - Added the required column `assigned_by_user_entry` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_assigned_by_user_id_fkey";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "assigned_by_user_id",
ADD COLUMN     "assigned_by_user_entry" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_by_user_entry_fkey" FOREIGN KEY ("assigned_by_user_entry") REFERENCES "project_x_user"("entry_id") ON DELETE RESTRICT ON UPDATE CASCADE;
