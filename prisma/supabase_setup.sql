-- SmartBiz schema for Supabase
-- Paste this whole file into Supabase -> SQL Editor -> New query -> Run.
-- Safe to run once. Tables are created only if they do not exist.

CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isStaff" BOOLEAN NOT NULL DEFAULT false,
    "isSuperuser" BOOLEAN NOT NULL DEFAULT false,
    "dateJoined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Product" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "buyingPrice" DECIMAL(10,2) NOT NULL,
    "sellingPrice" DECIMAL(10,2) NOT NULL,
    "isRentable" BOOLEAN NOT NULL DEFAULT false,
    "accountExpiryDate" TIMESTAMP(3),
    "rentalPrice3h" DECIMAL(10,2),
    "rentalPriceDay" DECIMAL(10,2),
    "rentalPriceWeek" DECIMAL(10,2),
    "rentalPriceMonth" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

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

CREATE TABLE IF NOT EXISTS "Sale" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantitySold" INTEGER NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");
CREATE INDEX IF NOT EXISTS "Rental_userId_idx" ON "Rental"("userId");
CREATE INDEX IF NOT EXISTS "Rental_productId_idx" ON "Rental"("productId");

ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Admin account: username "admin", password "admin123"
INSERT INTO "User" ("username", "email", "passwordHash", "isActive", "isStaff", "isSuperuser")
VALUES (
    'admin',
    '',
    '$2b$10$72WdYspQUgMgzKrAW0Yle.17jeeJUXnuM0m1YbWY0.RnJ6HZF9sG2',
    true,
    true,
    true
)
ON CONFLICT ("username") DO UPDATE SET
    "passwordHash" = EXCLUDED."passwordHash",
    "isActive" = true,
    "isStaff" = true,
    "isSuperuser" = true;
