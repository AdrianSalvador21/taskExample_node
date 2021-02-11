
export const actualizarAvance = () => {
  // seleccionar las tareas existentes
  const tareas = document.querySelectorAll('li.tarea');

  if (tareas.length) {
    const tareasCompletadas = document.querySelectorAll('i.completo');

    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

    const porcentaje = document.getElementById('porcentaje');
    porcentaje.style.width = avance+'%';

  }
};
