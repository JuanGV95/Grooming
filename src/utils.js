import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js';

const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename)

export const URL_BASE = `http://localhost:${config.port}/api`;

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

export const JWT_SECRET = config.jwt;

export const createToken = (user) => {
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
  };
return jwt.sign(payload, JWT_SECRET, {expiresIn: '30m'})
}

export const verifyToken = (token)=>{
   return new Promise((resolve, reject)=>{
      jwt.verify(token, JWT_SECRET, (error, payload)=>{
         if(error){
          return reject(error);
         }
         resolve(payload)
      });
   });
}

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