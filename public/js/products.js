document.addEventListener('DOMContentLoaded', () => {
    const userCartId = localStorage.getItem('cart');

    // Agrega el evento después de que la página esté completamente cargada
    const buttons = document.querySelectorAll('.verDetalle');
    const buttonsAdd = document.querySelectorAll('.agregarACarrito');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = button.getAttribute('data-id');
            alert(`Detalles del producto con ID: ${productId}`);
            window.location.href = `/api/products/${productId}`;
        });
    });

    buttonsAdd.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();

            if (!userCartId) {
                alert('Debes iniciar sesión para agregar productos al carrito.');
                // Opcional: Redirige al usuario a la página de inicio de sesión
                return;
            }

            const productId = button.getAttribute('data-id');
            alert(`Agregarás el producto con ID: ${productId}`);

            try {
                const response = await fetch(`/api/carts/${userCartId}/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: 1 }),
                });

                if (response.ok) {
                    alert('Producto agregado al carrito exitosamente.');
                    // Opcional: Actualizar la interfaz de usuario aquí
                } else {
                    alert('Error al agregar el producto al carrito.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al procesar la solicitud.');
            }
        });
    });

    function setupPaginationListeners() {
        const prevLink = document.querySelector('.pagination a[href="{{prevLink}}"]');
        const nextLink = document.querySelector('.pagination a[href="{{nextLink}}"]');
        
        if (prevLink && nextLink) {
            prevLink.addEventListener('click', handlePaginationClick);
            nextLink.addEventListener('click', handlePaginationClick);
        } else {
            console.error('No se encontraron los enlaces de paginación en el DOM.');
        }
    }

    // Llama a la función para configurar los listeners después de renderizar los enlaces de paginación
    setupPaginationListeners();

    async function handlePaginationClick(event) {
        try {
            event.preventDefault();
            const url = this.getAttribute('href');
            
            // Realizar una solicitud fetch para obtener los datos de la página de paginación
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la página de paginación');
            }
            
            // Extraer los datos de la respuesta
            const data = await response.json();
            
            // Actualizar la lista de productos en la página con los nuevos datos
            updateProductList(data);
        } catch (error) {
            console.error('Error en la paginación:', error);
            // Manejar el error, por ejemplo, mostrar un mensaje al usuario
        }
    }
    
    
});
