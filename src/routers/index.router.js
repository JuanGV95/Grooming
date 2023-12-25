import { Router } from 'express';
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

export default router;