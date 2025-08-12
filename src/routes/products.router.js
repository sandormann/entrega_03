import { Router } from 'express';
import productModel from '../models/product.model.js';

const productsRouter = Router();

//Listar productos
productsRouter.get('/products', async (req,res) => {
	try{
		// const products = await productsManager.getProducts();
		const products = await productModel.find()
		return res.status(200).json({ 
					status: 'success', 
					products
				});
	}catch(e){
		console.log({message: e.message});
		return res.status(500).json({
					status:'Internal error server',
					msg:'View console'
				});
	}
});

//Agregar productos
productsRouter.post('/', async(req,res) => {
	try{
		const { title,description,code,price,status,category } = req.body;
		const newProduct = await productModel.create({title,description,code,price,status,category
		})
		//const product = await productsManager.addProduct(newProduct);
		return res.status(200).json({
					status:'success', 
					newProduct
				});	
	}catch(e){
		console.log({message: e.message});
		return res.status(500).json({
					status:'Internal error server',
					msg:'View console'
				});
	}	
});

//Buscar porducto por id
productsRouter.get('/:pid', async(req,res)=>{
	try{
		const { pid } = req.params;
		// const product = await productsManager.getProductById(pid);
		const product = await productModel.findById({_id: pid})
		return res.status(200).json({ 
				status:"success",
				product
			});
	}catch(e){
		console.log({message: e.message});
		return	res.status(500).json({
			status:"Internal error server", 
			msg:'View console',
		})
	}
	
});

//Actualizar producto
productsRouter.put('/:pid', async(req,res) => {
	try{
		const { pid } = req.params;
		const { body } = req;
		let updatedProduct = await productModel.updateOne({_id:pid}, {$set: {...body}})
		// const product = await productsManager.updateProduct(pid, { title, description, code, price, status, stock, category, thumbnails });
		// if(!product){
		// 	res.status(500).json({
		// 		status:'error', 
		// 		msg: "Producto no encontrado"
		// 	});
		// }

		return res.status(200).json({
			status:'success',
			updatedProduct
		});		
	}catch(e){
		console.log({message: e.message})
		return res.status(500).json({
			status:'Internal error server', 
			msg: "View console"
		});
	}  	
});

//Eliminar producto
productsRouter.delete('/products/:pid',async(req,res)=>{
	
	try{
		const { pid } = req.params;	
		let response = await productModel.findByIdAndDelete(pid)
		return res.status(200).json({ 
			status:"success",
			response
		});
	}catch(e){
		console.log({message: e.message});
		return res.status(500).json({
			status:'Internal error server', 
			msg:'View console'
		})
	}
})

export default productsRouter;
