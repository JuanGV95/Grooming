document.addEventListener('DOMContentLoaded', function () {
    const resetPasswordForm = document.querySelector('form');
  
    resetPasswordForm.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const password = resetPasswordForm.querySelector('[name="newPassword"]').value;
      const confirmPassword = resetPasswordForm.querySelector('[name="confirmPassword"]').value;
  
      // Verificar si las contraseñas coinciden
      if (password !== confirmPassword) {
        console.error('Las contraseñas no coinciden');
        return;
      }
  
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token'); // Obtener el token de recuperación de la URL
      
      try {
        const response = await fetch('/api/auth/recovery', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password, token }),
        });
        console.log('token', token);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error:', errorData.message);
          return;
        }
  
        console.log('Contraseña actualizada exitosamente');
        // Redirigir al usuario al inicio de sesión
        window.location.href = '/login';
  
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
      }
    });
});
