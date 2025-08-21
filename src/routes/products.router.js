import { Router } from 'express';
import productModel from '../models/product.model.js';
import { PaginationParameters } from 'mongoose-paginate-v2';
const productsRouter = Router();

//Listar productos
productsRouter.get('/products', async (req,res) => {
	try{
		// const parsedQuery = new PaginationParameters(req);
		// const queries = parsedQuery.get();
		const {page,limit,sort, category} = req.query;
		const filter = {};
		if(category) filter.category = category;
		const options = {
			page: parseInt(page),
			limit: parseInt(limit),
			sort: {[sort]: 1}
		}
		// const products = await productModel.paginate(...queries);
		const products = await productModel.paginate(filter,options);
		// console.log(products.page)		
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
productsRouter.post('/products', async(req,res) => {
 	try{
		const { title,description,code,price,status,category } = req.body;
		const newProduct = await productModel.create({title,description,code,price,status,category})
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

//Buscar producto por id
productsRouter.get('/product/:pid', async(req,res)=>{
	try{
		const { pid } = req.params;

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
