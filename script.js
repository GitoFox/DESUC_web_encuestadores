var Fn = {
  // Valida el rut con su cadena completa "XXXXXXXX-X"
  validaRut: function (rutCompleto) {
    rutCompleto = rutCompleto.replace("‐", "-");
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
      return false;
    var tmp = rutCompleto.split('-');
    var digv = tmp[1];
    var rut = tmp[0];
    if (digv == 'K') digv = 'k';

    return (Fn.dv(rut) == digv);
  },
  dv: function (T) {
    var M = 0,
      S = 1;
    for (; T; T = Math.floor(T / 10))
      S = (S + T % 10 * (9 - M++ % 6)) % 11;
    return S ? S - 1 : 'k';
  }
}

function buscarEmpleado() {
  const rut = document.getElementById('rut').value.trim();

  if (!Fn.validaRut(rut)) {
    // Rut inválido, mostrar mensaje de error
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.textContent = 'El Rut no es válido.';

    return; // Salir de la función si el Rut es inválido
  }

  // Realizar la lectura del archivo CSV
  fetch('encuestadores.csv')
    .then(response => response.text())
    .then(data => {
      // Parsear el contenido CSV
      const filas = data.split('\n');
      const empleados = filas.map(fila => fila.split(','));

      // Buscar al empleado por su RUT
      const empleadoEncontrado = empleados.find(empleado => empleado[0] === rut);

      // Mostrar el resultado
      const resultadoDiv = document.getElementById('resultado');
      if (empleadoEncontrado) {
        const nombreEmpleado = empleadoEncontrado[1];
        const imagenEmpleado = empleadoEncontrado[6]; // Supongamos que la columna de imagen es la posición 6

        resultadoDiv.innerHTML = `
          <img src="${imagenEmpleado}" alt="Imagen del empleado">
          <p>Empleado encontrado: ${nombreEmpleado} ${empleadoEncontrado[2]}</p>
        `;

        const proyectosEmpleado = empleados.filter(empleado => empleado[0] === rut);
        const currentDate = new Date();

        const proyectosActivos = proyectosEmpleado.filter(proyecto => {
          const fechaInicio = new Date(proyecto[4]);
          const fechaTermino = new Date(proyecto[5]);
          return currentDate <= fechaTermino;
        });

        if (proyectosActivos.length > 0) {
          resultadoDiv.innerHTML += `
            <p>Proyectos activos:</p>
            ${proyectosActivos.map(proyecto => `
              <p class="project active">
                Nombre Proyecto: ${proyecto[3]}
              </p>
              <p>Fecha Inicio Proyecto: ${new Date(proyecto[4]).toLocaleDateString()}</p>
              <p>Fecha Termino Proyecto: ${new Date(proyecto[5]).toLocaleDateString()}</p>
            `).join('')}
          `;
        } else {
          resultadoDiv.innerHTML += `
            <p>No se encontraron proyectos activos.</p>
          `;
        }

        const proyectosExpirados = proyectosEmpleado.filter(proyecto => {
          const fechaTermino = new Date(proyecto[5]);
          return currentDate > fechaTermino;
        });

        if (proyectosExpirados.length > 0) {
          resultadoDiv.innerHTML += `
            <p>Proyectos expirados:</p>
            <select>
              ${proyectosExpirados.map(proyecto => `<option>${proyecto[3]}</option>`).join('')}
            </select>
          `;
        } else {
          resultadoDiv.innerHTML += `
            <p>No se encontraron proyectos expirados.</p>
          `;
        }
      } else {
        resultadoDiv.textContent = 'No se encontró al empleado.';
      }
    })
    .catch(error => {
      console.error(error);
    });
}
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses en JavaScript son base 0
  const year = date.getFullYear().toString();

  return `${day}/${month}/${year}`;
}


function isProjectActive(currentDate, endDate) {
  return currentDate <= endDate;
}
