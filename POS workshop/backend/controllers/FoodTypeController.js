const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createFoodType: async (req, res) => {
        try {
            await prisma.foodType.create({
                data: {
                    name: req.body.name,
                    remark: req.body.remark ?? "",
                    status: "active"
                },
            })
            return res.status(200).send({ message: "Food Type created successfully!" });
        } catch (e) {
            return res.status(500).send({ error: e.message });
        }
    },
    listFoodType: async (req, res) => {
        try {
            const result = await prisma.foodType.findMany({
                where: {
                    status: "active"
                }
            })
            return res.status(200).send({ data : result });
        } catch (e) {
            return res.status(500).send({ error: e.message });
        }
    },
    removeFoodType: async (req, res) => {
        try {
            await prisma.foodType.update({
                data: {
                    status: "inactive"
                },
                where: {
                    id: parseInt(req.params.id)
                }
            })
            return res.status(200).send({ message: "Food Type removed successfully!" });
        } catch (e) {
            return res.status(500).send({ error: e.message });
        }
    },
    updateFoodType: async (req, res) => {
        try {
            await prisma.foodType.update({
                data: {
                    name: req.body.name,
                    remark: req.body.remark ?? ""
                },                
                where:{
                    id: parseInt(req.body.id)                    
                }
            })

            return res.status(200).send({ message: "Food Type updated successfully!" });
        } catch (e) {
            return res.status(500).send({ error: e.message });
        }
    }
    
}