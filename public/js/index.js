//cliente
const socket = io();
socket.on("getProducts", (products) => {
  console.log("getProducts", products);
  const contenedorCard = document.getElementById('contenedorCard');
  
  contenedorCard.innerHTML = "";

  products.forEach(product => {
    const productCard = document.createElement("section");
    productCard.className = "card";
    productCard.innerHTML = `
      <img src="../img/Star_Wars_Logo.svg.png" alt="Imagen de prueba" class="card-img">
      <h2>${product.title}</h2>
      <p><span>Categoria</span>: ${product.category}</p>
      <article class="card-price">
        <p><span>Precio</span>: ${product.price}</p>
        <p><span>Stock</span>: ${product.stock}</p>   
      </article>
      <p><span>Cod. producto</span>: ${product.code}</p>
      <button id="deleteProduct${product.id}">Eliminar Producto</button>
    `;
    contenedorCard.appendChild(productCard);
  });
  products.forEach(product => {
    const deleteButton = document.getElementById(`deleteProduct${product.id}`);
    deleteButton.addEventListener('click', (event) => {
      socket.emit('deleteProduct', product.id);
    });
  });
});

socket.on('productDeleted', (productId) => {
 console.log(`Producto eliminado ${productId}`)
});
