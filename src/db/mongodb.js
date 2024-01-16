import mongoose from 'mongoose';
import config from '../config/config.js';

export const URI = config.mongodbUri;

export const init = async () =>{
    try {
        const URI = config.mongodbUri;
       await mongoose.connect(URI);
       console.log('Database connected sucssesfully'); 
    } catch (error) {
        console.error('Ah ocurrido un error al intentar conectarse a la base de datos', error.message);
    }
}
