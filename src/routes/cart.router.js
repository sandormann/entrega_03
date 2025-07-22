import { Router } from 'express';
const cartRouter = Router();

import CartsManager from '../managers/cartsManager.js';
const cartsManager = new CartsManager();

//Listar carrito
cartRouter.get('/', async(req,res)=>{
	try{
		const carts = cartsManager.getCarts();
		res.status(200).json({
			status: 'success', 
			carts 
		});		
	}catch(error){
		res.status(500).json({
			status:'error',
			msg:'Error al obtenes los carritos'
		});
	}

});
//Listar carrito por id
cartRouter.get('/:cid',async(req,res)=>{
	try{
		const { cid } = req.params;
		const cart = await cartsManager.getCartById(cid);
		if(!cart){
			res.status(404).json({
				status:"Error", 
				msg:'Carrito no encontrado',
			})
		}
		
		res.status(200).json({
			status:"success",
			cid,
			msg: cart
		})
	}catch(error){
		console.log('Error en el servidor')
	}
		
})		

//crear carrito
cartRouter.post('/',async(req,res)=>{
	try{
			const newCart = { 
					products: []
				}

			const cart = await cartsManager.addCart(newCart);
			return res.status(201).json({
					status:'success',
					newCart
				});	
	}catch(error){
		return res.status(500).json({
					status:'Error',
					msg:'Error del servidor'
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
cartRouter.delete('/:cid', async(req,res)=> {
	const { cid } = req.params;

	try{
		const cart = await cartsManager.deleteCart(cid);
		return res.status(200).json({
			status: 'success',
			msg:'Carrito eliminado'
		})
	}catch(error){
		return res.status(500).json({
			status: 'error',
			msg:'Error en el servidor'
		})

	}
})
export default cartRouter;
