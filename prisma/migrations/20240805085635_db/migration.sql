-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profile_photo" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "creator_id" TEXT NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_x_user" (
    "entry_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_x_user_pkey" PRIMARY KEY ("entry_id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "task_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "due_date" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "assigned_by_user_id" TEXT NOT NULL,
    "final_status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_message" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "project_x_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_id_key" ON "user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "project_project_id_key" ON "project"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_x_user_entry_id_key" ON "project_x_user"("entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_x_user_user_id_project_id_key" ON "project_x_user"("user_id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_task_id_key" ON "task"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_user_id_project_id_title_key" ON "task"("user_id", "project_id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "task_message_task_id_project_x_user_id_created_at_key" ON "task_message"("task_id", "project_x_user_id", "created_at");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_x_user" ADD CONSTRAINT "project_x_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_x_user" ADD CONSTRAINT "project_x_user_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_by_user_id_fkey" FOREIGN KEY ("assigned_by_user_id") REFERENCES "project_x_user"("entry_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_message" ADD CONSTRAINT "task_message_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_message" ADD CONSTRAINT "task_message_project_x_user_id_fkey" FOREIGN KEY ("project_x_user_id") REFERENCES "project_x_user"("entry_id") ON DELETE RESTRICT ON UPDATE CASCADE;
