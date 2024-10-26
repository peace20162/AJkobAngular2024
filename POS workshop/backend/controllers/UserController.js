const { PrismaClient } = require('@prisma/client');
const { stat } = require('fs');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();


module.exports = {
    signIn: async (req, res) => {
        try {
            const checkAuth = await prisma.user.findFirst({
                select: {
                    id: true,
                    name: true,
                    level: true
                },
                where: {
                    username: req.body.username,
                    password: req.body.password,
                    status: 'active'
                }
            })
            if (checkAuth !== null) {
                const key = process.env.SECRET_KEY;
                const token = jwt.sign(checkAuth, key, { expiresIn: '30d' });
                return res.send({ token: token, name: checkAuth.name, id:checkAuth.id});
            }
            return res.status(401).send({ message: 'Unauthorized' });
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }

    },
    checkUser: async (req, res, next) => {
        try {
            const checkUser = await prisma.user.findFirst({
                where: {
                    username: req.body.username,
                    status: 'active'
                }
            })
            if (checkUser !== null) {
                next()
            }
            return res.status(401).send({ message: 'No active user found' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    }


} 