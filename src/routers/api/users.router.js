import { Router } from 'express';
import UserModel from '../../dao/models/user.model.js';
import {authMiddleware, createHash} from '../../utils/utils.js';
import passport from 'passport';
import EmailService from '../../services/email.service.js';
import upload from '../../utils/uploader.js';
const router = Router();


router.get('/users', passport.authenticate('jwt-auth', { session: false }), authMiddleware(['admin']), async (req, res) => {
  try {
    // Obtener todos los usuarios con los datos principales
    const users = await UserModel.find({}, { first_name: 1, last_name: 1, email: 1, role: 1 });

    // Devolver la lista de usuarios
    res.status(200).json(users);
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
});


router.post('/user/:uid/documents', upload.array('documents'), async (req, res) => {
  const userId = req.params.uid;
  const documents = req.files;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

 
    for (const document of documents) {
      user.documents.push({
        name: document.originalname,
        path: document.path
      });
    }

    console.log('user', user);
    console.log('documents', documents);
    await user.save();
    res.status(200).json({ message: 'Documentos subidos correctamente', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir documentos', error });
  }
});




router.get('/users/me', passport.authenticate('jwt', {session: false}), async (req, res)=>{
  const user = await UserModel.findById(req.user.id);
  res.status(200).json(user);
})


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

router.put('/users/premium/:uid', async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { role } = req.body;

    // Verificar si el rol enviado es válido
    if (role === 'premium') {
      return res.status(400).json({ message: 'Solo se permite actualizar a un usuario a premium.' });
    }

    // Buscar el usuario por su ID
    const user = await UserModel.findById(uid);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Verificar si el usuario ya tiene el rol solicitado
    if (user.role === 'premium') {
      return res.status(400).json({ message: `El usuario ya tiene el rol "${user.role}".` });
    }

    // Verificar si el usuario ha cargado los documentos requeridos
    if (!user.documents || user.documents.length === 0) {
      return res.status(400).json({ message: 'El usuario no ha terminado de procesar su documentación.' });
    }

    // Verificar si los documentos requeridos están presentes en los documentos del usuario
    const requiredDocuments = ['Identificacion.pdf', 'Comprobante de domicilio.pdf', 'Comprobante de estado de cuenta.pdf'];
    const userDocuments = user.documents.map(doc => doc.name);
    console.log('userDocuments', userDocuments);
    const hasAllRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));
    console.log('hasAllRequiredDocuments', hasAllRequiredDocuments);
    if (!hasAllRequiredDocuments) {
      return res.status(400).json({ message: 'El usuario no ha subido todos los documentos requeridos.' });
    }

    // Actualizar el rol del usuario
    user.role = "premium";
    await user.save();

    res.status(200).json({ message: `El rol del usuario con ID ${uid} ha sido cambiado a "${user.role}".` });
  } catch (error) {
    console.error('Error al cambiar el rol del usuario:', error);
    res.status(500).json({ message: 'Error al cambiar el rol del usuario.' });
  }
});

router.delete('/users/:uid',passport.authenticate('jwt-auth', { session: false }), authMiddleware(['admin']), async (req, res, next) => {
  try {
    const { params: { uid } } = req;
    await UserModel.deleteOne({ _id: uid });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.delete('/users', passport.authenticate('jwt-auth', { session: false }), authMiddleware(['admin']), async (req, res, next) => {
  try {
    // Calcular la fecha límite para la inactividad (por ejemplo, hace 30 minutos)
    const inactiveThreshold = new Date();
    inactiveThreshold.setMinutes(inactiveThreshold.getMinutes() - 30);

    // Encontrar usuarios inactivos que sean de tipo 'user' y no sean administradores
    const inactiveUsers = await UserModel.find({
      last_connection: { $lt: inactiveThreshold },
      role: 'user'
    });

    // Eliminar usuarios inactivos
    const deletedUsers = await UserModel.deleteMany({
      last_connection: { $lt: inactiveThreshold },
      role: 'user'
    });

    // Enviar correos electrónicos de notificación a los usuarios eliminados
    const emailPromises = inactiveUsers.map(async user => {
      try {
        const emailContent = `<p>Su cuenta ha sido eliminada debido a inactividad.</p>`;
        await EmailService.getInstance().sendEmail(user.email, 'Notificación de eliminación de cuenta', emailContent);
      } catch (error) {
        console.error(`Error al enviar correo electrónico de notificación a ${user.email}:`, error);
      }
    });
    await Promise.all(emailPromises);

    // Devolver una respuesta con la cantidad de usuarios eliminados
    res.status(200).json({ message: `Se eliminaron ${deletedUsers.deletedCount} usuarios inactivos.` });
  } catch (error) {
    console.error('Error al eliminar usuarios inactivos:', error);
    res.status(500).json({ message: 'Error al eliminar usuarios inactivos.' });
  }
});


export default router;