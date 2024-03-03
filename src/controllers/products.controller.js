import { respuestaPaginada } from '../utils/utils.js';
import ProductManager from '../dao/products.dao.js';
import ProductService from '../services/products.service.js';
import { CustomError } from '../utils/customError.js';
import { generatorProductError } from '../utils/causeMessageError.js';
import EnumsError from '../utils/enumsError.js';
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
        const { body, user } = req;
        if (
            !body.title ||
            !body.description ||
            !body.price ||
            !body.status ||
            !body.category ||
            !body.thumbnails ||
            !body.code ||
            !body.stock
        ) {
            res.status(400).json({ message: 'Datos incompletos para crear el producto' });
            return;
        }

        // Agregar el owner al cuerpo del producto antes de crearlo
        body.owner = user.email; // Asignar el correo electrónico del usuario como owner

        try {
            const newProduct = await ProductManager.create(body);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error al crear el producto:', error);
            res.status(500).json({ message: 'Error interno al crear el producto' });
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

        // Verificar si el usuario que realiza la solicitud es el propietario del producto
        if (product.owner !== req.user.email) {
            res.status(403).json({ message: 'No tienes permiso para actualizar este producto' });
            return;
        }

        try {
            const updatedProduct = await ProductManager.updateById(product._id, body);
            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            res.status(500).json({ message: 'Error interno al actualizar el producto' });
        }
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
        const { params, user } = req;
        const productId = params.pid;
        const product = await ProductManager.getById(productId);

        if (!product) {
            res.status(404).json({ message: 'El producto no se encontró' });
            return;
        }

        // Verificar si el usuario es admin
        if (user.role === 'admin') {
            // Si el usuario es admin, eliminar el producto sin verificar el propietario
            await ProductManager.deleteById(product._id);
            res.status(200).json({ message: 'El producto fue eliminado' });
            return;
        }

        // Si el usuario no es admin, verificar si el producto pertenece al usuario premium
        if (user.role === 'premium') {
            if (product.owner !== user.email) {
                res.status(403).json({ message: 'No tienes permiso para eliminar este producto' });
                return;
            }
        }

        // Si el usuario no es admin o premium, o si el producto le pertenece, eliminar el producto
        await ProductManager.deleteById(product._id);
        res.status(200).json({ message: 'El producto fue eliminado' });
    }




}
