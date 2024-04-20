import config from "../config/config";

export let productDao;

switch (config.persistence) {
    case 'mongodb':
        const ProductDaoMongoDb = (await import('./products.dao.js')).default;
        productDao = new ProductDaoMongoDb();    
        break;
        default:
        const ProductDaoMemory = (await import('./products.dao.js')).default;
        productDao = new ProductDaoMemory();
        break;    
}
