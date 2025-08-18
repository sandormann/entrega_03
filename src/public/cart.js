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
				const card = document.createElement('div');
				card.classList.add('cardCart')
				card.innerHTML = `
					<span class="close_card_cart" data-id="${c._id}">&times;</span>
					<h3>Tus productos</h3>
					<span>${c._id}</span>
					<span class="date">${new Date(c.createdAt).toLocaleString()}</span>
					<div>Productos:${c.products}</div>
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


