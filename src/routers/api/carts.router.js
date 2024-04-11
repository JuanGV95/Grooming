import express from 'express';
import passport from 'passport';
import CartController from '../../controllers/carts.controller.js';
import { authMiddleware } from '../../utils/utils.js';

const router = express.Router();

const authenticate = passport.authenticate('jwt-auth', { session: false });

// Rutas
router.post('/carts', authenticate,authMiddleware(['admin']), CartController.createCart);
router.get('/carts/:cid', authenticate,authMiddleware(['user', 'premium']), CartController.getCartById);
router.delete('/carts/:cid', authenticate,authMiddleware(['user', 'premium']), CartController.deleteProductsInCart);
router.put('/carts/:cid', authenticate, authMiddleware(['user', 'premium']), CartController.updateCart);
router.put('/carts/:cid/products/:pid', authenticate, authMiddleware(['user', 'premium']), CartController.updateProductInCart);
router.post('/carts/:cid/products/:pid', authenticate, authMiddleware(['user', 'premium']), CartController.addProductInCart);
router.post('/carts/:cid/purchase', authenticate, authMiddleware(['user', 'premium']), CartController.purchaseCart);
router.delete('/carts/:cid/products/:pid', authenticate, authMiddleware(['user', 'premium']), CartController.deleteProductById);

export default router;
