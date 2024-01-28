import CartModel from './models/cart.model.js';
import TicketModel from './models/ticket.model.js';
import ProductManager from './products.manager.js';
import UserModel from './models/user.model.js';
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

    static async addProductInCart(cid, pid, quantity) {
        try {
            const cart = await CartModel.findById(cid);
            console.log('Cart:', cart);
            const product = await ProductManager.getById(pid);
            console.log('Product:', product);
            if (!product) {
                throw new Error(`El producto con el id ${pid} no se encuentra.`);
            }

            if (cart) {
                console.log('cart.products antes de la búsqueda:', cart.products);
                console.log('pid-extraido', pid);
                console.log('product_id-extraido', product._id.toString());
                try {
                    const existingProduct = cart.products.find((p) => p.product.toString() === product._id.toString());

                    console.log('existingProduct', existingProduct);
                    console.log('productodebajodelindex', product._id);

                    if (existingProduct) {
                        existingProduct.quantity++;
                    } else {
                        const newProduct = {
                            product: product._id,
                            quantity: quantity ? quantity : 1,
                        };
                        console.log('newProductprobado', newProduct);
                        cart.products.push(newProduct);
                    }

                    console.log('Longitud de cart.products:', cart.products.length);
                    await CartModel.updateOne({ _id: cart._id }, { products: cart.products });
                    console.log('Cart después de la operación:', cart);
                    return cart;
                } catch (errorInFind) {
                    console.error('Error al buscar el producto en el carrito:', errorInFind);
                    throw errorInFind;
                }
            } else {
                throw new Error('El carrito no existe.');
            }
        } catch (error) {
            console.error('Error general:', error);
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
        }
    }



    static async updateProductInCart(cid, pid, quantity) {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                throw new Error('El carrito no existe.');
            }

            const productIndex = cart.products.findIndex((p) => p.pid.toString() === pid);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;

                await CartModel.updateOne({ _id: cart._id }, { products: cart.products });

                console.log('Cart después de la operación:', cart);
                return cart;
            } else {
                throw new Error('El producto no está en el carrito.');
            }
        } catch (error) {
            console.error(`Error al actualizar el producto en el carrito: ${error.message}`);
            throw error;
        }
    }

    static async updateCart(cid, pid) {
        try {
            const cart = await CartModel.findById(cid);
            const product = await ProductManager.getById(pid);

            if (!cart) {
                throw new Error('El carrito no existe');
            }

            cart.products = [];

            const newProduct = {
                product: product._id,
                quantity: 1,
            };
            cart.products.push(newProduct);

            await cart.save();

            console.log('Cart después de la operación:', cart);
            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error.message);
            throw error;
        }
    }



    static async deleteProductsInCart(cid) {
        try {
            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw new Error('El carrito no existe.');
            }

            cart.products = [];
            await cart.save();

            return `Los productos del carrito con ID ${cid} han sido eliminados correctamente.`;
        } catch (error) {
            console.error('Error al eliminar los productos del carrito por ID:', error.message);
        }
    }

    static async deleteProductById(cid, pid) {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                throw new Error('El carrito no existe.');
            }

            const productIndex = cart.products.findIndex((p) => p.pid.toString() === pid.toString());

            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                await cart.save();

                return `El producto con ID ${pid} ha sido eliminado correctamente del carrito con ID ${cid}.`;
            } else {
                throw new Error(`El producto con ID ${pid} no está en el carrito.`);
            }
        } catch (error) {
            console.error('Error al eliminar el producto del carrito por ID:', error.message);
        }
    }

    static async purchaseCart(cid, purchaserId) {
        try {
            const cart = await CartModel.findById(cid).populate('products.product');
            if (!cart) {
                throw new Error('El carrito no existe.');
            }
            const user = await UserModel.findById(purchaserId);
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
    
            let productosNoProcesados = [];
            let productosProcesados = [];
            let totalAmount = 0;
            // Verificar stock de cada producto en el carrito
            for (const item of cart.products) {
                if (item.product.stock < item.quantity) {
                    productosNoProcesados.push(item);
                } else {
                    productosProcesados.push(item);
                    totalAmount += item.product.price * item.quantity;
                }
            }
    
            // Actualizar stock de los productos procesados
            for (const item of productosProcesados) {
                console.log(`Actualizando stock del producto: ${item.product._id}`);
                await ProductManager.updateProductStock(item.product._id, item.product.stock - item.quantity);
            }
    
            // Actualizar carrito
            cart.products = productosNoProcesados;
            await cart.save();
    
            // Generar ticket
            let ticket;
            if (productosProcesados.length > 0) {
                const ticketData = {
                    code: Math.floor(Math.random() * 1000000),
                    purchase_datetime: new Date().toISOString(),
                    amount: totalAmount.toFixed(2),
                    purchaser: {
                        firstName: user.first_name,
                        lastName: user.last_name
                    }
                };
                ticket = new TicketModel(ticketData);
                await ticket.save();
            }
    
            if (productosNoProcesados.length > 0) {
                return {
                    message: 'Compra parcialmente exitosa. Algunos productos no tienen suficiente stock',
                    ticket,
                    productosNoProcesados
                };
            } else {
                return { message: 'Compra finalizada con éxito', ticket };
            }
        } catch (error) {
            console.error('Error al realizar la compra:', error.message);
            throw error;
        }
    }
    
}
