import { Router } from 'express';
const router = Router();

import ProductManager from '../dao/products.manager.js';




router.get('/', async (req, res) => {
  res.redirect('/login');
    // try {
    //     const { query } = req;
    //     const { limit } = query;
    //     const products = await ProductManager.get();

    //     if (!limit) {
    //         res.render('index', { title: 'Catalogo', products: { ...products } });
    //     } else {
    //         const result = products.find((product) => product.id <= parseInt(limit));
    //         res.render('index', { title: 'Catalogo', products: { ...result } })
    //     }
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: 'Error al obtener los productos.' });
    // }
})

router.get('/profile', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    res.render('profile', { title: 'Hello People 🖐️', user: req.session.user });
  });
  
  router.get('/login', (req, res) => {


    res.render('login', { title: 'Inicio de sesion 🔐' });
  });
  
  router.get('/register', (req, res) => {
    res.render('register', { title: 'Hello People 🖐️' });
  });

router.get('/chat', (req, res) => {
    res.render('chat', { title: 'Grooming Chat' });
});

export default router;