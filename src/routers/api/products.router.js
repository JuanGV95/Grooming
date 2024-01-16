import { Router } from 'express';
import passport from 'passport';
import ProductController from '../../controllers/products.controller.js';

const router = Router();

router.get('/products', passport.authenticate('jwt', { session: false }), ProductController.getProducts);

router.get('/products/:pid', ProductController.getProductById);

router.post('/products', ProductController.createProduct);

router.put('/products/:pid', ProductController.updateProduct);

router.delete('/products/:pid', ProductController.deleteProduct);

export default router;
