import { Router } from 'express';
const router = Router();
import passport from 'passport';
import CartManager from '../../dao/carts.manager.js';
import ProductManager from '../../dao/products.manager.js';
import { authMiddleware } from '../../utils/utils.js';


router.post('/carts', 
passport.authenticate('jwt', {session: false}),
authMiddleware(['admin']),
async (req, res)=>{
    const { body } = req;
    try {
        const newCart = await CartManager.create(body);
        res.status(201).json(newCart);
        console.log(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get('/carts/:cid', 
passport.authenticate('jwt', {session: false}),
authMiddleware(['user', 'admin']),
async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await CartManager.getById(cid);

        if (!cart) {
           return res.status(404).json({ error: 'Carrito no encontrado.' });
        } else {
            
            await cart.populate('products.product');
            console.log('cart traido', cart);
            res.status(201).render('cart', cart );
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar el carrito.'});
    }
});

router.delete('/carts/:cid',
passport.authenticate('jwt', {session: false}),
authMiddleware(['admin']),
async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await CartManager.deleteProductsInCart(cid);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Error al eliminar productos del carrito: ${error.message}` });
    }
});

router.put('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.body;

    try {
        const result = await CartManager.updateCart(cid, pid);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Error al eliminar productos del carrito: ${error.message}` });
    }
});


router.put('/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
   
    console.log('Cuerpo de la solicitud:', req.body);

    try {
        const updatedCart = await CartManager.updateProductInCart(cid, pid, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/carts/:cid/products/:pid',
    passport.authenticate('jwt-auth', { session: false }),
    authMiddleware(['user', 'premium']), async (req, res) => {
        const { params, user } = req;
        const { cid, pid } = params;

        try {
            // Verificar si el usuario es premium
            if (user.role === 'premium') {
                // Obtener el producto por su ID
                const product = await ProductManager.getById(pid);
                if (product && product.owner === user.email) {
                    // El usuario premium no puede agregar su propio producto al carrito
                    return res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito' });
                }
            }

            // Si no es premium o el producto no le pertenece, agregar el producto al carrito
            const newProductInCart = await CartManager.addProductInCart(cid, pid);
            res.status(201).json(newProductInCart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });



router.post('/carts/:cid/purchase',
    passport.authenticate('jwt', {session: false}),
    authMiddleware(['user']), 
    async (req, res) => {
        try {
            const purchaserId = req.user.id; // Obteniendo el ID del usuario autenticado
            const result = await CartManager.purchaseCart(req.params.cid, purchaserId);
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

router.delete('/carts/:cid/products/:pid', async (req, res) => {
    const { params } = req;
    const { cid, pid } = params;
    
    try {
        const result = await CartManager.deleteProductById(cid, pid);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
    }
    
});

export default router