import {  Router  } from 'express';
import UserModel from '../../dao/models/user.model.js';
import passport from 'passport';
import {createHash, isValidPassword, createToken} from '../../utils.js';

const router = Router();

router.post('/auth/register', async (req, res)=>{
    const {
    body: {
        first_name,
        last_name,
        email,
        password,
        age,
    }, 
} = req;
    if(
        !first_name ||
        !last_name ||
        !email ||
        !password ||
        !age
    ) { 
       return res.status(400).json({message: 'Todos los campos son requeridos'}) 
    }
    let user = await UserModel.findOne({  email  });

    if(user){
        return res.status(400).json({ message: `Usuario ya registrado con el correo ${email}`})
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
passport.authenticate('jwt', {session:false}),
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
  
    res
      .cookie('access_token', token, { maxAge: 1000 * 60 * 30, httpOnly: true, signed: true })
      .status(200)
      .json({ message: 'Correct access'}); 
  
    
  });

  router.get('/auth/logout', (req, res) => {
        res.redirect('/login');
});

router.get('/auth/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Si se llega a este punto, el usuario está autenticado.
    res.status(200).json({ user: req.user });
  });

export default router;