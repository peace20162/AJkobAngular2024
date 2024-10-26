// Import required modules
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const UserController = require('./controllers/UserController');
const FoodTypeController = require('./controllers/FoodTypeController');
const FoodSizeController = require('./controllers/FoodSizeController');
const TasteController = require('./controllers/TasteController');
const FoodController = require('./controllers/FoodController');
const SaleTempController = require('./controllers/SaleTempController');


// Initialize an Express application
const app = express();
// Configure environment variables from .env file
dotenv.config();

// Define the port for the server to listen on
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//For getting the file from frontend
app.use('/uploads', express.static('./uploads'))
//For angular frontend to get the data from backend
app.use(cors());
app.use(fileUpload());
app.post('/api/user/signin', (req, res) => UserController.signIn(req,res))
app.post('/api/foodType/create',(req, res)=> FoodTypeController.createFoodType(req,res))
app.get('/api/foodType/list',(req, res)=> FoodTypeController.listFoodType(req,res))
app.delete('/api/foodType/remove/:id',(req, res)=> FoodTypeController.removeFoodType(req,res))
app.put('/api/foodType/update',(req, res)=> FoodTypeController.updateFoodType(req,res))
app.post('/api/foodSize/create',(req, res)=> FoodSizeController.createFoodSize(req,res))
app.get('/api/foodSize/list',(req, res)=> FoodSizeController.listFoodSize(req,res))
app.get('/api/foodSize/filter/:foodTypeId', (req, res) =>FoodSizeController.filterFoodSize(req, res));
app.put('/api/foodSize/update', (req, res) =>   FoodSizeController.updateFoodSize(req, res) );
app.delete('/api/foodSize/remove/:id', (req, res) => FoodSizeController.removeFoodSize(req, res));
app.post('/api/taste/create',(req, res)=> TasteController.createTaste(req,res));
app.get('/api/taste/list',(req, res)=> TasteController.listTaste(req,res));
app.delete('/api/taste/remove/:id',(req, res)=> TasteController.removeTaste(req,res));
app.put('/api/taste/update',(req, res)=> TasteController.updateTaste(req,res));
app.post('/api/food/create',(req, res)=> FoodController.createFood(req,res));
app.get('/api/food/list',(req, res)=> FoodController.listFood(req,res));
app.delete('/api/food/remove/:id',(req, res)=> FoodController.removeFood(req,res));
app.put('/api/food/update',(req, res)=> FoodController.updateFood(req,res));
app.post('/api/food/upload',(req, res)=> FoodController.uploadFoodImage(req,res));
app.delete('/api/food/removeImage/:id',(req, res)=> FoodController.removeFoodImage(req,res));
app.get('/api/food/filter/:foodType', (req, res) =>FoodController.filter(req, res));
app.post('/api/saleTemp/create',(req, res)=> SaleTempController.createSaleTemp(req,res))

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    // Log the server status once it is running
    console.log(`API server running at ${PORT}`);
});