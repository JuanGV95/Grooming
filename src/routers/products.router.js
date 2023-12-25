import { Router } from 'express';
import productModel from '../dao/models/product.model.js';
import ProductManager from '../dao/products.manager.js';
import passport from 'passport';
import { respuestaPaginada } from '../utils.js';
const router = Router();



router.get('/products', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

        const result = await productModel.paginate(criteria, options);
        res.status(200).render('products', { user, ...respuestaPaginada({ ...result, sort, search }) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});


router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    console.log('pid', pid)
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
});


router.post('/products', async (req, res) => {
    const { body } = req;

    try {
        const newProduct = await ProductManager.create(body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    console.log(body)
});

router.put('/products/:pid', async (req, res) => {
    const { body, params } = req;
    const productId = params.pid;
    const product = await ProductManager.getById(productId);
    console.log('ID del producto que se busca:', productId);
    if (!product) {
        res.status(404).json({ message: 'Producto no encontrado' });
        return;
    }
    console.log('Datos de actualización:', body);
    const updatedProduct = await ProductManager.updateById(product._id, body);
    console.log('Producto actualizado:', updatedProduct);
    res.status(200).json(updatedProduct);
});

router.delete('/products/:pid', async (req, res) => {
    const { params } = req;
    const productId = params.pid;
    const product = await ProductManager.getById(productId);
    console.log('ID del producto que se busca:', productId);

    if (!product) {
        res.status(404).json({ message: 'El producto no se encontró' });
        return;
    }

    await ProductManager.deleteById(product._id);
    res.status(200).json({ message: 'El producto fue eliminado' });
});

export default router;