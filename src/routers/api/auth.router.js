import { Router } from 'express';
import UserModel from '../../dao/models/user.model.js';
import passport from 'passport';
import { createHash, isValidPassword, createToken, authMiddleware, verifyRecoveryToken } from '../../utils/utils.js';
import UserDto from '../../dto/user.dto.js';
import { CustomError } from '../../utils/customError.js';
import { generatorUserError } from '../../utils/causeMessageError.js';
import EnumsError from '../../utils/enumsError.js';
import EmailService from '../../services/email.service.js';
import jwt from 'jsonwebtoken';
import config from '../../config/config.js';
const router = Router();

router.post('/auth/register', async (req, res) => {
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
    !password ||
    !age
  ) {
    CustomError.create({
      name: 'Invalid data user',
      cause: generatorUserError({
        first_name,
        last_name,
        email,
        age,
      }),
      message: 'Ocurrio un error mientras intentamos crear un nuevo usuario 😱',
      code: EnumsError.BAD_REQUEST_ERROR,
    })
  }
  let user = await UserModel.findOne({ email });

  if (user) {
    return res.status(400).json({ message: `Usuario ya registrado con el correo ${email}` })
  }

  user = await UserModel.create({
    first_name,
    last_name,
    email,
    password: createHash(password),
    age,
  })
  res.redirect('/login');
})

router.post('/auth/login',
  //passport.authenticate('jwt', {session:false}),
  async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: 'Correo o contraseña son invalidos' });
    }
    const user = await UserModel.findOne({ email });
    console.log('user', user);
    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña son invalidos' });
    }

    const isNotValidPass = !isValidPassword(password, user);
    if (isNotValidPass) {
      return res.status(401).json({ message: 'Correo o contraseña son invalidos' });
    }
    const token = createToken(user);
    console.log('token', token);
    res
      .cookie('access_token', token, { maxAge: 1000 * 60 * 30, httpOnly: true, signed: true })
      .status(200)
      .json({
        message: 'Correct access',
        cartId: user.cart
      });

  });

  router.post('/auth/recoveryPass', async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Correo electrónico requerido para la recuperación de contraseña' });
    }
  
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  
    const token = jwt.sign({ userId: user._id }, config.jwtRecovery, { expiresIn: '1h' });
   
    const resetPasswordLink = `http://localhost:8080/recovery/${token}`; // Corrige el formato de la URL
    
    const emailContent = `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                           <a href="${resetPasswordLink}">Restablecer contraseña</a>`;
    try {
      await EmailService.getInstance().sendEmail(email, 'Recuperación de contraseña', emailContent);
      res.status(200).json({ message: 'Correo electrónico de recuperación enviado correctamente' });
    } catch (error) {
      console.error('Error al enviar el correo electrónico de recuperación de contraseña:', error);
      res.status(500).json({ message: 'Error al enviar el correo electrónico de recuperación de contraseña' });
    }
  });

  router.put('/auth/recovery/:token', async (req, res) => {
    const { password } = req.body; 
    const { token } = req.params;  
  
    try {
      if (!password) {
        return res.status(400).json({ message: 'El campo de contraseña es requerido' });
      }
  
      // Verificar el token de recuperación
      const payload = await verifyRecoveryToken(token);
      console.log('payload',payload); 
      if (!payload.userId) {
        return res.status(400).json({ message: 'Token de recuperación inválido' });
      }
      const user = await UserModel.findById(payload.userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      const isSamePassword = isValidPassword(password, user);
      if (isSamePassword) {
        return res.status(400).json({ message: 'La contraseña no puede ser igual a la anterior' });
      }
  
      user.password = createHash(password);
      await user.save();
  
      res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      res.status(500).json({ message: 'Error al actualizar la contraseña' });
    }
  });
  



router.get('/auth/logout', (req, res) => {
  res.redirect('/login');
});

router.get('/auth/current', passport.authenticate('jwt-auth', { session: false }), (req, res) => {
  const userDto = new UserDto(req.user)
  res.status(200).json({ user: userDto });
});

export default router;