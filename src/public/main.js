document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const form = document.getElementById("agregarProducto");

    form.addEventListener('submit', async(e) => {
        e.preventDefault();

        const title       = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const code        = document.getElementById("code").value;
        const price       = document.getElementById("price").value;
        const status      = document.getElementById("status").value;
        const category    = document.getElementById("category").value;

        const producto = {title,description,code,price,status,category};
        //Enviar el producto por el emit
        socket.emit('addProduct',producto);
        console.log(producto);

        //Enviar al endpoint 
        try{

            const res = await fetch('http://localhost:8000/api/products',{
                method: 'POST',
                headers: { 'content-type':'application/json'},
                body: JSON.stringify(producto)
            })

            const result = await res.json();
            if(res.ok){
                console.log('Product saved in mongo DB', result);
            }else{
                console.log('Error to save in DB', result.message);
            }

        }catch(e){
            console.log('Error to get product',e)
        }
        form.reset();
    });
    
});