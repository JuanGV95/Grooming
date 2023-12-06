import express from 'express';
import handlebars from 'express-handlebars';
import sessions from 'express-session';
import path from 'path';
import MongoStore from 'connect-mongo';

import { __dirname } from './utils.js';
import { URI } from './db/mongodb.js';
//import de ROUTERS
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import indexRouter from './routers/index.router.js';
import realtimeproducts from './routers/realTimeProducts.router.js';
import userRouter from './routers/users.router.js';
import sessionRouter from './routers/sessions.router.js';


const app = express();

const SESSION_SECRET = '|7@3BBY5jH:@zFQIg_v47HkKP5S#p&Uc';

app.use(sessions({
    store: MongoStore.create({
      mongoUrl: URI,
      mongoOptions: {},
      ttl: 60*30,
    }), 
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  }));

//config express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
//Config handlebars 
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/', indexRouter, realtimeproducts);

app.use('/api', productsRouter, cartsRouter, userRouter, sessionRouter);

app.use((error, req, res, next) =>{
    const message = `Ah ocurrido un error desconocido 😥: ${error.message} `;
    console.error(message);
    res.status(500).json({ message })
});



export default app;