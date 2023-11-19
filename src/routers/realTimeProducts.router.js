import { Router } from 'express';
const router = Router();

import ProductManager from '../dao/products.manager.js';


router.get('/realtimeproducts', async (req, res) => {
    try {
        const { query } = req;
        const { limit } = query;
        const products = await ProductManager.get();

        if (!limit) {
            res.status(200).render('realTimeProducts', { title: 'Catalogo', products: { ...products } });
        } else {
            const result = products.find((product) => product._id <= parseInt(limit));
            res.render('realTimeProducts', { title: 'Catalogo', products: { ...result } })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
})

export default router;