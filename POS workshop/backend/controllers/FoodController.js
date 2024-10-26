const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
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
                    image: req.body.image ?? "",
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
                },
                orderBy: {
                    id: "asc"
                }
            });
            return res.status(200).send({ message: "Food list", data });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },
    uploadFoodImage: async (req, res) => {
        try {
            if(req.files.file !== undefined){
                const file = req.files.file;
                const fileName = file.name;
                if (!fs.existsSync(`uploads`)) {
                    fs.mkdirSync(`uploads`);
                  }
                if(fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.jpeg') || fileName.endsWith('.webp')){
                    file.mv(`uploads/${fileName}`, (err) => {
                        if (err) {
                            return res.status(500).send({ message: err.message });
                        }
                        return res.status(200).send({ message: "File uploaded successfully", fileName });
                    });
                }else{
                    return res.status(400).send({ message: "Invalid file type" });
                }
                
            }else{
                return res.status(404).send({ message: "No file found" });
            }
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    removeFood: async (req, res) => {
        try {
            const data = await prisma.food.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    status: "inactive"
                }
            });
            return res.status(200).send({ message: "Food removed successfully", data });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },
    updateFood: async (req, res) => {
        try {
            let img = req.body.fileName;

            if (img === undefined) {
              const row = await prisma.food.findFirst({
                where: {
                  id: parseInt(req.body.id),
                },
              });
      
              img = row.image;
            }
            const data = await prisma.food.update({
                where: {
                    id: parseInt(req.body.id)
                },
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
            return res.status(200).send({ message: "Food updated successfully", data });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },
    removeFoodImage: async (req, res) => {
        try {
            const data = await prisma.food.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    image: ""
                }
            });
            return res.status(200).send({ message: "Image removed successfully", data });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },
    filter: async (req, res) => {
        try {
            const data = await prisma.food.findMany({
                where: {
                    status: "active",
                    foodType: req.params.foodType
                },
                include: {
                    FoodType: true
                },
                orderBy: {
                    id: "desc"
                }
            });
            return res.status(200).send({ message: "Food list filtered by food type", data });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },
    
   
}