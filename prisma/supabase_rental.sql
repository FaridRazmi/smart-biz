-- Rental feature migration for SmartBiz (run once in Supabase SQL Editor)
-- Adds rental columns to Product and creates the Rental table.

ALTER TABLE "Product"
    ADD COLUMN IF NOT EXISTS "isRentable" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "rentalPrice3h" DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS "rentalPriceDay" DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS "rentalPriceWeek" DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS "rentalPriceMonth" DECIMAL(10,2);

CREATE TABLE IF NOT EXISTS "Rental" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL DEFAULT '',
    "durationType" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "originalPrice" DECIMAL(10,2),
    "isPromo" BOOLEAN NOT NULL DEFAULT false,
    "promoNote" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- Promo columns for databases created before this migration
ALTER TABLE "Rental"
    ADD COLUMN IF NOT EXISTS "originalPrice" DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS "isPromo" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "promoNote" TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS "Rental_userId_idx" ON "Rental"("userId");
CREATE INDEX IF NOT EXISTS "Rental_productId_idx" ON "Rental"("productId");

ALTER TABLE "Rental" DROP CONSTRAINT IF EXISTS "Rental_userId_fkey";
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Rental" DROP CONSTRAINT IF EXISTS "Rental_productId_fkey";
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
