-- DropForeignKey
ALTER TABLE "analytics" DROP CONSTRAINT "analytics_url_id_fkey";

-- DropIndex
DROP INDEX "analytics_slug_key";
