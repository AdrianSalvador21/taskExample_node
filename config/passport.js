const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al modelo donde vamos a autennticar
const Usuarios = require('../models/Usuarios');

// local strategy - login con crredenciles propios (usuario y password)
passport.use(
  new LocalStrategy(
    // por default espera un usuario y password (usernnameField espera el nobmre que tenemos en el modelo)
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {

      console.log(email);
      try {
        const usuario = await Usuarios.findOne({
          where: {
            email,
            active: 1
          }
        });
        // console.log(usuario);
        if (!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: 'Password incorrecto'
          });
        }
        return done(null, usuario);

      } catch (e) {
        console.log('CATCH', e);
        return done(null, false, {
          message: 'Esa cuenta no existe'
        });
      }

    }
  )
);

// serialize user
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

// deserializar
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

// exportar
module.exports = passport;
