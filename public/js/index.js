const socket = io();

const deleteProduct = document.getElementById('deleteProduct');

socket.emit('message', 'Hello from the client 🖐️.');

socket.on('client-emit', (data) => {
  console.log('event client-emit', data);
});

socket.on('broadcast-emit', (data) => {
  console.log('event broadcast-emit', data);
});

