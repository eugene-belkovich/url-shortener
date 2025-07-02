-- DropForeignKey
ALTER TABLE "urls" DROP CONSTRAINT "urls_user_id_fkey";

-- AlterTable
ALTER TABLE "analytics" DROP CONSTRAINT "analytics_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "url_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "analytics_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "analytics_id_seq";

-- AlterTable
ALTER TABLE "urls" DROP CONSTRAINT "urls_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "urls_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "urls_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
