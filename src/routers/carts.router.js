import { Router } from 'express';

const router = Router();

import CartManager from '../dao/carts.manager.js';

router.get('/carts/:cid', async (req, res)=>{
    const{ cid } = req.params;
    const cart = await CartManager.getById(cid);
    if(!cart){
        res.json({ error: 'Carrito no encontrado.' });
    } else {
        res.status(201).json(cart);
    }
});

router.post('/carts', async (req, res)=>{
    const { body } = req;
    try {
        const newCart = await CartManager.create(body);
        res.status(201).json(newCart);
        console.log(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete('/carts/:cid', async (req, res) => {
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

router.post('/carts/:cid/products/:pid', async (req, res) => {
    const { params } = req;
    const { cid, pid } = params;
    
    try {
        const newProductInCart = await CartManager.addProductInCart(cid, pid);
        res.status(201).json(newProductInCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
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