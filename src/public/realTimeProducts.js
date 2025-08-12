document.addEventListener('DOMContentLoaded',()=>{
	const socket = io();

	
	//Elementos del dom
	const productsContainer = document.getElementById('items_container');

	const renderProducts = async(products)=>{
		try{
			productsContainer.innerHTML = "";
			products.forEach(p => {
				const card = document.createElement('div');
				card.classList.add('card');

				card.innerHTML = `
				<p class="card_title">${p.title}</p>
				<p class="card_text">${p.description}</p>
				<p class="card_price">Precio: $ ${p.price}</p>
				<p class="card_text">Categoría: ${p.category}</p>
				<p class="card_price">Code: ${p.code}</p>
				<div class="btn_container">
	 				<button class="btn_delete" data-id="${p._id}">Delete</button>
	 			</div>
			`
			productsContainer.appendChild(card)

			card.querySelector('.btn_delete').addEventListener('click',()=>{
	 			console.log(p._id + p.title);
	 			socket.emit('eliminarProducto', p._id)
	 		})

			})
		}catch(e){
			console.log('Error to get products', e)
		}
	}
	
	//Productos con fetch
	const fetchProducts = async()=>{
		try{
			const res = await fetch('http://localhost:8000/api/products');
			const products = await res.json();
			renderProducts(products);
			// console.log('Datos del server',products);
			
		}catch(e){
			console.error(e);
		}
	}
	fetchProducts()

	socket.on('showProducts', (data)=>{
		renderProducts(data)
	});
});