import { Router } from 'express';
import UserModel from '../../dao/models/user.model.js';
import {createHash} from '../../utils/utils.js';
import passport from 'passport';
const router = Router();

router.get('/users/me', passport.authenticate('jwt', {session: false}), async (req, res)=>{
  const user = await UserModel.findById(req.user.id);
  res.status(200).json(user);
})

router.get('/users', async (req, res, next) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:uid', async (req, res, next) => {
  try {
    const { params: { uid } } = req;
    const user = await UserModel.findById(uid);
    if (!user) {
      return res.status(401).json({ message: `User id ${uid} not found 😨.` });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/users/', async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;

    // Validar campos requeridos
    if (!first_name || !last_name || !email || !password || !age) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: `Usuario ya registrado con el correo ${email}` });
    }

    // Crear el usuario
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password: createHash(password),
      providerId: "",
      provider: "No provider",
      role,
      age
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.put('/users/:uid', async (req, res, next) => {
  try {
    const { body, params: { uid } } = req;
    await UserModel.updateOne({ _id: uid }, { $set: body });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.put('/users/premium/:uid', async (req, res, next)=>{
  try {
      const { uid } = req.params;
      const { role } = req.body;

      // Verificar si el rol enviado es válido
      if (role !== 'user' && role !== 'premium') {
          return res.status(400).json({ message: 'Rol inválido. El rol debe ser "user" o "premium".' });
      }

      // Buscar el usuario por su ID
      const user = await UserModel.findById(uid);
      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      // Verificar si el usuario ya tiene el rol solicitado
      if (user.role === role) {
          return res.status(400).json({ message: `El usuario ya tiene el rol "${role}".` });
      }

      // Actualizar el rol del usuario
      user.role = role;
      await user.save();

      res.status(200).json({ message: `El rol del usuario con ID ${uid} ha sido cambiado a "${role}".` });
  } catch (error) {
      console.error('Error al cambiar el rol del usuario:', error);
      res.status(500).json({ message: 'Error al cambiar el rol del usuario.' });
  }
});


router.delete('/users/:uid', async (req, res, next) => {
  try {
    const { params: { uid } } = req;
    await UserModel.deleteOne({ _id: uid });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;