const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createFood: async (req, res) => {
        try {
            const data = await prisma.food.create({
                data: {
                    foodTypeId: parseInt(req.body.foodTypeId),
                    name: req.body.name,
                    price: req.body.price,
                    remark: req.body.remark,
                    image: req.body.image,
                    foodType: req.body.foodType,
                    status: "active"              
                }
            });
            return res.status(200).send({ message: "Food created successfully", data });
            
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },
    listFood: async (req, res) => {
        try {
            const data = await prisma.food.findMany({
                where: {
                    status: "active"
                },
                include: {
                    FoodType: true
                }
            });
            return res.status(200).send({ message: "Food list", data });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },

}