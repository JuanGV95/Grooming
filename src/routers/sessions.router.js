import { Router } from 'express';
import UserModel from '../dao/models/user.model.js';
import passport from 'passport';
import { createHash, isValidPassword } from '../utils.js';


const router = Router();

const admin = {
  first_name: 'Admi',
  last_name: 'Nistrador',
  email: 'adminCoder@coder.com',
  age: 18,
  role: 'Admin',
  password: 'adminCod3r123',
}


router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
  try {
    const { body: { email, password } } = req;
    console.log('admin.password', admin.password)
    console.log('Login attempt:', { email, password });

    if (email === admin.email && password === admin.password) {
      console.log('Admin inició sesión');
      req.session.user = admin;  
    }else {
      const user = await UserModel.findOne({ email });

      console.log('Usuario encontrado en la base de datos:', user);

      console.log('Usuario inició sesión');
      const {
        first_name,
        last_name,
        age,
        role
      } = user;
      req.session.user = {
        first_name,
        last_name,
        email,
        role,
        age,
      }
    }

    res.redirect('/api/products');
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    res.render('error', { title: 'Error ❌', messageError: 'Ha ocurrido un error desconocido.' });
  }
});

router.post('/sessions/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res) => {
  const {
    body: {
      first_name,
      last_name,
      email,
      password,
      age,
    },
  } = req;
  if (
    !first_name ||
    !last_name ||
    !email ||
    !password
  ) {
    //return  res.status(400).json({ message: 'Todos los campos son requeridos.' });
    return res.render('error', { title: 'Hello People 🖐️', messageError: 'Todos los campos son requeridos.' });
  }
  const user = await UserModel.create({
    first_name,
    last_name,
    email,
    password,
    age,
    role: email === 'adminCoder@coder.com' && password === 'adminCod3r123' ? 'admin' : 'user',
  });

  //res.status(201).json(user);
  res.redirect('/login');
});

router.get('/sessions/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'No estas autenticado.' });
  }
  res.status(200).json(req.session.user);
});

router.get('/session/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.render('error', { title: 'Hello People 🖐️', messageError: error.message });
    }
    res.redirect('/login');
  });
});

router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {

  
  req.session.user = req.user;
  console.log('req.user', req.user);
  res.redirect('/api/products');
});

export default router;