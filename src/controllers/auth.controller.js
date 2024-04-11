// auth.controller.js

import { isValidPassword, createToken, verifyRecoveryToken, createHash } from '../utils/utils.js';
import UserModel from '../dao/models/user.model.js';
import UserDto from '../dto/user.dto.js';
import EmailService from '../services/email.service.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';


const AuthController = {
  async register(req, res) {
    try {
      const { first_name, last_name, email, password, role, age } = req.body;

      // Validar campos requeridos
      if (!first_name || !last_name || !email || !password || !age) {
        return res.status(400).json({ message: 'Todos los campos son requeridos y deben ser válidos' });
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
        role,
        age,
      });

      res.redirect('/login');
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Verificar si el correo y la contraseña están presentes
      if (!email || !password) {
        return res.status(401).json({ message: 'Correo o contraseña son inválidos' });
      }

      // Buscar al usuario por correo
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Correo o contraseña son inválidos' });
      }

      // Verificar si la contraseña es válida
      const isPasswordValid = isValidPassword(password, user);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Correo o contraseña son inválidos' });
      }

      // Actualizar la última conexión del usuario
      user.last_connection = new Date();
      await user.save();

      // Generar token de acceso
      const token = createToken(user);
      res.cookie('access_token', token, { maxAge: 1000 * 60 * 30, httpOnly: true, signed: true })
        .status(200)
        .json({
          message: 'Acceso correcto',
          user: new UserDto(user)
        });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },

  async recoveryPassword(req, res) {
    try {
      const { email } = req.body;

      // Verificar si se proporciona un correo electrónico
      if (!email) {
        return res.status(400).json({ message: 'Correo electrónico requerido para la recuperación de contraseña' });
      }

      // Buscar al usuario por correo
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Generar token de recuperación
      const token = jwt.sign({ userId: user._id }, config.jwtRecovery, { expiresIn: '1h' });

      // Crear enlace para restablecer contraseña
      const resetPasswordLink = `http://localhost:8080/recovery/${token}`;

      // Enviar correo electrónico de recuperación
      const emailContent = `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                           <a href="${resetPasswordLink}">Restablecer contraseña</a>`;
      await EmailService.getInstance().sendEmail(email, 'Recuperación de contraseña', emailContent);

      res.status(200).json({ message: 'Correo electrónico de recuperación enviado correctamente' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async updatePasswordWithToken(req, res) {
    try {
      const { password } = req.body;
      const { token } = req.params;

      // Verificar si se proporciona una contraseña
      if (!password) {
        return res.status(400).json({ message: 'El campo de contraseña es requerido' });
      }

      // Verificar el token de recuperación
      const payload = await verifyRecoveryToken(token);
      if (!payload.userId) {
        return res.status(400).json({ message: 'Token de recuperación inválido' });
      }

      // Buscar al usuario por ID
      const user = await UserModel.findById(payload.userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Verificar si la nueva contraseña es igual a la anterior
      const isSamePassword = isValidPassword(password, user);
      if (isSamePassword) {
        return res.status(400).json({ message: 'La contraseña no puede ser igual a la anterior' });
      }

      // Actualizar la contraseña del usuario
      user.password = createHash(password);
      await user.save();

      res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default AuthController;
