import CartModel from './models/cart.model.js';
import ProductManager from './products.manager.js';

export default class CartManager {
    static get() {
        return CartModel.find();
    }

    static async create(data) {
        const cart = await CartModel.create(data);
        return cart;
    }

    static async getById(cid) {
        try {
            const cart = await CartModel.findById(cid);
            console.log('cart', cart);
            return cart;
        } catch (error) {
            console.error('Error al buscar el carrito por ID:', error.message);
        }
    }

    static async addProductInCart(cid, pid) {
        try {
            const cart = await CartModel.findById(cid);
            const product = await ProductManager.getById(pid);
    
            if (!product) {
                throw new Error(`El producto con el id ${pid} no se encuentra.`);
            }
    
            if (cart) {
                const productIndex = cart.products.findIndex((p) => p.pid.toString() === product._id.toString());
                console.log('productIndex', productIndex);
    
                if (productIndex !== -1) { 
                    cart.products[productIndex].quantity++;
                } else {
                    const newProduct = {
                        pid: product._id,
                        quantity: 1,
                    };
                    cart.products.push(newProduct);
                }
                
                await CartModel.updateOne({ _id: cart._id }, { products: cart.products });
                console.log('Cart después de la operación:', cart);
                return cart;
                
            } else {
                
                throw new Error('El carrito no existe.');
            }
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
        }
    }
       
}


