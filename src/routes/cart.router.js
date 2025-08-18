import { Router } from 'express';
import cartModel from '../models/cart.model.js';

const cartRouter = Router();

//Listar carrito
cartRouter.get('/carts', async(req,res)=>{
	try{
		// const carts = cartsManager.getCarts();
		const carts = await cartModel.find();
		return res.status(200).json({
			status: 'success', 
			carts 
		});		
	}catch(e){
		console.error({message: e.message})
		return res.status(500).json({
			status:'Internal error server',
			msg:'View console'
		});
	}

});
//Listar carrito por id
cartRouter.get('/:cid',async(req,res)=>{
	try{
		const { cid } = req.params;
		
		const cart = await cartModel.findById(cid);
		res.status(200).json({
			status:"success",
			cart
		})
	}catch(e){
		console.error({message: e.message})
		return res.status(500).json({
			status: 'Internal error server',
			msg: 'View console'
		})
	}
		
})		

//crear carrito
cartRouter.post('/cart',async(req,res)=>{
	try{
			const newCart = await cartModel.create({products: []})
			return res.status(201).json({
					status:'success',
					newCart
				});	
	}catch(e){
		console.log({message: e.message})
		return res.status(500).json({
					status:'Internal error server',
					msg:'View console'
				});
	}
});

//Agregar producto al carrito
cartRouter.post('/:cid/products/:pid',async(req,res)=>{
	const { cid, pid } = req.params;
	try{

		const cart = cartsManager.addProductToCart(cid, pid);
		
		if(!cart){
			return res.status(404).json({
				status:'Error',
				msg: 'Carrito no encontrado'				
			})
		}

		return res.status(200).json({
				status:'success', 
				cart
		});
	}catch(error){
		return res.status(500).json({
				status:"Error", 
				msg:"Error en el servidor"
			});
	}
})
//Borrar carrito
cartRouter.delete('/:cid', async(req,res)=> {
	const { cid } = req.params;

	try{
		// const cart = await cartsManager.deleteCart(cid);
		const cart = await cartModel.findByIdAndDelete(cid)
		return res.status(200).json({
			status: 'success',
			cart
		})
	}catch(e){
		console.error({message: e.message})
		return res.status(500).json({
			status: 'Internal error server',
			msg:'View console'
		})

	}
})
export default cartRouter;
 