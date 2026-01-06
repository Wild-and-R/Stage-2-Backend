-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productid" INTEGER NOT NULL,
    "productname" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
