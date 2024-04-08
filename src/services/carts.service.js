import ProductManager from '../dao/products.dao.js';

export default class CartService {
    static async validateProductForCart(pid, userRole, userEmail) {
        const product = await ProductManager.getById(pid);
        if (!product) {
            throw new Error(`El producto con el id ${pid} no se encuentra.`);
        }

        // Verificar si el usuario es premium y si el producto le pertenece
        if (userRole === 'premium' && (product.owner === userEmail || product.owner === userRole)) {
            throw new Error('No puedes agregar a tu carrito un producto que te pertenece');
        }

        return product;
    }

    static async calculateTotal(cartProducts) {
        let totalAmount = 0;
        for (const item of cartProducts) {
            totalAmount += item.product.price * item.quantity;
        }
        return totalAmount.toFixed(2);
    }

    static async validatePurchase(cartProducts) {
        let productosNoProcesados = [];
        let totalAmount = 0;
        // Verificar stock de cada producto en el carrito
        for (const item of cartProducts) {
            if (item.product.stock < item.quantity) {
                productosNoProcesados.push(item);
            } else {
                totalAmount += item.product.price * item.quantity;
            }
        }
        return { productosNoProcesados, totalAmount };
    }

    static async generateTicket(user, totalAmount) {
        const ticketData = {
            code: Math.floor(Math.random() * 1000000),
            purchase_datetime: new Date().toISOString(),
            amount: totalAmount,
        };

        return ticketData;
    }
}
