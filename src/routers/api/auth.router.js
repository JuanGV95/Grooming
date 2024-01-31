import {  Router  } from 'express';
import UserModel from '../../dao/models/user.model.js';
import passport from 'passport';
import {createHash, isValidPassword, createToken} from '../../utils/utils.js';
import UserDto from '../../dto/user.dto.js';
import { CustomError } from '../../utils/customError.js';
import { generatorUserError } from '../../utils/causeMessageError.js';
import EnumsError from '../../utils/enumsError.js';
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
      .json({ message: 'Correct access',
              cartId: user.cart
    }); 
  
    
  });

  router.get('/auth/logout', (req, res) => {
        res.redirect('/login');
});

router.get('/auth/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userDto = new UserDto(req.user)
    res.status(200).json({ user: userDto });
  });

export default router;