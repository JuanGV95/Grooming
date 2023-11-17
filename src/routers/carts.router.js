import { Router } from 'express';
import path from 'path';
const router = Router();

import { __dirname } from '../utils.js';
import CartManager from '../dao/cartManager.js';
const cartManager = new CartManager(path.join(__dirname,'../src/Carts.json'));

router.get('/carts/:cid', async (req, res)=>{
    const{ cid } = req.params;
    const cart = await cartManager.getCartById(parseInt(cid));
    if(!cart){
        res.json({ error: 'Carrito no encontrado.' });
    } else {
        res.status(201).json(cart);
    }
});

router.post('/carts', async (req, res)=>{
    const { body } = req;
    try {
        const newCart = await cartManager.addCart(body);
        res.status(201).json(newCart);
        console.log(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/carts/:cid/product/:pid', async (req, res) => {
    const { params } = req;
    const { cid, pid } = params;
    
    try {
        const newProductInCart = await cartManager.addProductInCart(parseInt(cid), parseInt(pid));
        res.status(201).json(newProductInCart);
        console.log(newProductInCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
export default router