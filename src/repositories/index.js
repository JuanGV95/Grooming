import { productDao } from '../dao/factory.js';

import ProductsRepository from './products.repository.js';

export const productsRepository = new ProductsRepository(productDao)