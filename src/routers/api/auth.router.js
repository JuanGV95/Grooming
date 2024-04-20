import { Router } from 'express';
import AuthController from '../../controllers/auth.controller.js';
import passport from 'passport';
import UserDto from '../../dto/user.dto.js';


const router = Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/recoveryPass', AuthController.recoveryPassword);
router.put('/auth/recovery/:token', AuthController.updatePasswordWithToken);

router.get('/auth/logout', (req, res) => {
  res.redirect('/login');
});

router.get('/auth/current', passport.authenticate('jwt-auth', { session: false }), (req, res) => {
  const userDto = new UserDto(req.user);
  res.status(200).json({ user: userDto });
});

export default router;
