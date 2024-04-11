import CartManager from '../dao/carts.dao.js';

export default class CartController {
    static async createCart(req, res) {
        const { body } = req;
        try {
            const newCart = await CartManager.create(body);
            res.status(201).json(newCart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getCartById(req, res) {
        const { cid } = req.params;
        try {
            const cart = await CartManager.getById(cid);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado.' });
            }
            await cart.populate('products.product');
            res.status(200).json(cart);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar el carrito.' });
        }
    }

    static async deleteProductsInCart(req, res) {
        const { cid } = req.params;
        try {
            const result = await CartManager.deleteProductsInCart(cid);
            res.status(200).json({ message: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `Error al eliminar productos del carrito: ${error.message}` });
        }
    }

    static async updateCart(req, res) {
        const { cid } = req.params;
        const { pid } = req.body;
        try {
            const result = await CartManager.updateCart(cid, pid);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `Error al actualizar el carrito: ${error.message}` });
        }
    }

    static async updateProductInCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const updatedCart = await CartManager.updateProductInCart(cid, pid, quantity);
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async addProductInCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const user = req.user; 
        try {
            const newProductInCart = await CartManager.addProductInCart(cid, pid, quantity, user.role, user.email);
            res.status(201).json(newProductInCart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async purchaseCart(req, res) {
        const { cid } = req.params;
        try {
            const purchaserId = req.user.id; 
            const result = await CartManager.purchaseCart(cid, purchaserId);
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteProductById(req, res) {
        const { cid, pid } = req.params;
        try {
            const result = await CartManager.deleteProductById(cid, pid);
            res.status(200).json({ message: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
        }
    }
}
