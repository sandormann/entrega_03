document.addEventListener('DOMContentLoaded',()=>{
	const socket = io();

	//Elementos del dom
	const productsContainer = document.getElementById('items_container');

	const renderProducts = (products) => {
		//Limpiar contenedor
		productsContainer.innerHTML = "";

		products.forEach(p => {
			//Crear elemento card
			const card = document.createElement('div');
			card.classList.add('card');
			card.innerHTML = `
				<p class="card_title">${p.title}</p>
				<p class="card_text">${p.description}</p>
				<p class="card_price">$ ${p.price}</p>
				<div class="btn_container">
					<button class="btn_delete" data-id="${p.pid}">Delete</button>
				</div>
			`
			productsContainer.appendChild(card)

			card.querySelector('.btn_delete').addEventListener('click',()=>{
				socket.emit('eliminarProducto', p.pid)
			})
		})

	}

	socket.on('showProducts', (data)=>{
		renderProducts(data)
	});

});