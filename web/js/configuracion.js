import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


/* =====================================================
   ELEMENTOS DEL FORMULARIO
===================================================== */

const formConfiguracion =
    document.getElementById(
        "formConfiguracion"
    );

const correo =
    document.getElementById(
        "correo"
    );

const nombre =
    document.getElementById(
        "nombre"
    );

const apellido =
    document.getElementById(
        "apellido"
    );

const fechaNacimiento =
    document.getElementById(
        "fechaNacimiento"
    );

const genero =
    document.getElementById(
        "genero"
    );

const celular =
    document.getElementById(
        "celular"
    );

const paisResidencia =
    document.getElementById(
        "paisResidencia"
    );

const listaProgramas =
    document.getElementById(
        "listaProgramas"
    );

const nuevoPrograma =
    document.getElementById(
        "nuevoPrograma"
    );

const btnAgregarPrograma =
    document.getElementById(
        "btnAgregarPrograma"
    );

const btnCancelar =
    document.getElementById(
        "btnCancelar"
    );

const btnGuardarCambios =
    document.getElementById(
        "btnGuardarCambios"
    );

const mensajeConfiguracion =
    document.getElementById(
        "mensajeConfiguracion"
    );


/* =====================================================
   VARIABLES
===================================================== */

let usuarioActual = null;

let programasSeleccionados = [];


/* =====================================================
   COMPROBAR SESIÓN
===================================================== */

onAuthStateChanged(
    auth,

    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        usuarioActual = user;


        correo.value =
            user.email || "";


        await cargarDatosUsuario(
            user.uid
        );

    }
);


/* =====================================================
   CARGAR DATOS DEL USUARIO
===================================================== */

async function cargarDatosUsuario(uid) {

    try {

        mensajeConfiguracion.textContent =
            "Cargando información...";


        mensajeConfiguracion.classList.remove(
            "mensaje-error",
            "mensaje-exito"
        );


        const referenciaUsuario =
            doc(
                db,
                "usuarios",
                uid
            );


        const documentoUsuario =
            await getDoc(
                referenciaUsuario
            );


        if (!documentoUsuario.exists()) {

            mensajeConfiguracion.textContent =
                "No se encontró información del usuario.";


            mensajeConfiguracion.classList.add(
                "mensaje-error"
            );


            return;
        }


        const datos =
            documentoUsuario.data();


        console.log(
            "Datos de configuración:",
            datos
        );


        /* =========================================
           INFORMACIÓN PERSONAL
        ========================================= */

        nombre.value =
            datos.nombre || "";


        apellido.value =
            datos.apellido || "";


        fechaNacimiento.value =
            datos.fechaNacimiento || "";


        genero.value =
            datos.genero || "";


        /* =========================================
           CAMPOS CON MAYÚSCULA EN FIRESTORE
        ========================================= */

        celular.value =
            datos.Celular ??
            datos.celular ??
            "";


        paisResidencia.value =
            datos.PaisResidencia ??
            datos.paisResidencia ??
            "";


        /* =========================================
           PROGRAMAS
        ========================================= */

        const programas =
            datos.ProgramasEgreso ??
            datos.programasEgreso ??
            [];


        if (Array.isArray(programas)) {

            programasSeleccionados =
                programas
                    .map(
                        programa =>
                            String(programa).trim()
                    )
                    .filter(
                        programa =>
                            programa !== ""
                    );

        } else if (
            typeof programas === "string" &&
            programas.trim() !== ""
        ) {

            programasSeleccionados = [
                programas.trim()
            ];

        } else {

            programasSeleccionados = [];

        }


        mostrarProgramas();


        mensajeConfiguracion.textContent =
            "";

    } catch (error) {

        console.error(
            "Error cargando configuración:",
            error
        );


        mensajeConfiguracion.textContent =
            "No fue posible cargar la información.";


        mensajeConfiguracion.classList.add(
            "mensaje-error"
        );

    }

}


/* =====================================================
   MOSTRAR PROGRAMAS
===================================================== */

function mostrarProgramas() {

    listaProgramas.innerHTML = "";


    if (
        programasSeleccionados.length === 0
    ) {

        const mensaje =
            document.createElement(
                "span"
            );


        mensaje.className =
            "programa-configuracion-vacio";


        mensaje.textContent =
            "No hay programas registrados.";


        listaProgramas.appendChild(
            mensaje
        );


        return;
    }


    programasSeleccionados.forEach(
        (programa, indice) => {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "programa-configuracion";


            const nombrePrograma =
                document.createElement(
                    "span"
                );


            nombrePrograma.textContent =
                programa;


            const botonEliminar =
                document.createElement(
                    "button"
                );


            botonEliminar.type =
                "button";


            botonEliminar.className =
                "btn-quitar-programa";


            botonEliminar.textContent =
                "×";


            botonEliminar.title =
                "Eliminar programa";


            botonEliminar.addEventListener(
                "click",

                () => {

                    eliminarPrograma(
                        indice
                    );

                }
            );


            elemento.appendChild(
                nombrePrograma
            );


            elemento.appendChild(
                botonEliminar
            );


            listaProgramas.appendChild(
                elemento
            );

        }
    );

}


/* =====================================================
   AGREGAR PROGRAMA
===================================================== */

btnAgregarPrograma.addEventListener(
    "click",

    () => {

        const programa =
            nuevoPrograma.value.trim();


        if (programa === "") {

            return;
        }


        const yaExiste =
            programasSeleccionados.some(
                programaActual =>
                    programaActual
                        .toLowerCase() ===
                    programa
                        .toLowerCase()
            );


        if (yaExiste) {

            mensajeConfiguracion.textContent =
                "Ese programa ya está registrado.";


            mensajeConfiguracion.classList.add(
                "mensaje-error"
            );


            return;
        }


        programasSeleccionados.push(
            programa
        );


        nuevoPrograma.value = "";


        mensajeConfiguracion.textContent =
            "";


        mensajeConfiguracion.classList.remove(
            "mensaje-error"
        );


        mostrarProgramas();

    }
);


/* =====================================================
   ENTER PARA AGREGAR PROGRAMA
===================================================== */

nuevoPrograma.addEventListener(
    "keydown",

    (evento) => {

        if (evento.key === "Enter") {

            evento.preventDefault();


            btnAgregarPrograma.click();

        }

    }
);


/* =====================================================
   ELIMINAR PROGRAMA
===================================================== */

function eliminarPrograma(indice) {

    programasSeleccionados.splice(
        indice,
        1
    );


    mostrarProgramas();

}


/* =====================================================
   GUARDAR CAMBIOS
===================================================== */

formConfiguracion.addEventListener(
    "submit",

    async (evento) => {

        evento.preventDefault();


        if (!usuarioActual) {

            return;
        }


        const nombreValor =
            nombre.value.trim();

        const apellidoValor =
            apellido.value.trim();

        const celularValor =
            celular.value.trim();

        const paisValor =
            paisResidencia.value.trim();


        /* =========================================
           VALIDACIONES
        ========================================= */

        if (
            nombreValor === "" ||
            apellidoValor === ""
        ) {

            mostrarError(
                "El nombre y los apellidos son obligatorios."
            );

            return;
        }


        if (
            programasSeleccionados.length === 0
        ) {

            mostrarError(
                "Debe existir al menos un programa de egreso."
            );

            return;
        }


        /* =========================================
           GUARDANDO
        ========================================= */

        try {

            btnGuardarCambios.disabled =
                true;


            btnGuardarCambios.textContent =
                "Guardando...";


            mensajeConfiguracion.textContent =
                "Guardando cambios...";


            mensajeConfiguracion.classList.remove(
                "mensaje-error",
                "mensaje-exito"
            );


            const referenciaUsuario =
                doc(
                    db,
                    "usuarios",
                    usuarioActual.uid
                );


            await updateDoc(
                referenciaUsuario,

                {
                    nombre:
                        nombreValor,

                    apellido:
                        apellidoValor,

                    fechaNacimiento:
                        fechaNacimiento.value,

                    genero:
                        genero.value,

                    /*
                       Conservamos exactamente
                       los nombres actuales
                       de Firestore.
                    */

                    Celular:
                        celularValor,

                    PaisResidencia:
                        paisValor,

                    ProgramasEgreso:
                        programasSeleccionados
                }
            );


            mensajeConfiguracion.textContent =
                "Los cambios se guardaron correctamente.";


            mensajeConfiguracion.classList.add(
                "mensaje-exito"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "cuenta.html";

                },
                1200
            );

        } catch (error) {

            console.error(
                "Error guardando cambios:",
                error
            );


            mostrarError(
                "No fue posible guardar los cambios."
            );

        } finally {

            btnGuardarCambios.disabled =
                false;


            btnGuardarCambios.textContent =
                "Guardar cambios";

        }

    }
);


/* =====================================================
   CANCELAR
===================================================== */

btnCancelar.addEventListener(
    "click",

    () => {

        window.location.href =
            "cuenta.html";

    }
);


/* =====================================================
   MOSTRAR ERROR
===================================================== */

function mostrarError(mensaje) {

    mensajeConfiguracion.textContent =
        mensaje;


    mensajeConfiguracion.classList.remove(
        "mensaje-exito"
    );


    mensajeConfiguracion.classList.add(
        "mensaje-error"
    );

}