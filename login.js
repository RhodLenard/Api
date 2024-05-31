document.addEventListener('DOMContentLoaded', async function() {
  const loginForm = document.querySelector('form');

  loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.querySelector('#email').value; // Changed from 'username' to 'email'
    const password = document.querySelector('#password').value;
    const rememberMe = document.querySelector('#rememberMe').checked;

    try {
      const response = await fetch('http://localhost:5003/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, rememberMe }) // Changed from 'username' to 'email'
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        // Optionally, redirect the user to another page
        // window.location.href = '/home';
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  });
});