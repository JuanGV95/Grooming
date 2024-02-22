document.addEventListener('DOMContentLoaded', function () {
    const recoveryForm = document.querySelector('form');
  
    recoveryForm.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const email = recoveryForm.querySelector('[name="email"]').value;
  
      try {
        const response = await fetch('/api/auth/recoveryPass', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error:', errorData.message);
          return;
        }
  
        console.log('Recovery request successful. Check your email for instructions.');
      
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Solicitud enviada!",
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);


      } catch (error) {
        console.error('Error during recovery request:', error);
      }
    });
  });
  