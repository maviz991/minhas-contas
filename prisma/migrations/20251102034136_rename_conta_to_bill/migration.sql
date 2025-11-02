/*
  Warnings:

  - You are about to drop the `Conta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "minhascontas"."Conta";

-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "vencimento" TIMESTAMP(3) NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);
