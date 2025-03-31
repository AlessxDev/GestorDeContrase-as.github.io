let contraseñasGuardadas = {};
let caracteresEspecialesOriginal = ''; // Para guardar el valor original de los caracteres especiales

function mostrarFormulario(tipo) {
    document.querySelectorAll('.formulario').forEach(form => form.style.display = 'none');
    if (tipo === 'generar') {
        document.getElementById('formulario-generar').style.display = 'block';
    } else if (tipo === 'eliminar') {
        document.getElementById('formulario-eliminar').style.display = 'block';
    }
}

function toggleOpciones() {
    const hexadecimal = document.getElementById('hexadecimal');
    const mayusculas = document.getElementById('mayusculas');
    const minusculas = document.getElementById('minusculas');
    const numeros = document.getElementById('numeros');
    const caracteresEspeciales = document.getElementById('caracteres-especiales');

    if (hexadecimal.checked) {
        // Guardar el valor original de los caracteres especiales
        caracteresEspecialesOriginal = caracteresEspeciales.value;
        // Deshabilitar mayúsculas, minúsculas y números
        mayusculas.disabled = true;
        minusculas.disabled = true;
        numeros.disabled = true;
        // Establecer caracteres especiales a !@#$%^&* y bloquear el campo
        caracteresEspeciales.value = '!@#$%^&*';
        caracteresEspeciales.disabled = true; // Bloquear el campo
    } else {
        // Restaurar el valor original de los caracteres especiales
        caracteresEspeciales.value = caracteresEspecialesOriginal;
        // Habilitar todas las opciones
        mayusculas.disabled = false;
        minusculas.disabled = false;
        numeros.disabled = false;
        caracteresEspeciales.disabled = false; // Desbloquear el campo
    }
}

function generarContraseña() {
    const nombre = document.getElementById('nombre').value;
    const longitud = parseInt(document.getElementById('longitud').value);
    const mayusculas = document.getElementById('mayusculas').checked;
    const minusculas = document.getElementById('minusculas').checked;
    const numeros = document.getElementById('numeros').checked;
    const hexadecimal = document.getElementById('hexadecimal').checked;
    const caracteresEspeciales = document.getElementById('caracteres-especiales').value;

    if (!nombre || !longitud || longitud < 6) {
        alert("Por favor, introduce un nombre y una longitud válida (mínimo 6 caracteres).");
        return;
    }

    let caracteres = '';
    if (hexadecimal) {
        // Usar caracteres hexadecimales (0-9, A-F, a-f) y caracteres especiales
        caracteres += '0123456789ABCDEFabcdef';
        if (caracteresEspeciales) caracteres += caracteresEspeciales; // Agregar caracteres especiales
    } else {
        // Usar los caracteres seleccionados
        if (mayusculas) caracteres += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (minusculas) caracteres += 'abcdefghijklmnopqrstuvwxyz';
        if (numeros) caracteres += '0123456789';
        if (caracteresEspeciales) caracteres += caracteresEspeciales; // Caracteres especiales personalizados
    }

    if (!caracteres) {
        alert("Debes seleccionar al menos un tipo de caracteres.");
        return;
    }

    let contraseña = '';
    for (let i = 0; i < longitud; i++) {
        contraseña += caracteres[Math.floor(Math.random() * caracteres.length)];
    }

    contraseñasGuardadas[nombre] = contraseña;
    document.getElementById('contraseña-generada').textContent = `Contraseña generada: ${contraseña}`;
    document.getElementById('contraseña-generada').style.display = 'block';
}

function mostrarContraseñas() {
    const lista = document.getElementById('lista-contraseñas');
    lista.innerHTML = '';
    for (const [nombre, contraseña] of Object.entries(contraseñasGuardadas)) {
        const item = document.createElement('li');
        item.textContent = `${nombre}: ${contraseña}`;
        lista.appendChild(item);
    }
    document.getElementById('contraseñas-guardadas').style.display = 'block';
}

function guardarEnArchivo() {
    let nombreArchivo = prompt("Introduce un nombre para el archivo (o presiona 'Cancelar' para usar el nombre predeterminado):");

    // Si el usuario omite o cancela, usamos un nombre predeterminado
    if (nombreArchivo === null || nombreArchivo.trim() === "") {
        nombreArchivo = "contraseñas";
    }

    // Aseguramos que el archivo tenga la extensión .txt
    if (!nombreArchivo.endsWith(".txt")) {
        nombreArchivo += ".txt";
    }

    let contenido = "Contraseñas guardadas:\n\n";
    for (const [nombre, contraseña] of Object.entries(contraseñasGuardadas)) {
        contenido += `${nombre}: ${contraseña}\n\n`; // Agregamos una línea en blanco después de cada contraseña
    }

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url);

    alert(`Contraseñas guardadas en '${nombreArchivo}'.`);
}

function eliminarContraseña() {
    const nombre = document.getElementById('nombre-eliminar').value;
    if (contraseñasGuardadas[nombre]) {
        delete contraseñasGuardadas[nombre];
        alert(`Contraseña '${nombre}' eliminada.`);
    } else {
        alert(`No se encontró ninguna contraseña con el nombre '${nombre}'.`);
    }
}

function eliminarTodo() {
    if (confirm("¿Estás seguro de que quieres eliminar todas las contraseñas?")) {
        contraseñasGuardadas = {};
        alert("Todas las contraseñas han sido eliminadas.");
    }
}

// Evento para manejar el cambio en la opción de Hexadecimal
document.getElementById('hexadecimal').addEventListener('change', toggleOpciones);
document.getElementById('hexadecimal').addEventListener('change', function() {
    const opcionesCaracteres = document.querySelector('.opciones-caracteres');
    if (this.checked) {
        opcionesCaracteres.classList.add('hexadecimal-activo');
    } else {
        opcionesCaracteres.classList.remove('hexadecimal-activo');
    }
});