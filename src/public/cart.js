document.addEventListener('DOMContentLoaded',()=>{
		const socket = io();

		const cartsContainer = document.getElementById('carts_container');
		//Listar carritos

		const fetchCarts = async()=>{
			try{
				const res = await fetch('http://localhost:8000/api/carts');
				const data = await res.json();
				const cartsArray = data.carts;
				renderCarts(cartsArray)
				console.log(data)
			}catch(e){
				console.log('Error al listar los carritos', e)
			}
		}	

		fetchCarts();


		const renderCarts = async(cartsArray) =>{
		
			cartsContainer.innerHTML = "";

			cartsArray.forEach(c => {

				console.log('Productos en carrito:', c.products);


			const productsInCart = c.products.map(p => `
			<div class="itemProduct"><br><hr>
					<span>Producto:  ${p.product.title} </span></br>
					<span>Descripción:  ${p.product.description} </span></br>
					<span>Cantidad:   ${p.quantity} </span></br>
					<span>Precio:  ${p.product.price} </span></br>
					<button class="btn_see" data-id="${p._id}">Actualizar</button>
				</div>
			`).join('')

			const card = document.createElement('div');
				card.classList.add('cardCart')
				card.innerHTML = `
					<span class="close_card_cart" data-id="${c._id}">&times;</span>
					<h3>Tus productos</h3>
					<span class="date">${new Date(c.createdAt).toLocaleString()}</span>
					<div>Productos:${productsInCart}</div>
				`;
				cartsContainer.appendChild(card)

				card.querySelector('.close_card_cart').addEventListener('click',()=>{
					console.log('Eliminar',c._id)
					socket.emit('deleteCart', c._id);
					socket.on('updatedCarts', carts => {
						renderCarts(carts);
					})
				})
			})

		}

		 
});


