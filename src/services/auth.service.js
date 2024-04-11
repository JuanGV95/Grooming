import UserModel from '../dao/models/user.model.js';
import { createHash } from '../utils/utils.js';
import EmailService from '../services/email.service.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export async function registerUser({ first_name, last_name, email, password, role, age }) {
  if (!first_name || !last_name || !email || !password || !age) {
    throw new Error('Todos los campos son requeridos y deben ser válidos');
  }

  let user = await UserModel.findOne({ email });

  if (user) {
    throw new Error(`Usuario ya registrado con el correo ${email}`);
  }

  user = await UserModel.create({
    first_name,
    last_name,
    email,
    password: createHash(password),
    role,
    age,
  });

  return user;
}

export async function sendPasswordRecoveryEmail(email) {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const token = jwt.sign({ userId: user._id }, config.jwtRecovery, { expiresIn: '1h' });

  const resetPasswordLink = `http://localhost:8080/recovery/${token}`;
  const emailContent = `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                         <a href="${resetPasswordLink}">Restablecer contraseña</a>`;

  try {
    await EmailService.getInstance().sendEmail(email, 'Recuperación de contraseña', emailContent);
  } catch (error) {
    throw new Error('Error al enviar el correo electrónico de recuperación de contraseña');
  }
}
