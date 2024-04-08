import { Router } from 'express';
import EmailService from '../services/email.service.js';
import {authMiddleware,generateProduct } from '../utils/utils.js'
import passport from 'passport';
const router = Router();

router.get('/', (req, res) => {
  res.redirect('/login');
})

router.get('/admin',passport.authenticate('jwt-auth', { session: false }), authMiddleware(['admin']), (req, res) => {
  res.render('admin', { title: 'Inicio de sesion 🔐' });
});

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

router.get(`/recovery/:token`, (req, res) => {
  const token = req.params.token; // Obtener el token de la ruta
  res.render('recovery', { title: 'Restablecer contraseña', token });
});


router.get('/recoveryPass', (req, res) => {
  res.render('recoveryPass', { title: 'Password recovery' });
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

router.get('/loggerTest', (req, res) => {
  req.logger.debug('Hola desde el request index home 😁 (debug)');
  req.logger.info('Hola desde el request index home 😁 (info)');
  req.logger.warning('Hola desde el request index home 😁 (warn)');
  req.logger.error('Hola desde el request index home 😁 (error)');
  req.logger.fatal('Hola desde el request index home 😁 (fatal)');
  res.status(200).json({ message: "Logger test" });
})

export default router;