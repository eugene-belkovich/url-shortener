-- CreateTable
CREATE TABLE "analytics" (
    "id" BIGSERIAL NOT NULL,
    "url_id" BIGINT NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_url" TEXT NOT NULL,
    "slug" VARCHAR(7) NOT NULL,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "analytics_slug_key" ON "analytics"("slug");

-- AddForeignKey
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
