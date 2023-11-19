import { Router } from 'express';
const router = Router();

import ProductManager from '../dao/products.manager.js';


router.get('/', async (req, res) => {
    try {
        const { query } = req;
        const { limit } = query;
        const products = await ProductManager.get();

        if (!limit) {
            res.render('index', { title: 'Catalogo', products: { ...products } });
        } else {
            const result = products.find((product) => product.id <= parseInt(limit));
            res.render('index', { title: 'Catalogo', products: { ...result } })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
})

router.get('/chat', (req, res)=>{
    res.render('chat', {title: 'Grooming Chat'});
});

export default router;