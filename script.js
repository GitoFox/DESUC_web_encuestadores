function buscarEmpleado() {
  const rut = document.getElementById('rut').value.trim();

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
          <p>Empleado encontrado: ${nombreEmpleado} ${empleadoEncontrado[2]}</p>
          <img src="${imagenEmpleado}" alt="Imagen del empleado">
        `;

        const proyectosEmpleado = empleados.filter(empleado => empleado[0] === rut);
        proyectosEmpleado.forEach(proyecto => {
          resultadoDiv.innerHTML += `
            <p>Nombre Proyecto: ${proyecto[3]}</p>
            <p>Fecha Inicio Proyecto: ${proyecto[4]}</p>
            <p>Fecha Termino Proyecto: ${proyecto[5]}</p>
          `;
        });
      } else {
        resultadoDiv.textContent = 'No se encontró al empleado.';
      }
    })
    .catch(error => {
      console.error(error);
    });
}
