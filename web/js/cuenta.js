import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


/* =====================================================
   ELEMENTOS DEL PERFIL
===================================================== */

const nombreCompleto =
    document.getElementById(
        "nombreCompleto"
    );


const correoUsuario =
    document.getElementById(
        "correoUsuario"
    );


const perfilNombre =
    document.getElementById(
        "perfilNombre"
    );


const perfilApellido =
    document.getElementById(
        "perfilApellido"
    );


const perfilNacimiento =
    document.getElementById(
        "perfilNacimiento"
    );


const perfilCelular =
    document.getElementById(
        "perfilCelular"
    );


const perfilPaisResidencia =
    document.getElementById(
        "perfilPaisResidencia"
    );


const perfilRegistro =
    document.getElementById(
        "perfilRegistro"
    );


const perfilProgramasEgreso =
    document.getElementById(
        "perfilProgramasEgreso"
    );


const perfilEstadoAfiliacion =
    document.getElementById(
        "perfilEstadoAfiliacion"
    );


const perfilVinculacion =
    document.getElementById(
        "perfilVinculacion"
    );


const perfilRenovacion =
    document.getElementById(
        "perfilRenovacion"
    );


const fotoPerfil =
    document.getElementById(
        "fotoPerfil"
    );


const fotoDefault =
    document.getElementById(
        "fotoDefault"
    );


const mensajeCuenta =
    document.getElementById(
        "mensajeCuenta"
    );


const btnRealizarCambios =
    document.getElementById(
        "btnRealizarCambios"
    );


const seccionCertificacion =
    document.getElementById(
        "seccionCertificacion"
    );


const btnSolicitarCertificacion =
    document.getElementById(
        "btnSolicitarCertificacion"
    );


/* =====================================================
   COMPROBAR ESTADO DE AUTENTICACIÓN
===================================================== */

onAuthStateChanged(
    auth,

    async (user) => {


        /* =============================================
           USUARIO NO AUTENTICADO
        ============================================= */

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        /* =============================================
           CORREO
        ============================================= */

        correoUsuario.textContent =
            user.email ||
            "Correo no disponible";


        try {


            /* =========================================
               BUSCAR USUARIO EN FIRESTORE
            ========================================= */

            const referenciaUsuario =
                doc(
                    db,
                    "usuarios",
                    user.uid
                );


            const documentoUsuario =
                await getDoc(
                    referenciaUsuario
                );


            /* =========================================
               DOCUMENTO NO EXISTE
            ========================================= */

            if (!documentoUsuario.exists()) {

                console.warn(
                    "No existe información en Firestore para:",
                    user.uid
                );


                nombreCompleto.textContent =
                    user.displayName ||
                    "Usuario";


                perfilNombre.textContent =
                    user.displayName ||
                    "-";


                perfilApellido.textContent =
                    "-";


                perfilNacimiento.textContent =
                    "No registrada";


                perfilCelular.textContent =
                    "No registrado";


                perfilPaisResidencia.textContent =
                    "No registrado";


                perfilRegistro.textContent =
                    "No registrada";


                mostrarProgramasEgreso(
                    []
                );


                perfilEstadoAfiliacion.textContent =
                    "NO REGISTRADA";


                perfilVinculacion.textContent =
                    "No registrada";


                perfilRenovacion.textContent =
                    "No registrada";


                mensajeCuenta.textContent =
                    "No se encontró información adicional del perfil.";


                mensajeCuenta.classList.add(
                    "mensaje-error"
                );


                return;
            }


            /* =========================================
               OBTENER DATOS
            ========================================= */

            const datos =
                documentoUsuario.data();


            console.log(
                "Datos del perfil:",
                datos
            );


            /* =========================================
               NOMBRE Y APELLIDO
            ========================================= */

            const nombre =
                datos.nombre || "";


            const apellido =
                datos.apellido || "";


            const nombreUsuario =
                `${nombre} ${apellido}`.trim();


            nombreCompleto.textContent =
                nombreUsuario ||
                user.displayName ||
                "Usuario";


            perfilNombre.textContent =
                nombre ||
                "-";


            perfilApellido.textContent =
                apellido ||
                "-";


            /* =========================================
               FECHA DE NACIMIENTO
            ========================================= */

            perfilNacimiento.textContent =
                formatearFecha(
                    datos.fechaNacimiento
                );


            /* =========================================
               CELULAR
            ========================================= */

            perfilCelular.textContent =
                datos.Celular ??
                datos.celular ??
                "No registrado";


            /* =========================================
               PAÍS DE RESIDENCIA
            ========================================= */

            perfilPaisResidencia.textContent =
                datos.PaisResidencia ??
                datos.paisResidencia ??
                "No registrado";


            /* =========================================
               FECHA DE REGISTRO
            ========================================= */

            perfilRegistro.textContent =
                formatearFecha(
                    datos.creadoEn
                );


            /* =========================================
               PROGRAMAS DE EGRESO
            ========================================= */

            const programasEgreso =

                datos.ProgramasEgreso ??

                datos.programasEgreso ??

                datos.ProgramaEgreso ??

                datos.programaEgreso ??

                [];


            mostrarProgramasEgreso(
                programasEgreso
            );


            /* =========================================
               AFILIACIÓN
            ========================================= */

            const afiliado =

                datos.Afiliado === true ||

                datos.afiliado === true;


            const estadoAfiliacion =

                (
                    datos.estadoAfiliacion ||
                    "PENDIENTE"
                )

                .toString()

                .trim()

                .toUpperCase();


            perfilEstadoAfiliacion.textContent =
                estadoAfiliacion;


            /* =========================================
               ESTILO DEL ESTADO
            ========================================= */

            perfilEstadoAfiliacion.classList.remove(

                "afiliacion-activa",

                "afiliacion-inactiva",

                "afiliacion-pendiente"

            );


            if (

                afiliado &&

                estadoAfiliacion === "ACTIVA"

            ) {

                perfilEstadoAfiliacion.classList.add(
                    "afiliacion-activa"
                );

            }


            else if (

                estadoAfiliacion === "INACTIVA"

            ) {

                perfilEstadoAfiliacion.classList.add(
                    "afiliacion-inactiva"
                );

            }


            else {

                perfilEstadoAfiliacion.classList.add(
                    "afiliacion-pendiente"
                );

            }


            /* =========================================
               FECHA DE VINCULACIÓN
            ========================================= */

            perfilVinculacion.textContent =
                formatearFecha(
                    datos.fechaVinculacion
                );


            /* =========================================
               FECHA DE RENOVACIÓN
            ========================================= */

            perfilRenovacion.textContent =
                formatearFecha(
                    datos.fechaRenovacion
                );


            /* =========================================
               CERTIFICACIÓN
            ========================================= */

            if (

                afiliado &&

                estadoAfiliacion === "ACTIVA"

            ) {

                seccionCertificacion.classList.remove(
                    "oculto"
                );

            }

            else {

                seccionCertificacion.classList.add(
                    "oculto"
                );

            }


            /* =========================================
               FOTO DE PERFIL
            ========================================= */

            const urlFoto =

                datos.fotoPerfil ||

                datos.fotoURL ||

                user.photoURL;


            if (urlFoto) {

                fotoPerfil.src =
                    urlFoto;


                fotoPerfil.classList.remove(
                    "oculto"
                );


                fotoDefault.classList.add(
                    "oculto"
                );

            }

            else {

                fotoPerfil.classList.add(
                    "oculto"
                );


                fotoDefault.classList.remove(
                    "oculto"
                );

            }


            /* =========================================
               LIMPIAR MENSAJES
            ========================================= */

            mensajeCuenta.textContent =
                "";


            mensajeCuenta.classList.remove(
                "mensaje-error"
            );

        }

        catch (error) {

            console.error(
                "Error cargando información del usuario:",
                error
            );


            nombreCompleto.textContent =
                "Error al cargar el perfil";


            mensajeCuenta.textContent =
                "No fue posible cargar la información de la cuenta.";


            mensajeCuenta.classList.add(
                "mensaje-error"
            );

        }

    }
);


/* =====================================================
   MOSTRAR PROGRAMAS DE EGRESO
===================================================== */

function mostrarProgramasEgreso(programas) {


    if (!perfilProgramasEgreso) {

        return;

    }


    /* LIMPIAR CONTENIDO */

    perfilProgramasEgreso.innerHTML =
        "";


    let listaProgramas =
        [];


    /* =============================================
       ARRAY DE FIRESTORE
    ============================================= */

    if (Array.isArray(programas)) {

        listaProgramas =

            programas

                .map(

                    programa =>

                        String(
                            programa
                        ).trim()

                )

                .filter(

                    programa =>

                        programa !== ""

                );

    }


    /* =============================================
       COMPATIBILIDAD CON STRING
    ============================================= */

    else if (

        typeof programas === "string" &&

        programas.trim() !== ""

    ) {

        listaProgramas = [

            programas.trim()

        ];

    }


    /* =============================================
       SIN PROGRAMAS
    ============================================= */

    if (
        listaProgramas.length === 0
    ) {

        const vacio =
            document.createElement(
                "span"
            );


        vacio.className =
            "programa-vacio";


        vacio.textContent =
            "No registrado";


        perfilProgramasEgreso.appendChild(
            vacio
        );


        return;

    }


    /* =============================================
       SOLO UN PROGRAMA
    ============================================= */

    if (
        listaProgramas.length === 1
    ) {

        const programa =
            document.createElement(
                "span"
            );


        programa.className =
            "programa-unico";


        programa.textContent =
            listaProgramas[0];


        perfilProgramasEgreso.appendChild(
            programa
        );


        return;

    }


    /* =============================================
       VARIOS PROGRAMAS
    ============================================= */

    const desplegable =
        document.createElement(
            "details"
        );


    desplegable.className =
        "programas-desplegable";


    /* =============================================
       CABECERA DEL DESPLEGABLE
    ============================================= */

    const resumen =
        document.createElement(
            "summary"
        );


    resumen.className =
        "programas-resumen";


    resumen.textContent =
        `Ver programas de egreso (${listaProgramas.length})`;


    /* =============================================
       LISTA
    ============================================= */

    const lista =
        document.createElement(
            "ul"
        );


    lista.className =
        "programas-lista";


    for (
        const programa
        of listaProgramas
    ) {

        const elemento =
            document.createElement(
                "li"
            );


        elemento.textContent =
            programa;


        lista.appendChild(
            elemento
        );

    }


    /* =============================================
       ARMAR DESPLEGABLE
    ============================================= */

    desplegable.appendChild(
        resumen
    );


    desplegable.appendChild(
        lista
    );


    perfilProgramasEgreso.appendChild(
        desplegable
    );

}


/* =====================================================
   BOTÓN REALIZAR CAMBIOS
===================================================== */

if (btnRealizarCambios) {

    btnRealizarCambios.addEventListener(

        "click",

        () => {

            window.location.href =
                "configuracion.html";

        }

    );

}


/* =====================================================
   SOLICITAR CERTIFICACIÓN
===================================================== */

if (btnSolicitarCertificacion) {

    btnSolicitarCertificacion.addEventListener(

        "click",

        () => {

            alert(

                "Solicitud de certificación iniciada.\n\n" +

                "En el siguiente paso enviaremos un código " +

                "temporal de verificación al correo " +

                "electrónico registrado en tu cuenta."

            );

        }

    );

}


/* =====================================================
   FORMATEAR FECHAS
===================================================== */

function formatearFecha(fecha) {


    if (!fecha) {

        return "No registrada";

    }


    /* =============================================
       TIMESTAMP DE FIRESTORE
    ============================================= */

    if (

        typeof fecha === "object" &&

        typeof fecha.toDate === "function"

    ) {

        const fechaJS =
            fecha.toDate();


        return fechaJS.toLocaleDateString(

            "es-CO",

            {

                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric"

            }

        );

    }


    /* =============================================
       STRING YYYY-MM-DD
    ============================================= */

    if (

        typeof fecha === "string" &&

        /^\d{4}-\d{2}-\d{2}$/.test(
            fecha
        )

    ) {

        const [

            año,

            mes,

            dia

        ] =
            fecha.split("-");


        return `${dia}/${mes}/${año}`;

    }


    /* =============================================
       CUALQUIER OTRO FORMATO
    ============================================= */

    return String(
        fecha
    );

}