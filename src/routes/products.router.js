import { Router } from 'express';
import ProductsManager from '../managers/productsManager.js';

const productsRouter = Router();

const productsManager = new ProductsManager();

//Listar productos

productsRouter.get('/', async (req,res) => {
	try{
		const products = await productsManager.getProducts();
		return res.status(200).json({ 
					status: 'success', 
					products
				});	
	}catch(error){
		res.status(500).json({
					status:'error',
					msg:'Error al obtenes los productos'
				});
	}
});

//Agregar productos

productsRouter.post('/', async(req,res) => {
	
	try{
		const { title,description,code,price,status,category,thumbnails } = req.body;
	
		const newProduct = {  
			title,
			description,
			code,
			price,
			status,
			category,
			thumbnails
		}

		const product = await productsManager.addProduct(newProduct);
		return res.status(201).json({
					status:'success',
					newProduct
				});	
	}catch(error){
		console.log('Error al crear el producto', error);
		return res.status(500).json({
					status:'Error',
					msg:'Error del servidor'
				});
	}	
	
});

//Buscar porducto por id

productsRouter.get('/:pid', async(req,res)=>{
	try{
		const { pid } = req.params;
		const product = await productsManager.getProductById(pid);
		res.status(200).json({ 
			status:"success",
			pid, 
			msg: product
		});
	}catch(error){
		return res.status(404).json({
			status:"Error", 
			msg:'Producto no encontrado',
		})
	}
	
});

//Eliminar producto
productsRouter.delete('/:pid',async(req,res)=>{
	try{
		const { pid } = req.params;	
		await productsManager.deleteProduct(pid)
		res.status(200).json({ 
			status:"success",
			pid
		});
	}catch(error){
		console.log('Producto no eliminado', error);
		res.status(500).json({
			status:'error', 
			msg:'Producto no eliminado'})
	}
	
	
	
})

//Actualizar producto

productsRouter.put('/:pid', async(req, res) => {
	try{
		const { pid } = req.params;
		const { title, description, code, price, status, stock, category, thumbnails } = req.body;
		const product = await productsManager.updateProduct(pid, { title, description, code, price, status, stock, category, thumbnails });
		
		if(!product){
			res.status(500).json({
				status:'error', 
				msg: "Producto no encontrado"
			});
		}

		res.status(200).json({
			status:'success',
			pid,
			product
		});		
	}catch(error){
		return res.status(500).json({
			status:'error', 
			msg: "Error del servidor"
		});
	}  	
});
export default productsRouter;
