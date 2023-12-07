import { Router } from 'express';
import UserModel from '../dao/models/user.model.js';

const router = Router();

const admin = {
  first_name: 'Admi',
  last_name: 'Nistrador',
  email: 'adminCoder@coder.com',
  age: 18,
  role: 'Admin',
  password: 'adminCod3r123'
}

router.post('/sessions/login', async (req, res) => {
  try {
    const { body: { email, password } } = req;

    console.log('Login attempt:', { email, password });

    if (email === admin.email && password === admin.password) {
      console.log('Admin inició sesión');
      req.session.user = admin;  // Cambia aquí a req.session.user
    } else {
      const user = await UserModel.findOne({ email });

      console.log('Usuario encontrado en la base de datos:', user);

      if (!email || !password) {
        //return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        return res.render('error', { title: 'Error ❌', messageError: 'Todos los campos son requeridos.' });
      }

      if (!user) {
        //return res.status(401).json({ message: 'Correo o contraseña invalidos.' });
        return res.render('error', { title: 'Error ❌', messageError: 'Correo o contraseña invalidos.' });
      }
   
      if (user.password !== password) {
        //return res.status(401).json({ message: 'Correo o contraseña invalidos.' });
        return res.render('error', { title: 'Error ❌', messageError: 'Correo o contraseña invalidos.' });
      }

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
        age, 
        role };
    }

    res.redirect('/api/products');
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    res.render('error', { title: 'Error ❌', messageError: 'Ha ocurrido un error desconocido.' });
  }
});

router.post('/sessions/register', async (req, res) => {
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
})

export default router;