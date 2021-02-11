const passport = require('passport');
const Sequelize = require('sequelize');
const Usuarios = require('../models/Usuarios');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');
const crypto = require('crypto');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {

  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/iniciar-sesion');
};

exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/iniciar-sesion');
  });
};

// genera un token si el usuario es valido
exports.enviarToken = async (req, res, next) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.body.email
    }
  });

  if (!usuario) {
    req.flash('error', 'No existe esa cuenta');
    res.render('reestablecer', {
      nombrePagina: 'Reestablecer tu contraseña',
      mensajes: req.flash()
    });
    next();
  }

  usuario.token = crypto.randomBytes(20).toString('hex');
  usuario.expiration = Date.now() + 3600000;

  await usuario.save();

  console.log(usuario.token);
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  // enviar el correo con el token
  await enviarEmail.enviar({
    usuario,
    subject: 'Password Reset',
    resetUrl,
    archivo : 'reestablecerPassword'
  });

  req.flash('correcto', 'Se envio un mensaje a tu correo');
  res.redirect('/iniciar-sesion');
};

exports.formValidarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token
    }
  });

  if (!usuario) {
    req.flash('error', 'Token no válido');
    res.redirect('/reestablecer');
  }

  res.render('resetPassword', {
    nombrePagina: 'Reestablecer contraseña'
  });

  // console.log(req.params.token);
  // console.log(usuario);
};


exports.actualizarPassword = async (req, res) => {
  // validar token valido y fecha de expiracion
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiration: {
        [Op.gte] : Date.now()
      }
    }
  });

  console.log(usuario);
  if (!usuario) {
    req.flash('error', 'Token no válido');
    res.redirect('/reestablecer');
  }


  usuario.token = null;
  usuario.expiration = null;
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

  await usuario.save();

  req.flash('correcto', 'Tu password se ha modificado correctamente');
  res.redirect('/iniciar-sesion');
};
