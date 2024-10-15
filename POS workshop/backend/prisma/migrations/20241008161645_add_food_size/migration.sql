-- CreateTable
CREATE TABLE "FoodSize" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "remark" TEXT,
    "moneyAdded" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "foodTypeId" INTEGER NOT NULL,

    CONSTRAINT "FoodSize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FoodSize" ADD CONSTRAINT "FoodSize_foodTypeId_fkey" FOREIGN KEY ("foodTypeId") REFERENCES "FoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
