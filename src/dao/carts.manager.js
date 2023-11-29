
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
            console.log('Cart ID:', cid);
        console.log('Product ID:', pid);
            const cart = await CartModel.findById(cid);
            console.log('Cart:', cart);
            const product = await ProductManager.getById(pid);
            console.log('producto que traje', product);
            console.log('Product:', product);
            if (!product) {
                throw new Error(`El producto con el id ${pid} no se encuentra.`);
            }
    
            if (cart) {
                console.log('cart.products antes de la búsqueda:', cart.products);
                try {
                    const productIndex = cart.products.findIndex((p) => p.pid && p.pid.toString() === product._id.toString());

                    console.log('piddddd', pid);
                    console.log('product_idddddd', product._id.toString());
                    console.log('productIndex', productIndex);
                    console.log('productodebajodelindex', product._id);
    
                    if (productIndex !== -1) {
                        cart.products[productIndex].quantity++;
                    } else {
                        const newProduct = {
                            pid: product._id,
                            quantity: 1,
                        };
                        console.log('newProductprobado', newProduct);
                        cart.products.push(newProduct);
                    }
    
                    
                    console.log('Longitud de cart.products:', cart.products.length);
                    await CartModel.updateOne({ _id: cart._id }, { products: cart.products });
                    console.log('Cart después de la operación:', cart);
                    return cart;
                } catch (errorInFindIndex) {
                    console.error('Error en findIndex:', errorInFindIndex);
                    throw errorInFindIndex;
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
            // Si el producto ya está en el carrito, actualiza la cantidad según el parámetro
          cart.products[productIndex].quantity = quantity;
           
            // Guarda los cambios en el carrito
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

        // Vaciar el carrito
        cart.products = [];

        // Agregar el nuevo producto
        const newProduct = {
            pid: product._id,
            quantity: 1,
        };
        cart.products.push(newProduct);

        // Guardar el carrito actualizado en la base de datos
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

            // Eliminar los productos asociados al carrito
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
                // Elimina el producto específico del carrito
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


}


