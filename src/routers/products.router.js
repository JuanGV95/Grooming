import { Router } from 'express';
const router = Router();

import ProductManager from '../dao/products.manager.js';



router.get('/products', async (req, res) => {
    try {
        const { query } = req;
        const { limit } = query;
        const products = await ProductManager.get();

        if (!limit) {
            res.status(200).json(products);
        } else {
            const result = products.filter((product) => product.id <= parseInt(limit));
            res.status(201).json(result);
        }
        console.log(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

router.get('/products/:pid', async (req, res)  =>{
    const { pid } = req.params;
    console.log('pid', pid) 
    try {
        const product = await ProductManager.getById(pid);

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado.' });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar el producto por ID.' });
    }
});


router.post('/products', async (req, res) => {
    const { body } = req;

    try {
        const newProduct = await ProductManager.create(body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    console.log(body)
});

router.put('/products/:pid', async (req, res) => {
    const { body, params } = req;
    const productId = params.pid;
    const product = await ProductManager.getById(productId);
    console.log('ID del producto que se busca:', productId);
    if (!product) {
        res.status(404).json({ message: 'Producto no encontrado' });
        return;
    }
    console.log('Datos de actualización:', body);
    const updatedProduct = await ProductManager.updateById(product._id, body);
    console.log('Producto actualizado:', updatedProduct);
    res.status(200).json(updatedProduct);
});

router.delete('/products/:pid', async (req, res) => {
    const { params } = req;
    const productId = params.pid;
    const product = await ProductManager.getById(productId);
    console.log('ID del producto que se busca:', productId);
    
    if (!product) {
        res.status(404).json({ message: 'El producto no se encontró' });
        return;
    }
    
    await ProductManager.deleteById(product._id);
    res.status(200).json({ message: 'El producto fue eliminado' });
});

export default router;