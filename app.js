const express = require('express');
const ProductManager = require('./productManager');

const app = express();
app.use(express.urlencoded({ extended: true }));
const productManager = new ProductManager('./Products.json');
 



app.get('/products', (req, res) => {
    const { query } = req;
    const { limit } = query;
    productManager.getProducts()
    .then(products => {
        if (!limit) {
            res.json(products);
        } else {
            const result = products.filter((product) => product.id <= parseInt(limit));
            res.json(result);
        }
    })
    .catch(error => {
        console.error(error);
    });
});

app.get('/products/:pid', async (req, res)  =>{
    const { pid } = req.params; 
    const product = await productManager.getProductsById(parseInt(pid));
    if (!product) {
        res.json({ error: 'Producto no encontrado.' });
    } else {
        res.json(product);
    }
    console.log(product);
});


app.listen(8080, () =>{
    console.log('Servidor escuchado en el puerto 8080');
})