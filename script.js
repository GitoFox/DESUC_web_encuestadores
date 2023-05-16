var Fn = {
	// Valida el rut con su cadena completa "XXXXXXXX-X"
	validaRut : function (rutCompleto) {
		rutCompleto = rutCompleto.replace("‐","-");
		if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
			return false;
		var tmp 	= rutCompleto.split('-');
		var digv	= tmp[1]; 
		var rut 	= tmp[0];
		if ( digv == 'K' ) digv = 'k' ;
		
		return (Fn.dv(rut) == digv );
	},
	dv : function(T){
		var M=0,S=1;
		for(;T;T=Math.floor(T/10))
			S=(S+T%10*(9-M++%6))%11;
		return S?S-1:'k';
	}
}


$("#btnvalida").click(function(){
	if (Fn.validaRut( $("#txt_rut").val() )){
		$("#msgerror").html("El rut ingresado es válido :D");
	} else {
		$("#msgerror").html("El Rut no es válido :'( ");
	}
});


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
