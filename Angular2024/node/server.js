
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');


const PORT = 3001;
const prismaClient = new PrismaClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get('/book/list', async(req,res)=>{
  const data = await prismaClient.book.findMany();
  res.send({data:data});
})

app.post('/book/create', async(req,res)=>{
  const data = req.body;
  const result = await prismaClient.book.create({
    data:data,
  });
  res.send({result:result});
})

app.post('/book/createManual', async(req,res)=>{
  const result = await prismaClient.book.create({
    data:{
      isbn: '1002',
      name: 'PHP',
      price: 850
    }
  });
  res.send({result:result});
})

app.get('/',(req, res)=>{
    res.send("hello world");
})
app.get('/hello/:name',(req, res)=>{
  res.send(`hello world ${req.params.name}`);
})
app.get('/hi/:name/:age',(req,res)=>{
  const name = req.params.name;
  const age = req.params.age;
  res.send(`name = ${name} \n 
            age = ${age}`);

})
app.post('/hello',(req, res)=>{
  res.send(req.body);
})
app.patch('/',(req, res)=>{
  res.send("hello world");
})
app.put('/myPut',(req, res)=>{
  res.send(req.body);
})
app.delete('/myDelete/:id',(req, res)=>{
  res.send(`My Delete ID = ${req.params.id}`);
})





console.log(`app start at port ${PORT}`);

app.listen(3001);

// // server.js
// const nodeHttp = require('node:http');

// const server = nodeHttp.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('Hello World! 3\n');
// });

// // starts a simple http server locally on port 3000
// server.listen(3000, '127.0.0.1', () => {
//   console.log('Listening on 127.0.0.1:3000');
// });


