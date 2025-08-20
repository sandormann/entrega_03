document.addEventListener('DOMContentLoaded',()=>{
	const socket = io();
	
	//Elementos del dom
	const productsContainer = document.getElementById('items_container');
	// const productContainer = document.getElementById('product_container');
	const containerBtn = document.getElementById('container_btn');
	const modalTitle = document.getElementById('modal_title');
	const modal = document.getElementById('modal');
	const modalContent = document.getElementById('modal_content');
	const closeBtn = document.getElementById('closeModal');
	const cartImg = document.querySelector('.cart_image');



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
				<div class="btn_container2">
	 				<button class="btn_delete" data-id="${p._id}">Delete</button>
	 				<button class="btn_see" data-id="${p._id}">Ver</button>
	 			</div>
			`
			productsContainer.appendChild(card)

			card.querySelector('.btn_delete').addEventListener('click',()=>{
	 			console.log(p._id, p.title);
	 			socket.emit('eliminarProducto', p._id)
	 			socket.on('showProducts', products => {
	 				renderProducts(products)
	 			})
	 		})
			card.querySelector('.btn_see').addEventListener('click',()=>{
	 			fetchProduct(p._id, p.title);
	 			modal.classList.remove('hidden');
	 		})
		  })
		}catch(e){
			console.log('Error to get products', e)
		}
	}
	
	//Close modal
	closeBtn.addEventListener('click',()=>{
		modal.classList.add('hidden');
	})
	///Render product
	const renderProduct = async(data)=>{

		
		modalContent.innerHTML = "";
			const cardProduct = document.createElement('div');
			cardProduct.classList.add('cardProduct');

			cardProduct.innerHTML = `
				
				<h1>${data.product.title}</h1>
				<p class="cardProduct_text">${data.product.description}</p>
				<p class="cardProduct_price">Precio: $ ${data.product.price}</p>
				<p class="cardProduct_text">Categoría: ${data.product.category}</p>
				<p class="cardProduct_price">Code: ${data.product.code}</p>
				<div class="btn_container2"> 				
	 				<button class="btn_see btn_product toCart" data-id="${data.product._id}">Agregar</button>
	 			</div>
			</div>`;
			modalContent.appendChild(cardProduct);

	 		cardProduct.querySelector('.toCart').addEventListener('click',()=>{
	 			
	 			const productRefId = data.product._id;
	 			createCart(productRefId);

	 			modalContent.innerHTML = '';
	 			modalContent.innerHTML = `
	 				<span class="label_modal">Producto agregado</span>
	 			`
	 			setTimeout(()=>{
	 				modal.classList.add('hidden');
	 			},2000);
	 			
	 		})
	}



	const fetchProduct = async(id)=>{
		try{
			const res = await fetch(`http://localhost:8000/api/product/${id}`);
    		const data = await res.json();

    		renderProduct(data);

		}catch(e){
			console.log(e)
		}
	}

	//Agregar producto al carrito
	const addProductToCart = async(cartId, productRefId) => {
		try{ 
			const res = await fetch(`http://localhost:8000/api/${cartId}/product/${productRefId}`,{
				method:'POST'
			});
			const result = await res.json();
			console.log('Added product',result);
		
		}catch(e){
			console.log('Error',e)
		}		
	}
	
	//Crear Carrito 
	const createCart = async(productRefId)=>{
		const res = await fetch('/api/cart',{method: 'POST'});
		const newCart = await res.json();
		const cartId = newCart.cartId;

		return cartId;
	}

	
	socket.on('updatedCart',cart =>{
		console.log(cart)
	})

	//Link del Carrito
	cartImg.addEventListener('click',() => {
		window.location.href= '/cart';
	})
	



	//Url
		let defaultFilters = {
			page:1,
			limit:10,
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
		
		return `http://localhost:8000/api/products?${params.toString()}`
	}


	//Productos con fetch
	const fetchProducts = async()=>{
		try{
			const url = buildURL();
			// 'http://localhost:8000/api/products?page=1&limit=8&sort=price';
			const res = await fetch(url);
			const products = await res.json();
			const productsArray = products.products.payload;
			renderProducts(productsArray);
			// console.log('Datos del server',productsArray);
			paginationsControls(products);
			
		}catch(e){
			console.error(e);
		}
	}
	fetchProducts()

	// socket.on('showProducts', (data)=>{
	// 	renderProducts(data)
	// });
	

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
		})

		

			
});