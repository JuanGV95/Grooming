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
});
