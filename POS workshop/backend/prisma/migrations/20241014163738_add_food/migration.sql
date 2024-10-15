-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "foodTypeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "foodType" TEXT NOT NULL DEFAULT 'food',
    "status" TEXT NOT NULL DEFAULT 'active',
    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_foodTypeId_fkey" FOREIGN KEY ("foodTypeId") REFERENCES "FoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE IF EXISTS "description" RENAME TO "remark"