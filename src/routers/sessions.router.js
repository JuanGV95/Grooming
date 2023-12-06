import { Router } from 'express';
import UserModel from '../dao/models/user.model.js';

const router = Router();

const admin = {
  first_name: 'Admi',
  last_name: 'Nistrador',
  email: 'adminCoder@coder.com',
  age: null,
  role: 'admin',
  password: 'adminCod3r123', // NO almacenes contraseñas en texto plano en un entorno de producción
}



router.post('/sessions/login', async(req, res) => {
  const { body: { email, password } } = req;

  if (!email || !password) {
    //return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    return res.render('error', { title: 'Error ❌', messageError: 'Todos los campos son requeridos.' });
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    //return res.status(401).json({ message: 'Correo o contraseña invalidos.' });
    return res.render('error', { title: 'Error ❌', messageError: 'Correo o contraseña invalidos.' });
  }
  if (user.password !== password) {
    //return res.status(401).json({ message: 'Correo o contraseña invalidos.' });
    return res.render('error', { title: 'Error ❌', messageError: 'Correo o contraseña invalidos.' });
  }

  //if del admin
  if (admin.email === email && admin.password === password) {
    res.redirect('/api/products');
  }
  
  const {
    first_name,
    last_name,
    age,
    role,
  } = user;
  req.session.user = {
    first_name,
    last_name,
    email,
    age,
    role,
  };

  //res.status(200).json({ message: 'Session iniciada correctamente.' });
  res.redirect('/api/products');
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