const { Router } = require('express');
const path = require('path');
const router = Router();

const ProductManager = require('../productManager');
const productManager = new ProductManager(path.join(__dirname,'../Products.json'));


router.get('/products', async (req, res) => {
    try {
        const { query } = req;
        const { limit } = query;
        const products = await productManager.getProducts();

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
    const product = await productManager.getProductsById(parseInt(pid));
    if (!product) {
        res.json({ error: 'Producto no encontrado.' });
    } else {
        res.json(product);
    }
})

router.post('/products', async (req, res) => {
    const { body } = req;

    try {
        const newProduct = await productManager.addProduct(body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    console.log(body)
});

router.put('/products/:pid', async (req, res) => {
    const { body, params } = req;
    const productId = params.pid;
    const product = await productManager.getProductsById(parseInt(productId));
    console.log('ID del producto que se busca:', productId);
    if (!product) {
        res.status(404).json({ message: 'Producto no encontrado' });
        return;
    }
    console.log('Datos de actualización:', body);
    const updatedProduct = await productManager.updateProduct(product.id, body.data);
    console.log('Producto actualizado:', updatedProduct);
    res.status(200).json(updatedProduct);
});


module.exports = router;
