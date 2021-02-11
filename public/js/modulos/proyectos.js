import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
  btnEliminar.addEventListener('click', (e) => {
    const urlProyecto = e.target.dataset.proyectoUrl;
    console.log(urlProyecto);
    Swal.fire({
      title: '¿Desea borrar este proyecto??',
      text: "No podrás recuperar el proyecto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // enviar peticion a axioos
        const url = `${location.origin}/proyectos/${urlProyecto}`;

        axios.delete(url, {params: {urlProyecto}}).then((res) => {
          if (!!res.data && res.data.status === 1) {
            console.log('respuesta');
            Swal.fire(
              'Proyecto eliminado!',
              'El proyecto se elimino',
              'success'
            );

            // redirect
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          } else {
            Swal.fire(
              'Error!',
              'Hubo un problema al eliminar el proyecto',
              'error'
            );
          }
        }).catch((error) => {
          Swal.fire(
            'Error!',
            'Hubo un problema al eliminar el proyecto',
            'error'
          );
        });
      }
    })
  });
}

export default btnEliminar;
