import fs from 'fs';

class CartsManager{
	constructor(){
		this.cartsCollection = [];
		this.path = './src/db/carritos.json';
	}
	//Métodos

	getCarts = async() => {
		try{
			const carts = await fs.promises.readFile(this.path, 'utf-8');
			const cartsList = JSON.parse(carts);
			console.log('Lista de carritos', cartsList);
			return cartsList;
		}catch(error){
			console.log('No se pudo obtener la lista de carritos', error.message);
			await fs.promises.writeFile(this.path, JSON.stringify([]))
			return [];
		}
		
	}

	getCartById = async(cid)=> {
		try{
			const carts = await this.getCarts();
			const cart = carts.find(c => c.cid === parseInt(cid));
			console.log(cart)
			if(!cart){
				throw new Error('Carrito no encontrado');
			}
			console.log('Carrito encontrado', cart)
			return cart;
			
		}catch(error){
			console.log('Carrito no encontrado',error);
		}
	}

	addCart = async(newCart) => {
		try{
			const carts = await this.getCarts();

			const nextId = carts.length > 0 ? Math.max(...carts.map(c => c.cid)) + 1 : 1;
			newCart.cid = nextId;

			carts.push(newCart);
			await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
			console.log('Agregando un carrito', newCart); 
			return newCart;
		}catch(error){
			console.log('No se pudo crear el carrito', error.message);
		}
	}
	addProductToCart = async(cid, pid) => {
		const carts = await this.getCarts();
		const cart = carts.find(c => c.cid === parseInt(cid));
		//Validar carrito
		if(!cart){ 
			throw new Error('No se puede encontrar el carrito')
		}

		//Buscar producto en el carrito
		const productsArray = cart.products;
		const productInCart = productsArray.find(p => p.pid === parseInt(pid));
		
		if(productInCart){
			productInCart.quantity+= 1;
		}else{
			const newProduct = {
				quantity: 1
			}
			const nextId = productsArray.length > 0 ? Math.max(...productsArray.map(p => p.pid)) + 1 : 1;
			newProduct.pid = nextId;
			console.log(newProduct)
		 	productsArray.push(newProduct);	
		}
		await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
		console.log('Se agregó un producto al carrito');
		return cart;
	}

	deleteCart = async(cid) => {
		let carts = await this.getCarts();
		carts = carts.filter(c => c.cid !== parseInt(cid));
		await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
		console.log('Se eliminó el carrito');
	}
}

export default CartsManager;