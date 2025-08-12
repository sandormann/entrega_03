import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import viewsRouter from './routes/views.router.js';
import allRoutes from './routes/products.router.js';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import productModel from './models/product.model.js';
import dataBase from './db/connectionDB.js';

import ProductsManager from './managers/productsManager.js';
const productsManager = new ProductsManager();
const app = express();
const PORT = 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//Carpeta Public
app.use(express.static(path.join(__dirname, 'public')))

//Servidor con http
const serverHttp = http.createServer(app);
//Se inica el servidor con io
const io = new Server(serverHttp);

// let messages = [];
io.on('connection', async(socket)=>{
	console.log("Cliente conectado", socket.id);

	const products = await productModel.find();
	socket.emit('showProducts', products);

	socket.on('eliminarProducto', async(id)=>{
		await productModel.findByIdAndDelete(id);
		//Envío del resultado
		io.emit('showProducts', await productModel.find());
	});

	socket.on('addProduct', async(producto)=>{
		try{
			const { title,description,code,price,status,category} = producto;
			await productModel.create({title,description,code,price,status,category});
		}catch(e){
			console.log(e)
		}
			
	});
});

//Config HBS
app.engine('handlebars', engine({
	extname:'.handlebars',
	defaultLayout:'main',
	layoutsDir:path.join(__dirname, './views/layouts'),
	partialsDir:path.join(__dirname,'./views/partials')
}));
app.use(express.json())
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//Rutas del views
app.use('/', viewsRouter);
//Rutas del router
app.use('/api', allRoutes);
//Config websocket
serverHttp.listen(PORT, ()=>{
	console.log(`On port ${ PORT }`)
});

//DB Mongo Connection

dataBase();

