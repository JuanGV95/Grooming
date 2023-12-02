document.addEventListener('DOMContentLoaded', () => {
    // Agrega el evento después de que la página esté completamente cargada
    const buttons = document.querySelectorAll('.verDetalle');
    const buttonsAdd = document.querySelectorAll('.agregarACarrito');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = button.getAttribute('data-id');
            alert(`Detalles del producto con ID: ${productId}`);
            // Redirige a la ruta del producto con el ID correspondiente
            window.location.href = `/api/products/${productId}`;
        });
    });

    buttonsAdd.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const productId = button.getAttribute('data-id');
            alert(`Agregarás el producto con ID: ${productId}`);

            // Realiza la solicitud POST para agregar el producto al carrito
            try {
                const response = await fetch(`/api/carts/655983d09e8e817f3c803a05/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        // Agrega otros encabezados según sea necesario
                    },
                    // Puedes enviar datos adicionales en el cuerpo si es necesario
                     body: JSON.stringify({ quantity: 1 }),
                });

                if (response.ok) {
                    alert('Producto agregado al carrito exitosamente.');
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
