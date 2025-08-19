import { Router } from 'express';
import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

const cartRouter = Router();

//Listar carrito
cartRouter.get('/carts', async(req,res)=>{
	try{
		// const carts = cartsManager.getCarts();
		const carts = await cartModel.find().populate('products.product');
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
		
		const cart = await cartModel.findById(cid).populate('products');
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
			const newCart = await cartModel.create({products: []});
			console.log('Id',newCart.id)
			return res.status(201).json({
					status:'success',
					cartId: newCart.id
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
cartRouter.post('/:cid/product/:pid',async(req,res)=>{
	const { cid, pid } = req.params;
	try{

		const cart = await cartModel.findById(cid);
		if(!cart){
			return res.status(404).json({
				status:'Error',
				msg: 'Carrito no encontrado'				
			})
		}
		
		const product = await productModel.findById(pid);
		if(!product){
			return res.status(404).json({
				status:'Error',
				msg:'Producto no encontrado'
			})
		}


		cart.products.push({product: pid, quantity:1})
		await cart.save()
		const updatedCart = await cartModel.findById(cid).populate('products.product');
		return res.status(200).json({
				status:'success', 
				cart:updatedCart,
				product
		});

// const existingProduct = cart.products.find(p => p.product.toString() === pid);
// if (existingProduct) {
//   existingProduct.quantity += 1;
// } else {
//   cart.products.push({ product: pid, quantity: 1 });
// }		
	}catch(error){
		return res.status(500).json({
				status:"Error", 
				msg:"Error en el servidor",
				error: error.message
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
 