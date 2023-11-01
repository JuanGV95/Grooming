//Servidor
import { Server } from 'socket.io'
import path from 'path';
import { __dirname } from './utils.js';
import ProductManager from './productManager.js';

let io;

export const init = (httpServer) => {

  io = new Server(httpServer);

  io.on('connection', async (socketClient) => {

    console.log(`Nuevo cliente socket conectado ${socketClient.id} 🎊`);

    const productManager = new ProductManager(path.join(__dirname, './Products.json'));
    const products = await productManager.getProducts();
    socketClient.emit('getProducts', products);
    socketClient.emit('client-emit', { status: "cliente conectado" });
    socketClient.on('deleteProduct', async (productId) => {
      try {

        await productManager.deleteProduct(productId);

        io.emit('productDeleted', productId);
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    });

    socketClient.on('addProduct', async (newProduct) => {
      try {

        await productManager.addProduct(newProduct);

        io.emit('productAdded', newProduct);
      } catch (error) {
        console.error('Error al añadir un producto', error);
      }
    });

  })
}; 