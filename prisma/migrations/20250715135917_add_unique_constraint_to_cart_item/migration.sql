/*
  Warnings:

  - A unique constraint covering the columns `[cartUUID,productUUID]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartUUID_productUUID_key" ON "CartItem"("cartUUID", "productUUID");
