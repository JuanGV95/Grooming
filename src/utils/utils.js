import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { faker } from '@faker-js/faker';


const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(path.dirname(__filename));

export const URL_BASE = `http://localhost:${config.port}/api`;

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

export const JWT_SECRET = config.jwt;

export const JWT_RECOVERY = config.jwtRecovery;

export const createToken = (user, type = 'auth') => {
  const {
    _id,
    first_name,
    last_name,
    email,
    password,
    providerId,
    provider,
    cart,
    role,
    age,
  } = user;
  const payload = {
    id: _id,
    first_name,
    last_name,
    email,
    password,
    providerId,
    provider,
    cart,
    role,
    age,
    type: type
  };
return jwt.sign(payload, type === 'auth' ? JWT_SECRET : JWT_RECOVERY, {expiresIn: '60m'})
}

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
     jwt.verify(token, JWT_SECRET, (error, payload) => {
        if (error) {
           if (error.name === 'TokenExpiredError') {
              reject({ message: 'El token ha expirado. Por favor, inicia sesión nuevamente.' });
           } else if (error.name === 'JsonWebTokenError' || error.name === 'SyntaxError') {
              reject({ message: 'El token es inválido o está mal formado. Por favor, verifica tu sesión.' });
           } else {
              reject({ message: 'Ocurrió un error al verificar el token. Por favor, intenta nuevamente.' });
           }
        } else {
           resolve(payload);
        }
     });
  });
};

export const verifyRecoveryToken = (token) => {
  return new Promise((resolve, reject) => {
     jwt.verify(token, JWT_RECOVERY, (error, payload) => {
        if (error) {
           // Verificar si el error es causado por expiración del token
           if (error.name === 'TokenExpiredError') {
              return reject({ message: 'El token de recuperación ha expirado. Por favor, solicita un nuevo enlace.' });
           }
           // Verificar si el error es causado por un token inválido o mal formado
           if (error.name === 'JsonWebTokenError' || error.name === 'SyntaxError') {
              return reject({ message: 'El token de recuperación es inválido o está mal formado. Por favor, solicita un nuevo enlace.' });
           }
           // Si no se reconoce el tipo de error, devolver un mensaje de error genérico
           return reject({ message: 'Ocurrió un error al verificar el token de recuperación. Por favor, intenta nuevamente.' });
        }
        // Si el token se verifica correctamente con JWT_RECOVERY, resolver con el payload
        resolve(payload);
     });
  });
};


export const authMiddleware = roles => (req, res, next) => { 
  const { user } = req;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!roles.includes(user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};


export const respuestaPaginada = (data, baseUrl = URL_BASE) => {
  return {
    //status:success/error
    status: 'success',
    //payload: Resultado de los productos solicitados
    payload: data.products.map(doc => doc.toJSON ? doc.toJSON() : doc),
    //totalPages: Total de páginas
    totalPages: data.totalPages,
    //prevPage: Página anterior
    prevPage: data.prevPage,
    //nextPage: Página siguiente
    nextPage: data.nextPage,
    //page: Página actual
    page: data.page,
    //hasPrevPage: Indicador para saber si la página previa existe
    hasPrevPage: data.hasPrevPage,
    //hasNextPage: Indicador para saber si la página siguiente existe.
    hasNextPage: data.hasNextPage,
    //prevLink: Link directo a la página previa (null si hasPrevPage=false)
    prevLink: data.hasPrevPage ? `${baseUrl}/products?limit=${data.limit}&page=${data.prevPage}` : null,
    //nextLink: Link directo a la página siguiente (null si hasNextPage=false)
    nextLink: data.hasNextPage ? `${baseUrl}/products?limit=${data.limit}&page=${data.nextPage}` : null,
  }; 

    
}

//Moking products 

export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    code: faker.string.alphanumeric({ length: 10 }),
    price: faker.commerce.price(),
    category: faker.commerce.department(),
    stock: faker.number.int({ min: 10000, max: 99999 }),
    thumbnails: faker.image.url(),
  }
};