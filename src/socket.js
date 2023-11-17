//Servidor
import { Server } from 'socket.io'

import ProductManager from './dao/products.manager.js';

let io;

export const init = (httpServer) => {

  io = new Server(httpServer);

  io.on('connection', async (socketClient) => {

    console.log(`Nuevo cliente socket conectado ${socketClient.id} 🎊`);

    const products = await ProductManager.get();
    socketClient.emit('getProducts', products);
    socketClient.emit('client-emit', { status: "cliente conectado" });
    
    socketClient.on('deleteProduct', (productId) => {
      try {

         ProductManager.deleteById(productId);

        io.emit('productDeleted', productId);
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    });

    socketClient.on('addProduct', async (newProduct) => {
      try {

        await ProductManager.create(newProduct);

        io.emit('productAdded', newProduct);
      } catch (error) {
        console.error('Error al añadir un producto', error);
      }
    });

  })
}; 