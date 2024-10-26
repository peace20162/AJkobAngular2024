const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createFoodSize: async (req, res) => {
        try {
            
            const foodSize = await prisma.foodSize.create({
                data: {
                   name: req.body.name,
                   foodTypeId: req.body.foodTypeId,
                   moneyAdded: req.body.moneyAdded,
                   remark: req.body.remark,
                },
            });
            return res.status(200).send({ message: 'Food Size created successfully' });
        } catch (error) {            
            return res.status(500).send({ message: error.message });
        }
    },
    listFoodSize: async (req, res) => {
        try {
            const foodSizes = await prisma.foodSize.findMany(
                {   
                    where:{
                      status:"active"
                    },
                    orderBy: {
                        id: 'desc',
                    },
                    include: {
                        FoodType: true,
                    },
                }
            );
            return res.status(200).send({data: foodSizes});
        } catch (error) {            
            return res.status(500).send({ message: error.message });
        }
    },
    updateFoodSize: async (req, res) => {
        try {
            const id = req.body.id;            
            const foodSize = await prisma.foodSize.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name: req.body.name,
                    foodTypeId: req.body.foodTypeId,
                    moneyAdded: req.body.moneyAdded,
                    remark: req.body.remark,
                },
            });
            return res.status(200).send({ message: 'Food Size updated successfully' });
        } catch (error) {            
            return res.status(500).send({ message: error.message });
        }
    },
    removeFoodSize:async (req, res) => {
        try {
          await prisma.foodSize.update({
            data: {
              status: "inactive",
            },
            where: {
              id: parseInt(req.params.id),
            },
          });
    
          return res.send({ message: "Food Size deleted successfully" });
        } catch (e) {
          return res.status(500).send({ error: e.message });
        }
    },
    filterFoodSize:async (req, res) => {
        try {
          const rows = await prisma.foodSize.findMany({
            where: {
              foodTypeId: parseInt(req.params.foodTypeId),
              status: "active",
            },
            orderBy: {
              moneyAdded: "asc",
            },
          });
    
          return res.send({ results: rows });
        } catch (e) {
          return res.status(500).send({ error: e.message });
        }
    },
}