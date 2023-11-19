import mongoose from 'mongoose';

const URI = 'Su Uri Aqui';

export const init = async () =>{
    try {
       await mongoose.connect(URI);
       console.log('Database connected sucssesfully'); 
    } catch (error) {
        console.error('Ah ocurrido un error al intentar conectarse a la base de datos', error.message);
    }
}
