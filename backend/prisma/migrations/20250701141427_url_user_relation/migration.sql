-- AlterTable
ALTER TABLE "urls" ADD COLUMN     "user_id" BIGINT;

-- CreateIndex
CREATE INDEX "urls_user_id_idx" ON "urls"("user_id");

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
