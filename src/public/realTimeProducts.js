document.addEventListener('DOMContentLoaded',()=>{
	const socket = io();

	
	//Elementos del dom
	const productsContainer = document.getElementById('items_container');

	const renderProducts = async(products)=>{
		try{
			products.forEach(p => {
				const card = document.createElement('div');
				card.classList.add('card');

				card.innerHTML = `
				<p class="card_title">${p.title}</p>
				<p class="card_text">${p.description}</p>
				<p class="card_price">$ ${p.price}</p>
			`
			productsContainer.appendChild(card)
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
			console.log('Datos del server',products);
			renderProducts(products);
		}catch(e){
			console.error(e);
		}
	}
	fetchProducts()
	
	socket.on('showProducts', (data)=>{
		renderProducts(data)
	});
});