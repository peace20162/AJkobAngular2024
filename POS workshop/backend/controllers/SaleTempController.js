const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  createSaleTemp: async (req, res) => {
    try {
        const foodData = await prisma.food.findFirst({
          where: {
            id: req.body.foodId
          }
        });
        const data = await prisma.saleTemp.create({
            data: {
                foodId: req.body.foodId,
                quantity: req.body.quantity,
                price: foodData.price,
                userId: req.body.userId,
                tableNo: req.body.tableNo,
            },
        });
        return res.status(200).send({ message: 'Sale Temp created successfully',  data })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  },
}