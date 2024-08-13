-- CreateTable
CREATE TABLE "project_message" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project_message" ADD CONSTRAINT "project_message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_message" ADD CONSTRAINT "project_message_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;
