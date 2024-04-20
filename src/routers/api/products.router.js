import { Router } from 'express';
import passport from 'passport';
import ProductController from '../../controllers/products.controller.js';
import { authMiddleware } from '../../utils/utils.js';


const router = Router();

router.get('/products', passport.authenticate('jwt-auth', { session: false }), ProductController.getProducts);

router.get('/products/:pid', passport.authenticate('jwt-auth', { session: false }), authMiddleware(['admin', 'user', 'premium']), ProductController.getProductById);

router.post('/products', passport.authenticate('jwt-auth', { session: false }), authMiddleware(['admin', 'premium']), ProductController.createProduct);

router.put('/products/:pid', passport.authenticate('jwt-auth', { session: false }), authMiddleware(['admin', 'premium']), ProductController.updateProduct);

router.delete('/products/:pid', passport.authenticate('jwt-auth', { session: false }), authMiddleware(['admin', 'premium']), ProductController.deleteProduct);

export default router;
