import axios from "axios";
import Swal from "sweetalert2";
import {actualizarAvance} from './funciones/avance';

const tareas = document.querySelector('.listado-pendientes');
console.log(tareas);

if (!!tareas) {

  tareas.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-check-circle')) {
      const icono = e.target;
      const idTarea = icono.parentElement.parentElement.dataset.tarea;
      const url = `${location.origin}/tareas/${idTarea}`;
      axios.patch(url, { idTarea }).then((response) => {
        if (response.status === 200) {
          icono.classList.toggle('completo');
          actualizarAvance();
        }
      });
    }

    if (e.target.classList.contains('fa-trash')) {
      const tareaHTML = e.target.parentElement.parentElement;
      const idTarea = e.target.parentElement.parentElement.dataset.tarea;

      Swal.fire({
        title: '¿Desea borrar esta tarea?',
        text: "No podrás recuperar la tarea",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Eliminando', idTarea);

          const url = `${location.origin}/tareas/${idTarea}`;
          axios.delete(url, { params: { idTarea }}).then((response) => {
            console.log(response);


            if (response.status === 200) {
              tareaHTML.parentElement.removeChild(tareaHTML);
              actualizarAvance();
            }
          });

        }
      })
    }

  });

}

export default tareas;
