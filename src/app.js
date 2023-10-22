const express = require('express');
const ProductManager = require('./productManager');
const productManager = new ProductManager('./Products.json');

const productsRouter = require('./routers/products.router');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 
app.use('/api', productsRouter);

app.listen(PORT, () =>{
    console.log(`Server running in http//localhost:${PORT}`);
})