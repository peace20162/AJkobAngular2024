
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const fileUpload = require('express-fileupload');
const cors = require('cors');


const bookController =  require('./controllers/BookController')

const PORT = process.env.PORT;
const prismaClient = new PrismaClient();

function checkSignIn(req,res,next){
  try {
    const secret = process.env.TOKEN_SECRET;
    const token = req.headers['authorization'];
    const result = jwt.verify(token,secret);
    if(result != undefined){
      next();
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({error: e.message});    
  }
}

app,use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload({
  limit:{fileSize: 50*1024*1024}
}));
app.use('/uploads', express.static('uploads'));
app.use('/book', bookController);

app.get('/user/info',checkSignIn, (req,res,next)=>{
  res.send("Hello BackOffice User Info");
})
app.post('/book/testUpload',(req,res)=>{
  try {
    const myFile  = req.files.myFile;
    myFile.mv('./uploads/'+myFile.name,(err)=>{
      if(err){

        res.status(500).send({error:err.message})
      }
    });
    res.send({message:`success upload : `+myFile.name});
  } catch (error) {
    res.status(500).send({error:error.message})
  }
})
app.get('/readFile',(req,res)=>{
  try {
    
    fs.readFile('test.txt',(err,data)=>{
      if(err){
        throw err;
      }
      res.send(data);
    })
    
    
  } catch (error) {
    res.status(500).send({error:error.message})
  }
})
app.get('/writeFile',(req,res)=>{
  try {
    
    const writeContent = `writing test`;
    fs.writeFile('test.txt',writeContent,(err)=>{
      if(err){
        throw err;
      }
    })
    res.send({message:`success`});
    
  } catch (error) {
    res.status(500).send({error:error.message})
  }
})
app.get('/removeFile',(req,res)=>{
  try {
    fs.unlink('test.txt',(err)=>{
      if(err){
        throw err;
      }
    })
    res.send({message:`success`});
    
  } catch (error) {
    res.status(500).send({error:error.message})
  }
})
app.get('/fileExists',(req,res)=>{
  try {
    const found = fs.existsSync('package.json');
    res.send({'package file exist': found});
    
  } catch (error) {
    res.status(500).send({error:error.message})
  }
})
app.get('/createPDF',(req,res)=>{
  try {
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.font('./Kanit/Kanit-Medium.ttf').fontSize(25).text("สวัสดีทดสอบ ไทย!",100,100)
    doc.addPage().fontSize(25).text("ไทยหน้า 2.",100,100);
    doc.end();
    res.send({message:'success'});
  } catch (e) {
    res.status(500).send({
      error:e.message
    })
  }
})
app.get('/readExcel',async(req,res)=>{
  try {
    const excel = require('exceljs');
    const wb = new excel.Workbook();
    await wb.xlsx.readFile('productExport.xlsx');
    const ws = wb.getWorksheet(1);
    for( let i = 1; i <= ws.rowCount; i++){
      const row = ws.getRow(i);
      const barCode = row.getCell(1).value;
      const name = row.getCell(2).value;
      const cost = row.getCell(3).value;
      const sale = row.getCell(4).value;
      const send = row.getCell(5).value;
      const unit = row.getCell(6).value;
      const point = row.getCell(7).value;
      const productTypeId = row.getCell(8).value;
      console.log(barCode,name,cost,sale,send,unit,point,productTypeId);
    }
    res.send({message:'success'})
  } catch (e) {
    res.status(500).send({
      error:e.message
    })
  }
})
// app.get('/book/list', async(req,res)=>{
//   const data = await prismaClient.book.findMany();
//   res.send({data:data});
// })

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
app.put('/book/update/:id',async (req, res)=>{
  try{
    await prismaClient.book.update({
      data:{
        isbn: '10022',
        name: 'test update',
        price: 900
      },
      where:{
        id: parseInt(req.params.id)
      }
    });
    res.send({message:'success'});
  }catch(e){
    res.status(500).send({ error: e})
  }
})
app.delete('/book/remove/:id',async (req, res)=>{
  try{
    await prismaClient.book.delete({
      where:{
        id: parseInt(req.params.id)
      }
    });
    res.send({message:'success'});
  }catch(e){
    res.status(500).send({ error: e})
  }
})
app.post('/book/search', async (req,res)=>{
  try {
    const keyword = req.body.keyword;
    const data = await prismaClient.book.findMany({
      where:{
        name:{
          contains: keyword
        }
      }
    });

    res.send({results:data});
  } catch (e) {
    res.status(500).send({ error: e})
  }
});

app.post('/book/startsWith', async (req,res)=>{
  try {
    const keyword = req.body.keyword;
    const data = await prismaClient.book.findMany({
      where:{
        name:{
          startsWith: keyword,
        }
      }
    });

    res.send({results:data});
  } catch (e) {
    res.status(500).send({ error: e})
  }
});
app.post('/book/endsWith', async (req,res)=>{
  try {
    const keyword = req.body.keyword;
    const data = await prismaClient.book.findMany({
      where:{
        name:{
          endsWith: keyword,
        }
      }
    });

    res.send({results:data});
  } catch (e) {
    res.status(500).send({ error: e})
  }
});
app.post('/book/orderBy', async (req,res)=>{
  try {
    const data = await prismaClient.book.findMany({
      orderBy: {
        price:'desc',
      },
    });

    res.send({results:data});
  } catch (e) {
    res.status(500).send({ error: e})
  }
});
app.post('/book/gt', async (req,res)=>{
  try {
    const greaterThan = req.body.keyword;
    const data = await prismaClient.book.findMany({
      where:{
        price:{
          gt:greaterThan
        }
      }
    });

    res.send({results:data});
  } catch (e) {
    res.status(500).send({ error: e})
  }
});
app.post('/book/lt', async (req,res)=>{
  try {
    const lessThan = req.body.keyword;
    const data = await prismaClient.book.findMany({
      where:{
        price:{
          lt:lessThan
        }
      }
    });

    res.send({results:data});
  } catch (e) {
    res.status(500).send({ error: e})
  }
});
app.get('/book/notNull', async (req,res)=>{
  try {
    const lessThan = req.body.keyword;
    const data = await prismaClient.book.findMany({
      where:{
        detail:{
          not: null,
        }
      }
    });

    res.send({results:data});
  } catch (e) {
    res.status(500).send({ error: e})
  }
});
app.get('/book/null', async (req,res)=>{
  try {
    const lessThan = req.body.keyword;
    const data = await prismaClient.book.findMany({
      where:{
        detail:null
      }
    });

    res.send({results:data});
  } catch (e) {
    res.status(500).send({ error: e})
  }
});
app.get('/book/between', async (req,res)=>{
  try {
    const lessThan = req.body.keyword;
    const data = await prismaClient.book.findMany({
      where:{
        price:{
          lte: 1500,
          gte: 700
        }
      }
    });

    res.send({results:data});
  } catch (e) {
    res.status(500).send({ error: e})
  }
});
app.get('/book/sum',async (req,res)=>{
  try {
    const data = await prismaClient.book.aggregate({
      _sum:{
        price:true
      }
    })
    res.send({results:data})
  } catch (e) {
    res.status(500).send({error:e})
  }
})
app.get('/book/max',async (req,res)=>{
  try {
    const data = await prismaClient.book.aggregate({
      _max:{
        price:true
      }
    })
    res.send({results:data})
  } catch (e) {
    res.status(500).send({error:e})
  }
})
app.get('/book/min',async (req,res)=>{
  try {
    const data = await prismaClient.book.aggregate({
      _min:{
        price:true
      }
    })
    res.send({results:data})
  } catch (e) {
    res.status(500).send({error:e})
  }
})
app.get('/book/avg',async (req,res)=>{
  try {
    const data = await prismaClient.book.aggregate({
      _avg:{
        price:true
      }
    })
    res.send({results:data})
  } catch (e) {
    res.status(500).send({error:e})
  }
})
app.get('/book/findYearMonthDay',async(req,res)=>{
  try {
    const data = await prismaClient.book.findMany({
      where: {
        registerDate: new Date('2024-05-08')
      }
    }) 
    res.send({results:data})
  } catch (e) {
    res.status(500).send({error:e})
  }
})
app.get('/book/findYearMonth',async(req,res)=>{
  try {
    const data = await prismaClient.book.findMany({
      select:{
        id: true,
      },
      where: {
        registerDate: {
          gte: new Date('2024-05-01'), // start
          lte: new Date('2024-05-31') // end
        }
      }
    }) 
    res.send({results:data})
  } catch (e) {
    res.status(500).send({error:e})
  }

})
app.get('/book/findYear',async(req,res)=>{
  try {
    const data = await prismaClient.book.findMany({
      select:{
        id: true,
      },
      where: {
        registerDate: {
          gte: new Date('2024-01-01'), // start
          lte: new Date('2024-12-31') // end
        }
      }
    }) 
    res.send({results:data})
  } catch (e) {
    res.status(500).send({error:e})
  }

});
app.get('/user/createToken',(req,res)=>{
  try {
    const secret = process.env.TOKEN_SECRET;
    const payload = {
      id:100,
      name:performance,
      level:'admin'
    }
    const token  = jwt.sign(payload, secret, {expiresIn: '1d'});
    res.send({token: token});
  } catch (e) {
    res.status(500).send({error:e})
  }
});
app.get('/user/verifyToken',(req,res)=>{
  try {
    const secret = process.env.TOKEN_SECRET;
    const token = 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJuYW1lIjp7Im5vZGVUaW1pbmciOnsibmFtZSI6Im5vZGUiLCJlbnRyeVR5cGUiOiJub2RlIiwic3RhcnRUaW1lIjowLCJkdXJhdGlvbiI6Mzg3MDYuNjMwNDAwMDAwMTQsIm5vZGVTdGFydCI6MC4zNzU0MDAwMDExODMxNTIyLCJ2OFN0YXJ0IjoyLjUyNzMwMDAwMDE5MDczNSwiYm9vdHN0cmFwQ29tcGxldGUiOjE1LjI5MzMwMDAwMDk1MDY5NCwiZW52aXJvbm1lbnQiOjYuNDE4NDAwMDAwNzgwODIxLCJsb29wU3RhcnQiOjIwNS4zMTAyMDAwMDAxODE4LCJsb29wRXhpdCI6LTEsImlkbGVUaW1lIjozODQ3MS41MTg3fSwidGltZU9yaWdpbiI6MTcyNjMzMDUyOTY0OS40ODMsImV2ZW50TG9vcFV0aWxpemF0aW9uIjp7ImlkbGUiOjM4NDcxLjUxODcsImFjdGl2ZSI6MjkuNzQzMDAwMDAwNjEzMzkyLCJ1dGlsaXphdGlvbiI6MC4wMDA3NzI1MjAxMzc5NzI4NTI5fX0sImxldmVsIjoiYWRtaW4iLCJpYXQiOjE3MjYzMzA1NjgsImV4cCI6MTcyNjQxNjk2OH0.3J2Vpx_AMIO60UbMqBMEIn6iwTJCXfMc4cOMaGZO6fU";
    const result = jwt.verify(token,secret)

    res.send({results: result});
  } catch (e) {
    res.status(500).send({error:e})
  }
});

app.get('/oneToOne',async(req,res)=>{
  try {
    const data = await prismaClient.orderDetail.findMany({
      include:{
        book: true
      }
    })
    res.send({results:data})
  } catch (e) {
    res.status(500).send({error:e})
  }

});
app.get('/multiModel',async(req,res)=>{
  try {
    const data = await prismaClient.customer.findMany({
      include:{
        Order: {
          include:{
            OrderDetail:true,
          },
          
        },
      },

    })
    res.send({results:data})
  } catch (e) {
    res.status(500).send({error:e.message})
  }

});
app.get('/oneToMany',async(req,res)=>{
  try {
    const data = await prismaClient.book.findMany({
      include:{
          orderDetail:true,          
        
      },

    })
    res.send({results:data})
  } catch (e) {
    res.status(500).send({error:e.message})
  }

});




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

app.delete('/myDelete/:id',(req, res)=>{
  res.send(`My Delete ID = ${req.params.id}`);
})







app.listen(3001,()=>{
  console.log(`app start at port ${PORT}\n
link: http://localhost:${PORT}`);
});

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


