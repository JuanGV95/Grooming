import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../dao/models/user.model.js';
import { createHash, isValidPassword, JWT_SECRET, JWT_RECOVERY } from '../utils/utils.js';

//JwtStrategy con cookies
function cookieExtractor(req){
  let token = null;
  if(req && req.signedCookies){
    token = req.signedCookies['access_token'];
  }

  return token
}

export const init = () => {
  const registerOpts = {
    usernameField: 'email',
    passReqToCallback: true,
  };
  const opts ={
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]) 
  }
  passport.use('jwt-auth', new JwtStrategy({ ...opts, secretOrKey: JWT_SECRET }, (payload, done) => {
    if (payload.type !== 'auth') {
      return done(null, false, { message: 'Token inválido para autenticación' });
    }
    const user = payload;
    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
  }));

  passport.use('jwt-reset-password', new JwtStrategy({ ...opts, secretOrKey: JWT_RECOVERY }, (payload, done) => {
    if (payload.type !== 'reset_password') {
      return done(null, false, { message: 'Token inválido para restablecer contraseña' });
    }
    const user = payload;
    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
  }));



  const gitghubOpts = {
    clientID: 'Iv1.cf97d0d4f990e521',
    clientSecret: '6634b032517e25639f63fcf4906b16aa0fefb47b',
    callbackURL: 'http://localhost:8080/api/sessions/github/callback',
  }
  passport.use('github', new GithubStrategy(gitghubOpts, async (accessToken, refreshToken, profile, done) => {
    const email = profile._json.email;
    let user = await UserModel.findOne({ email });
    if (user) {
      return done(null, user);
    }
    user = {
      first_name: profile._json.name,
      last_name: '',
      email,
      password: '',
      age: 18,
    };
    const newUser = await UserModel.create(user);
    done(null, newUser)
  }));





}