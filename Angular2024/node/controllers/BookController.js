
const express = require('express');
const book = express.Router();
const { PrismaClient } = require('@prisma/client');

const prismaClient = new PrismaClient();
book.get('/list', async (req,res)=>{
    try {
        const data = await prismaClient.book.findMany();
        res.send({results:data})
    } catch (error) {
        res.status(500).send({error:error});
    }

})

module.exports = book;