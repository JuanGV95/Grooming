const express = require('express');

const productsRouter = require('./routers/products.router.js');
const cartsRouter = require('./routers/carts.router.js')

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 
app.use('/api', productsRouter, cartsRouter);

app.listen(PORT, () =>{
    console.log(`Server running in http//localhost:${PORT}`);
})