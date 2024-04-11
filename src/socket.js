//Servidor
import { Server } from 'socket.io'
import pkg from 'jsonwebtoken';
const {jwt} = pkg;
import ProductManager from './dao/products.dao.js';
import MessageModel from './dao/models/message.model.js';
let io;

export const init = (httpServer) => {

  io = new Server(httpServer);

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error - No token provided'));
    }
    console.log('token', token);
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        return next(new Error('Authentication error'));
      }
      socket.user = decoded; 
      next();
    });
  });

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

    //Cliente del chat
    const messages = await MessageModel.find({});
    socketClient.emit('update-messages', messages);

    socketClient.on('new-message', async (msg) => {
      if (socketClient.user.role !== 'user') {
        return; 
      }
      await MessageModel.create(msg);
      const messages = await MessageModel.find({});
      io.emit('update-messages', messages);
      console.log('messages', messages);
    })

  })
}; 