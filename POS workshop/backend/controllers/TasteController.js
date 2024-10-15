const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createTaste: async (req, res) => {
        try {
            const data = await prisma.taste.create({
                data: {
                    name: req.body.name,
                    remark:req.body.remark,
                    foodTypeId: req.body.foodTypeId,
                    status: "active",
                },
            }); 
            return res.send({ message: 'Taste created successfully', data });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: error.message });
        }
    },
    listTaste: async (req, res) => {
        try {
            const data = await prisma.taste.findMany(
                {
                    orderBy: {
                        id: 'desc'
                    },
                    where: {
                        status: 'active'
                    },
                    include: {
                        FoodType: true,
                    },
                }
            );
            return res.send({ message: 'Taste list', data });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: error.message });
        }
    },
    removeTaste: async (req, res) => {
        try {
            const data = await prisma.taste.update({
                where: {    
                    id: parseInt(req.body.id)
                },
                data: {
                    status: "inactive"
                },  
            });
            return res.send({ message: 'Taste removed successfully', data });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: error.message });
        }
    },
    updateTaste: async (req, res) => {
        try {
            const data = await prisma.taste.update({
                where: {
                    id: parseInt(req.body.id)
                },
                data: {
                    name: req.body.name,
                    remark: req.body.remark,
                    foodTypeId: req.body.foodTypeId,
                },
            });
            return res.send({ message: 'Taste updated successfully', data });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: error.message });
        }
    },
  
}