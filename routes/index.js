const express = require('express');
const router = express.Router();

// validations
const { body } = require('express-validator/check');

// import controller
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = () => {
  // home route
  router.get('/',
    authController.usuarioAutenticado,
    proyectosController.proyectosHome);

  router.get('/nuevo-proyecto',
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto);

  router.post(
    '/nuevo-proyecto',
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.nuevoProyecto
  );

  router.post(
    '/nuevo-proyecto/:id',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.actualizarProyecto
  );

  router.get('/proyectos/:url',
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl);

  router.get('/proyecto/editar/:id',
    authController.usuarioAutenticado,
    proyectosController.formularioEditar);

  // eliminar proyecto
  router.delete('/proyectos/:url',
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto);

  // Tareas
  router.post('/proyectos/:url',
    authController.usuarioAutenticado,
    tareasController.agregarTarea);

  router.patch('/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea);

  router.delete('/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.eliminarTarea);


  // crear nueva cuennta
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);

  router.post('/crear-cuenta', usuariosController.crearCuenta);

  router.get('/iniciar-sesion', usuariosController.formIniciarSesion);

  router.post('/iniciar-sesion', authController.autenticarUsuario);

  router.get('/cerrar-sesion', authController.cerrarSesion);

  router.get('/reestablecer', usuariosController.formRestablecerPassword);

  router.post('/reestablecer', authController.enviarToken);

  router.get('/reestablecer/:token', authController.formValidarToken);

  router.post('/reestablecer/:token', authController.actualizarPassword);

  router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

  return router;
};
