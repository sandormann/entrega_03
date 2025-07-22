document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const form = document.getElementById("agregarProducto");

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title       = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const code        = document.getElementById("code").value;
        const price       = document.getElementById("price").value;
        const status      = document.getElementById("status").value;
        const category    = document.getElementById("category").value;

        const producto = {title,description,code,price,status,category};
        socket.emit('addProduct',producto);
        // console.log(producto);
        form.reset();
    });
});