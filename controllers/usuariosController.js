const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res, next) => {
  res.render('crearCuenta', {
    nombrePagina: 'Crear cuenta en UpTask'
  });
};

exports.formIniciarSesion = (req, res, next) => {
  const {error} = res.locals.mensajes;
  res.render('iniciarSesion', {
    nombrePagina: 'Inicia sesión en UpTask',
    error
  });
};

exports.formRestablecerPassword = (req, res, next) => {
  res.render('reestablecer', {
    nombrePagina: 'Reestablecer tu contraseña'
  });
};

exports.crearCuenta = async (req, res, next) => {
  const {email, password} = req.body;

  Usuarios.create({
    email,
    password
  }).then(async () => {

    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

    const usuario = {
      email
    };

    // enviar el correo con el token
    await enviarEmail.enviar({
      usuario,
      subject: 'Confirma tu cuenta UpTask',
      confirmarUrl,
      archivo : 'confirmarCuenta'
    });

    req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
    res.redirect('/iniciar-sesion');
  }).catch((error) => {

    req.flash('error', error.errors.map(error => error.message));
    res.render('crearCuenta', {
      mensajes: req.flash(),
      nombrePagina: 'Crear cuenta enn UpTask',
      email,
      password
    });
  });
};

exports.confirmarCuenta = async (req, res) => {
  // res.json(req.params.correo);
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo
    }
  });

  if (!usuario) {
    req.flash('error', 'No válido');
    res.redirect('/crear-cuenta');
  }

  usuario.active = 1;
  await usuario.save();

  req.flash('correcto', 'Cuenta activada correctamente');
  res.redirect('/iniciar-sesion');
};
