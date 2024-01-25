import { Router } from 'express';
import UserModel from '../../dao/models/user.model.js';
import {createHash} from '../../utils.js';
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

    // Crear un ObjectId vacío para el carrito (esto podría cambiarse según la lógica de tu aplicación)
    const emptyCartId = new mongoose.Types.ObjectId();

    // Crear el usuario
    const newUser = await UserModel.create({
        first_name,
        last_name,
        email,
        password: createHash(password), // Hash del password
        providerId: "",
        provider: "No provider",
        cart: emptyCartId,
        role: 'user',
        age
    });

    // Redirigir al usuario
    res.redirect('/login');
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