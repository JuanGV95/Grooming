import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';

import { __dirname } from './utils.js';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import indexRouter from './routers/index.router.js';
import realtimeproducts from './routers/realTimeProducts.router.js';

const app = express();
//config express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
//Config handlebars 
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/', indexRouter, realtimeproducts);

app.use('/api', productsRouter, cartsRouter);

app.use((error, req, res, next) =>{
    const message = `Ah ocurrido un error desconocido 😥: ${error.message} `;
    console.error(message);
    res.status(500).json({ message })
});

export default app;
