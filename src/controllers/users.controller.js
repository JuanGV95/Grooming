import UserModel from '../dao/models/user.model.js';
import EmailService from '../services/email.service.js';
import { createHash } from '../utils/utils.js';

const UserController = {
  async getAllUsers(req, res) {
    try {
      const users = await UserModel.find({}, { first_name: 1, last_name: 1, email: 1, role: 1 });
      res.status(200).json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios.' });
    }
  },

  async uploadUserDocuments(req, res) {
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

      await user.save();
      res.status(200).json({ message: 'Documentos subidos correctamente', user });
    } catch (error) {
      res.status(500).json({ message: 'Error al subir documentos', error });
    }
  },

  async getCurrentUser(req, res) {
    const user = await UserModel.findById(req.user.id);
    res.status(200).json(user);
  },

  async getUserById(req, res, next) {
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
  },

  async createUser(req, res, next) {
    try {
      const { first_name, last_name, email, password, age } = req.body;

      if (!first_name || !last_name || !email || !password || !age) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: `Usuario ya registrado con el correo ${email}` });
      }

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
  },

  async updateUser(req, res, next) {
    try {
      const { body, params: { uid } } = req;
      await UserModel.updateOne({ _id: uid }, { $set: body });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },

  async updateToPremium(req, res, next) {
    try {
      const { uid } = req.params;
      const { role } = req.body;

      if (role === 'premium') {
        return res.status(400).json({ message: 'Solo se permite actualizar a un usuario a premium.' });
      }

      const user = await UserModel.findById(uid);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      if (user.role === 'premium') {
        return res.status(400).json({ message: `El usuario ya tiene el rol "${user.role}".` });
      }

      if (!user.documents || user.documents.length === 0) {
        return res.status(400).json({ message: 'El usuario no ha terminado de procesar su documentación.' });
      }

      const requiredDocuments = ['Identificacion.pdf', 'Comprobante de domicilio.pdf', 'Comprobante de estado de cuenta.pdf'];
      const userDocuments = user.documents.map(doc => doc.name);
      const hasAllRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));
      if (!hasAllRequiredDocuments) {
        return res.status(400).json({ message: 'El usuario no ha subido todos los documentos requeridos.' });
      }

      user.role = "premium";
      await user.save();

      res.status(200).json({ message: `El rol del usuario con ID ${uid} ha sido cambiado a "${user.role}".` });
    } catch (error) {
      console.error('Error al cambiar el rol del usuario:', error);
      res.status(500).json({ message: 'Error al cambiar el rol del usuario.' });
    }
  },

  async deleteUserById(req, res, next) {
    try {
      const { params: { uid } } = req;
      await UserModel.deleteOne({ _id: uid });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },

  async deleteInactiveUsers(req, res, next) {
    try {
      const inactiveThreshold = new Date();
      inactiveThreshold.setMinutes(inactiveThreshold.getMinutes() - 30);

      const inactiveUsers = await UserModel.find({
        last_connection: { $lt: inactiveThreshold },
        role: 'user'
      });

      const deletedUsers = await UserModel.deleteMany({
        last_connection: { $lt: inactiveThreshold },
        role: 'user'
      });

      const emailPromises = inactiveUsers.map(async user => {
        try {
          const emailContent = `<p>Su cuenta ha sido eliminada debido a inactividad.</p>`;
          await EmailService.getInstance().sendEmail(user.email, 'Notificación de eliminación de cuenta', emailContent);
        } catch (error) {
          console.error(`Error al enviar correo electrónico de notificación a ${user.email}:`, error);
        }
      });
      await Promise.all(emailPromises);

      res.status(200).json({ message: `Se eliminaron ${deletedUsers.deletedCount} usuarios inactivos.` });
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      res.status(500).json({ message: 'Error al eliminar usuarios inactivos.' });
    }
  }
};

export default UserController;
