import express from 'express';
import handlebars from 'express-handlebars';

import passport  from 'passport';
import path from 'path';

import config from './config/config.js';
import cookieParser from 'cookie-parser';
import { addLogger } from './config/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi  from 'swagger-ui-express';

//import configs
import { __dirname } from './utils/utils.js';

import {init as initPassport} from './config/passport.config.js';
//import de ROUTERS
import productsRouter from './routers/api/products.router.js';
import cartsRouter from './routers/api/carts.router.js';
import indexRouter from './routers/index.router.js';
import realtimeproducts from './routers/realTimeProducts.router.js';
import userRouter from './routers/api/users.router.js';
import authRouter from './routers/api/auth.router.js';
const app = express();

if (process.env.NODE_ENV == 'production') {
  const swaggerOpts = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Grooming Api',
        description: 'Esta es la documentacion de Grooming.',
      },
    },
    apis: [path.join(__dirname, '.', 'docs', '**', '*.yaml')],
  };
  const specs = swaggerJSDoc(swaggerOpts);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

//config 🍪🍪
const COOKIE_SECRET = config.cookie;
app.use(cookieParser(COOKIE_SECRET))

//Logger config
app.use(addLogger);
//config express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
//Config handlebars 
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
//Passport Config
initPassport();
app.use(passport.initialize());

app.use('/', indexRouter, realtimeproducts);

app.use('/api', productsRouter, cartsRouter, userRouter, authRouter);

app.use((error, req, res, next) =>{
    const message = `Ah ocurrido un error desconocido 😥: ${error.message} `;
    console.error(message);
    res.status(500).json({ message })
});



export default app;