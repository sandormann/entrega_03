document.addEventListener('DOMContentLoaded',()=>{
	const socket = io();
	
	//Elementos del dom
	const productsContainer = document.getElementById('items_container');

	const renderProducts = async(productsArray)=>{
		try{
			productsContainer.innerHTML = "";
			productsArray.forEach(p => {
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
	
	//Url
		let defaultFilters = {
			page:1,
			limit:3,
			sort:'price',
			// category:''
		}
	const buildURL = ()=>{	
		const filters = { ...defaultFilters }; 
		const params = new URLSearchParams();
		if(filters.page) params.set('page', filters.page);
		if(filters.page) params.set('limit', filters.limit);
		params.set('sort', filters.sort);
		// params.set('category', category);

		// return
		console.log(filters.page) 
		console.log(`http://localhost:8000/api/products?${params.toString()}`)
		return `http://localhost:8000/api/products?${params.toString()}`
	}


	//Productos con fetch
	const fetchProducts = async()=>{
		try{
			const url = buildURL();
			// 'http://localhost:8000/api/products?page=1&limit=8&sort=price';
			const res = await fetch(url);
			const products = await res.json();
			const productsArray = products.products.docs;
			renderProducts(productsArray);
			// console.log('Datos del server',productsArray);
			console.log(products)
			paginationsControls(products);
			buildURL()
			
		}catch(e){
			console.error(e);
		}
	}
	fetchProducts()

	socket.on('showProducts', (data)=>{
		renderProducts(data)
	});
	

	//Paginación
	const prevBtn = document.getElementById('prevPage');
	const nextBtn = document.getElementById('nextPage');
	const textPage = document.getElementById('infoPage');

	let  totalPages = 1;
	let isLoading = false;

	//Actualización de páginas
	const paginationsControls = async(products) => {
		textPage.textContent = `Página ${products.products.page} de ${products.products.totalPages}`
		prevBtn.disabled = !products.products.hasPrevPage; 
		nextBtn.disabled = !products.products.hasNextPage;

		totalPages = products.products.totalPages;
	}
	
		prevBtn.addEventListener('click',()=>{

			if(defaultFilters.page <= 1 || isLoading  )return;
	
				defaultFilters.page-=1;	
				isLoading = true;

				fetchProducts().finally(()=>{
					isLoading = false
				})
			
		})

		nextBtn.addEventListener('click',()=>{
			if(defaultFilters.page >= totalPages || isLoading)return;
			
				defaultFilters.page+=1;	
				isLoading = true;

				fetchProducts().finally(()=>{
					isLoading=false;
				})
			 
			console.log(defaultFilters.page)
		})
	
});