//cliente
const socket = io();

socket.on('client-emit', (data) => {
  console.log('event client-emit', data);
});

function confirmarEliminacion(product) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el producto permanentemente',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      // El usuario ha confirmado la eliminación, emitir el evento "deleteProduct"
      socket.emit('deleteProduct', product._id);
    }
  });
}


socket.on('getProducts', (products) => {
  console.log("getProducts", products);
  const contenedorCard = document.getElementById('contenedorCard');
  
  contenedorCard.innerHTML = "";

  products.forEach(product => {
    const productCard = document.createElement("section");
    productCard.className = "card";
    productCard.innerHTML = `
      <img src="../img/${product.thumbnails}">
      <h2>${product.title}</h2>
      <p><span>Categoria</span>: ${product.category}</p>
      <article class="card-price">
        <p><span>Precio</span>: ${product.price}</p>
        <p><span>Stock</span>: ${product.stock}</p>   
      </article>
      <p><span>Cod. producto</span>: ${product.code}</p>
      <button class="card-boton-borrar" id="deleteProduct${product._id}">Eliminar Producto</button>
    `;
    contenedorCard.appendChild(productCard);
  });
  products.forEach(product => {
    const deleteButton = document.getElementById(`deleteProduct${product._id}`);
    deleteButton.addEventListener('click', () => {
      confirmarEliminacion(product);
    });
  });
});

const addProductForm = document.getElementById('agregarProducto');
addProductForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('titleInput').value;
  const description = document.getElementById('descriptionInput').value;
  const price = document.getElementById('priceInput').value;
  const status = document.getElementById('statusInput').value;
  const category = document.getElementById('categoryInput').value;
  const thumbnails = document.getElementById('thumbnailsInput').value;
  const code = document.getElementById('codeInput').value;
  const stock = document.getElementById('stockInput').value;

  const newProduct = {
    title,
    description,
    price,
    status,
    category,
    thumbnails,
    code,
    stock,
  };

  // Emitir el evento 'addProduct' con el nuevo producto
  socket.emit('addProduct', newProduct);
  console.log('Producto enviado', newProduct);
});

socket.on('productDeleted', (productId) => {
 console.log(`Producto eliminado ${productId}`)
});


