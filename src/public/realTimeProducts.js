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
	const renderProduct = async(product)=>{

		
		modalContent.innerHTML = "";
			const cardProduct = document.createElement('div');
			cardProduct.classList.add('cardProduct');

			cardProduct.innerHTML = `
				
				<h1>${product.product.title}</h1>
				<p class="cardProduct_text">${product.product.description}</p>
				<p class="cardProduct_price">Precio: $ ${product.product.price}</p>
				<p class="cardProduct_text">Categoría: ${product.product.category}</p>
				<p class="cardProduct_price">Code: ${product.product.code}</p>
				<div class="btn_container2"> 				
	 				<button class="btn_see btn_product toCart" data-id="${product.product._id}">Agregar</button>
	 			</div>
			</div>`;
			modalContent.appendChild(cardProduct);

	 		cardProduct.querySelector('.toCart').addEventListener('click',()=>{
	 			createCart();
	 			// window.location.href='/cart';
	 			modalContent.innerHTML = '';
	 			modalContent.innerHTML = `
	 				<span class="label_modal">Producto agregado</span>
	 			`
	 			setTimeout(()=>{
	 				modal.classList.add('hidden');
	 			},2000)
	 				
	 			
	 			return product.product._id;
	 			
	 		})


		console.log(product.product.title);
	}
	//Crear Carrito 
	const createCart = async()=>{
		const res = await fetch('/api/cart',{method: 'POST'});
		const newCart = await res.json()
		console.log(newCart.cartId)
	}
	//Agregar producto al carrito
	const addProductToCart = async(id) => {
		const pid = id;
		try{
			const res = fetch(`http://localhost:8000/api/${pid}`,{
				method: 'POST',
				headers:{ 'content-type':'application/json'},
				body: JSON.stringify()
			})

			const data = await res.jsoin();
			if(data.status === 'success'){
				console.log('Product added')
				// showModal(`Producto ${pid} agregado al carrito`);
				// updateCartCounter(data.cart.products.length);
			}else{
				showModal(`Error ${data.msg}`);
			}
		}catch(e){
			showModal(`Error`)
		}
		
	}
	cartImg.addEventListener('click',() => {
		window.location.href= '/cart';
	})
	// const showConfirmModal = (msg)=>{
	// 	modalContent.
	// }
	//fetchPro
	const fetchProduct = async(id)=>{
		const res = await fetch(`http://localhost:8000/api/product/${id}`);
		const product = await res.json();

		renderProduct(product) 
	}
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