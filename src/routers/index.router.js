import { Router } from 'express';
import path from 'path';
const router = Router();

import { __dirname } from '../utils.js';
import ProductManager from '../productManager.js';
const productManager = new ProductManager(path.join(__dirname, '../src/Products.json'));

router.get('/', async (req, res) => {
    try {
        const { query } = req;
        const { limit } = query;
        const products = await productManager.getProducts();

        if (!limit) {
            res.render('index', { title: 'Catalogo', products: { ...products } });
        } else {
            const result = products.filter((product) => product.id <= parseInt(limit));
            res.render('index', { title: 'Catalogo', products: { ...products } })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
})

export default router;