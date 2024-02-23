document.addEventListener('DOMContentLoaded', function () {
  const resetPasswordForm = document.querySelector('form');

  resetPasswordForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const password = resetPasswordForm.querySelector('[name="newPassword"]').value;
    const confirmPassword = resetPasswordForm.querySelector('[name="confirmPassword"]').value;

    if (password !== confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    try {
      const token = window.location.pathname.split('/').pop();

      const response = await fetch(`/api/auth/recovery/${token}`, { 
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }), 
      });
      

      if (!response.ok) {
        console.error('Error:', response.statusText);
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
