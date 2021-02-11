const Sequelize = require('sequelize');
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const slug = require('slug');

exports.proyectosHome = async (req, res) => {
  // console.log(res.locals.usuario);
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId
    }
  });
  res.render('index', {
    nombrePagina: 'Proyectos',
    proyectos
  });
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId
    }
  });
  res.render('nuevoProyecto', {
    nombrePagina: 'Nuevo Proyecto',
    proyectos
  });
};

exports.nuevoProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId
    }
  });
  // enviar a la consola lo que el usuario escriba
  const { nombre } = req.body;
  let errores = [];
  if (!nombre) {
    errores.push({texto: 'Agregar un nombre al proyecto'});
  }

  // if errores
  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      proyectos,
      errores
    });
  } else {
    // insert in DB
    // const url = slug(nombre).toLowerCase();
    // const proyecto = await Proyectos.create({ nombre, url });
    const usuarioId = res.locals.usuario.id;
    const proyecto = await Proyectos.create({ nombre, usuarioId });
    res.redirect('/')
  }
};

exports.actualizarProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId
    }
  });
  // enviar a la consola lo que el usuario escriba
  const { nombre } = req.body;
  let errores = [];
  if (!nombre) {
    errores.push({texto: 'Agregar un nombre al proyecto'});
  }

  // if errores
  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      proyectos,
      errores
    });
  } else {
    // insert in DB
    // const url = slug(nombre).toLowerCase();
    // const proyecto = await Proyectos.create({ nombre, url });
    await Proyectos.update(
      { nombre },
      {where:
          {id: req.params.id}
      }
    );
    res.redirect('/')
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId
    }
  });
  const proyecto = await Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId
    }
  });

  if (!proyecto) {
    res.redirect('/');
    return next();
    // return next();
  }

  const tareas = await Tareas.findAll({
    where: {
      proyectoId: proyecto.id,
    },
    include: [{model: Proyectos}]
  });

  console.log(tareas);

  res.render('tareas', {
    nombrePagina: 'Tareas del proyecto',
    proyectos,
    proyecto,
    tareas
  });
  // res.send(req.params.url);
};

exports.formularioEditar = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId
    }
  });
  const proyecto = await Proyectos.findOne({
    where: {
      id: req.params.id,
      usuarioId
    }
  });

  res.render('nuevoProyecto', {
    nombrePagina: 'Editar proyecto',
    proyectos,
    proyecto
  })
};

exports.eliminarProyecto = async (req, res, next) => {
  const { urlProyecto } = req.query;

  const resultado = await Proyectos.destroy({
    where: {
      url: urlProyecto
    }
  });

  // es.redirect('/');

  if (!resultado) {
    return next();
  }

  res.json({
    status: 1,
    msg: 'ok'
  })

};
