import { Router } from 'express';
import EmailService from '../services/email.service.js';
import { generateProduct } from '../utils/utils.js'

const router = Router();

router.get('/', (req, res) => {
  res.redirect('/login');
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
    res.render('register', { title: 'Registro' });
  });

router.get('/chat', (req, res) => {
    res.render('chat', { title: 'Grooming Chat' });
});

router.get('/mail', async (req, res) => {
  const emailService = EmailService.getInstance();
  const result = await emailService.sendEmail(
    'juandagv@gmail.com',
    'Hola, tamos probando esta vaina jeje',
    `<div>
      <h1>Hola Juan 😁</h1>  
    </div>`,
    []
  );
  res.status(200).json(result);
});

router.get('/mockingproducts', (req, res) => {
  const products = [];
  for (let index = 0; index < 100; index++) {
    products.push(generateProduct());
  }
  res.status(200).json(products);
});

export default router;