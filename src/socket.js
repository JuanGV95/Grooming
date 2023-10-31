//Servidor
import { Server } from 'socket.io'
import path from 'path';
import { __dirname } from './utils.js';
import ProductManager from './productManager.js';

let io;

export const init = (httpServer) => {

  io = new Server(httpServer);

  io.on('connection', async (socketClient)=>{
    const productManager = new ProductManager(path.join(__dirname, './Products.json'));
    const products = await productManager.getProducts();
    socketClient.emit('getProducts', products);

    socketClient.on('deleteProduct', async (productId) => {
      try {
        // Elimina el producto en el servidor utilizando la función deleteProduct
        await productManager.deleteProduct(productId);
        
        // Emita un evento para notificar a todos los clientes que el producto ha sido eliminado
        io.emit('productDeleted', productId);
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        // Manejar errores, por ejemplo, emitir un evento de error
      }
    });  
  })
}; 