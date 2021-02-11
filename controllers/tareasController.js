const Tareas = require('../models/Tareas');
const Proyectos = require('../models/Proyectos');

exports.agregarTarea = async (req, res, next) => {
  console.log(req.params.url);
  // obtener el proyecto al que pertenece la tarea
  const proyecto = await Proyectos.findOne({
    where: {
      url: req.params.url
    }
  });

  // leer el valor del input y datos a insertar
  const { tarea } = req.body;
  const estado = 0;
  const proyectoId = proyecto.id;

  // insertar y redireccionar
  const resultado = await Tareas.create({
    tarea,
    estado,
    proyectoId
  });

  if (!resultado) {
    return next();
  }
  res.redirect(`/proyectos/${req.params.url}`);
  return next();
};

exports.cambiarEstadoTarea = async (req, res, next) => {
  const tarea = await Tareas.findOne({
    where: {
      id: req.params.id
    }
  });

  let estado = 0;
  if (tarea.estado === estado) {
    estado = 1;
  }

  tarea.estado = estado;
  const resultado = await tarea.save();

  if (!resultado) {
    return next();
  }
  res.status(200).json({
    tarea,
    status: 'ok'
  });
};

exports.eliminarTarea = async (req, res, next) => {
  const resultado = await Tareas.destroy({
    where: {
      id: req.params.id
    }
  });

  if (!resultado) {
    return next();
  }

  res.status(200).send('ok');
};
