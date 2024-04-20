import { Router } from 'express';
import AuthController from '../../controllers/auth.controller.js';
import passport from 'passport';
import UserDto from '../../dto/user.dto.js';
import cartModel from '../../dao/models/cart.model.js';

const router = Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/recoveryPass', AuthController.recoveryPassword);
router.put('/auth/recovery/:token', AuthController.updatePasswordWithToken);

router.get('/auth/logout', (req, res) => {
  res.redirect('/login');
});

router.get('/auth/current', passport.authenticate('jwt-auth', { session: false }), async (req, res) => {
  try {
    const user = req.user;
    const userDto = new UserDto(user);

    // Aquí obtienes los productos del carrito asociado al usuario
    const cart = await cartModel.findById(user.cart).populate('products.product');
    const productsInCart = cart ? cart.products : [];

    res.status(200).json({ user: userDto, cart: productsInCart });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los datos del usuario y del carrito' });
  }
});



export default router;
