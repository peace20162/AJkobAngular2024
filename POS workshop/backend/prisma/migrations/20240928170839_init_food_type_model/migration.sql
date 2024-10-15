-- CreateTable
CREATE TABLE "FoodType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "FoodType_pkey" PRIMARY KEY ("id")
);
