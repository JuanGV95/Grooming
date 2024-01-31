import { Router } from 'express';
import passport from 'passport';
import ProductController from '../../controllers/products.controller.js';
import { authMiddleware } from '../../utils/utils.js';


const router = Router();

router.get('/products', passport.authenticate('jwt', { session: false }), ProductController.getProducts);

router.get('/products/:pid', ProductController.getProductById);

router.post('/products',passport.authenticate('jwt', { session: false }), authMiddleware(['admin']), ProductController.createProduct);

router.put('/products/:pid', authMiddleware(['admin']), ProductController.updateProduct);

router.delete('/products/:pid', authMiddleware(['admin']), ProductController.deleteProduct);

export default router;
