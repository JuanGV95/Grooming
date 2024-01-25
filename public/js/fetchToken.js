  document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const email = loginForm.querySelector('[name="email"]').value;
      const password = loginForm.querySelector('[name="password"]').value;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error:', errorData.message);
          return;
        }

        const responseData = await response.json();
        console.log('Login successful. Token:', responseData.token);

        // Redirigir al usuario a la página deseada en el frontend
        window.location.href = '/api/products';
      } catch (error) {
        console.error('Error during login:', error);
      }
    });
  });

