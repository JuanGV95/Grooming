import express from 'express';
import handlebars from 'express-handlebars';
import sessions from 'express-session'; //solo para sessions
import passport  from 'passport';
import path from 'path';
import MongoStore from 'connect-mongo'; //solo para sessions
import config from './config/config.js';
import cookieParser from 'cookie-parser';


//import configs
import { __dirname } from './utils/utils.js';
import { URI } from './db/mongodb.js'; //solo para sessions
import {init as initPassport} from './config/passport.config.js';
//import de ROUTERS
import productsRouter from './routers/api/products.router.js';
import cartsRouter from './routers/api/carts.router.js';
import indexRouter from './routers/index.router.js';
import realtimeproducts from './routers/realTimeProducts.router.js';
import userRouter from './routers/api/users.router.js';
import authRouter from './routers/api/auth.router.js';
const app = express();

// const SESSION_SECRET = '|7@3BBY5jH:@zFQIg_v47HkKP5S#p&Uc'; solo para session

//solo para sessions
/* app.use(sessions({
     store: MongoStore.create({
       mongoUrl: URI,
       mongoOptions: {},
       ttl: 60*30,
     }), 
     secret: SESSION_SECRET,
     resave: true,
     saveUninitialized: true,
   })); */

//config 🍪🍪
const COOKIE_SECRET = config.cookie;
app.use(cookieParser(COOKIE_SECRET))

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
//app.use(passport.session()); //solo para sessions
app.use('/', indexRouter, realtimeproducts);

app.use('/api', productsRouter, cartsRouter, userRouter, authRouter);

app.use((error, req, res, next) =>{
    const message = `Ah ocurrido un error desconocido 😥: ${error.message} `;
    console.error(message);
    res.status(500).json({ message })
});



export default app;