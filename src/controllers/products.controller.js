import { respuestaPaginada } from '../utils.js';
import ProductManager from '../dao/products.manager.js';
import ProductService from '../services/products.service.js';
export default class ProductController {
    static async getProducts(req, res) {
        try {
            const user = req.user;
        console.log('user', user);

        const { limit = 10, page = 1, sort, search } = req.query;
        const criteria = {};
        const options = { limit, page };

        if (sort) {
            options.sort = { price: sort };
        }

        if (search) {
            criteria.category = search;
        }
            const result = await ProductService.getAll(criteria, options);
            res.status(200).render('products', { user, ...respuestaPaginada(result, sort, search) });
            

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los productos.' });
        }
    }
    
    static async getProductById(req, res) {
        const { pid } = req.params;
        try {
            const product = await ProductManager.getById(pid);

            if (!product) {
                res.status(404).json({ error: 'Producto no encontrado.' });
            } else {
                res.status(200).render('detailProduct', product);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar el producto por ID.' });
        }
    }

    static async createProduct(req, res) {
        const { body } = req;

        try {
            const newProduct = await ProductManager.create(body);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateProduct(req, res) {
        const { body, params } = req;
        const productId = params.pid;
        const product = await ProductManager.getById(productId);

        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        const updatedProduct = await ProductManager.updateById(product._id, body);
        res.status(200).json(updatedProduct);
    }

    static async updateProductStock(productId, newStock) {
        try {
            console.log(`Actualizando stock del producto ${productId} a ${newStock}`);
            
            const product = await ProductModel.findByIdAndUpdate(
                productId,
                { $set: { stock: newStock } },
                { new: true } 
            );
    
            if (!product) {
                throw new Error('Producto no encontrado');
            }
    
            console.log(`Stock actualizado: ${product}`);
            return product;
        } catch (error) {
            console.error('Error al actualizar el stock del producto:', error.message);
            throw error;
        }
    }
    
    
    static async deleteProduct(req, res) {
        const { params } = req;
        const productId = params.pid;
        const product = await ProductManager.getById(productId);

        if (!product) {
            res.status(404).json({ message: 'El producto no se encontró' });
            return;
        }

        await ProductManager.deleteById(product._id);
        res.status(200).json({ message: 'El producto fue eliminado' });
    }


}
