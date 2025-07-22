import fs from 'fs';

class ProductsManager{
	constructor(){
		this.productsCollection = [];
		this.path = './src/db/productos.json';
	}

	//Métodos

	getProducts = async() => {
		try{
			const products = await fs.promises.readFile(this.path, 'utf-8');
			const productsList = JSON.parse(products)
			console.log('Lista de productos',productsList)
			return productsList;
			
		}catch(err){
			console.log('No se pudo obtener la lista de productos');
			await fs.promises.writeFile(this.path, JSON.stringify([]))
			return [];
		}
	}

	getProductById = async(pid)=> {
		try{
			const products = await this.getProducts();
			const product = products.find(p => p.pid === parseInt(pid));
			console.log('Producto encontrado', product)
			return product;
			
		}catch(error){
			console.log('Producto no encontrado',error);
		}
	}

	deleteProduct = async(pid)=> {
		try{
		let products = await this.getProducts();
		//Filtrar para mostrar el arreglo para mostrarlo sin el elemento
		products = products.filter(p => p.pid !== parseInt(pid));
		await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
		console.log('Producto eliminado', pid);
		}catch(error){
			console.log('No se pudo borrar el producto', error)
		}
		
	}
	addProduct = async(newProduct) => {
		try{
			const products = await this.getProducts();

			const nextId = products.length > 0 ? Math.max(...products.map(p => p.pid)) + 1 : 1;
			newProduct.pid = nextId;
			//Agregar al arreglo
			products.push(newProduct);
			await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
			console.log('Agregando un producto', products)
			return newProduct;
		}catch(error){
			console.log('No se pudo agregar el producto', error.message);
			throw error;
		}		
	}
	updateProduct = async(pid, updatedFields) => {

		try{
			const products = await this.getProducts();

			const product = products.find(u => u.pid === parseInt(pid))
			if(!product){
				console.log('Producto no actualizado', pid);
				return null;	
			}else{
				console.log('Producto actualizado', pid);		
			}
			const {
			    title,
			    description,
			    code,
			    price,
			    status,
			    stock,
			    category,
			    thumbnails
			} = updatedFields;

			//actualizar los datos
			product.title = title || product.title
			product.description = description || product.description
			product.code = code || product.code
			product.price = price || product.price
			product.status = status || product.status
			product.stock = stock || product.stock
			product.category = category || product.category
			product.thumbnails = thumbnails || product.thumbnails

			await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
				
			return product;

		}catch(error){
			console.log('Producto no encontrado',pid)
		}
	}
}

export default ProductsManager;