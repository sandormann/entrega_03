document.addEventListener('DOMContentLoaded',()=>{
		console.log('Lógica del carrito');

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

				card.innerHTML = `
					<span class="close" id="close">&times;</span>
					<h3>Tus productos</h3>
					<span>${c._id}</span>
					<span class="date">${new Date(c.createdAt).toLocaleString()}</span>
					<div>Productos:${c.products}</div>
				`;
				cartsContainer.appendChild(card)
			})

		}
});


