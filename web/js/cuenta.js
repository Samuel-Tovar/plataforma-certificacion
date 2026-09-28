import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


/* =====================================================
   ELEMENTOS DE LA PÁGINA
===================================================== */

const nombreCompleto =
    document.getElementById("nombreCompleto");

const correoUsuario =
    document.getElementById("correoUsuario");

const perfilNombre =
    document.getElementById("perfilNombre");

const perfilApellido =
    document.getElementById("perfilApellido");

const perfilNacimiento =
    document.getElementById("perfilNacimiento");

const perfilVinculacion =
    document.getElementById("perfilVinculacion");

const perfilRenovacion =
    document.getElementById("perfilRenovacion");

const fotoPerfil =
    document.getElementById("fotoPerfil");

const fotoDefault =
    document.getElementById("fotoDefault");

const mensajeCuenta =
    document.getElementById("mensajeCuenta");

const btnRealizarCambios =
    document.getElementById("btnRealizarCambios");


/* =====================================================
   COMPROBAR SESIÓN
===================================================== */

onAuthStateChanged(
    auth,
    async (user) => {

        /* -----------------------------------------
           NO HAY USUARIO AUTENTICADO
        ----------------------------------------- */

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        /* -----------------------------------------
           CORREO DE FIREBASE AUTH
        ----------------------------------------- */

        correoUsuario.textContent =
            user.email || "Correo no disponible";


        try {

            /* =====================================
               BUSCAR USUARIO EN FIRESTORE
            ===================================== */

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


            /* =====================================
               DOCUMENTO NO EXISTE
            ===================================== */

            if (!documentoUsuario.exists()) {

                console.warn(
                    "No existe documento del usuario:",
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


            /* =====================================
               DATOS FIRESTORE
            ===================================== */

            const datos =
                documentoUsuario.data();


            console.log(
                "Datos del perfil:",
                datos
            );


            /* =====================================
               NOMBRE
            ===================================== */

            const nombre =
                datos.nombre || "";

            const apellido =
                datos.apellido || "";


            const nombreCompletoUsuario =
                `${nombre} ${apellido}`.trim();


            nombreCompleto.textContent =
                nombreCompletoUsuario ||
                user.displayName ||
                "Usuario";


            perfilNombre.textContent =
                nombre || "-";


            perfilApellido.textContent =
                apellido || "-";


            /* =====================================
               FECHA DE NACIMIENTO
            ===================================== */

            perfilNacimiento.textContent =
                formatearFecha(
                    datos.fechaNacimiento
                );


            /* =====================================
               FECHA DE VINCULACIÓN
            ===================================== */

            perfilVinculacion.textContent =
                formatearFecha(
                    datos.fechaVinculacion
                );


            /* =====================================
               RENOVACIÓN
            ===================================== */

            perfilRenovacion.textContent =
                formatearFecha(
                    datos.renovacionAfiliacion
                );


            /* =====================================
               FOTO DE PERFIL
            ===================================== */

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

            } else {

                fotoPerfil.classList.add(
                    "oculto"
                );

                fotoDefault.classList.remove(
                    "oculto"
                );

            }


            mensajeCuenta.textContent = "";

        } catch (error) {

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
   FORMATEAR FECHAS
===================================================== */

function formatearFecha(fecha) {

    if (!fecha) {
        return "No registrada";
    }


    /* -----------------------------------------
       FIRESTORE TIMESTAMP
    ----------------------------------------- */

    if (
        typeof fecha === "object" &&
        typeof fecha.toDate === "function"
    ) {

        return fecha
            .toDate()
            .toLocaleDateString(
                "es-CO"
            );

    }


    /* -----------------------------------------
       STRING YYYY-MM-DD
    ----------------------------------------- */

    if (
        typeof fecha === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(fecha)
    ) {

        const [
            año,
            mes,
            dia
        ] = fecha.split("-");


        return `${dia}/${mes}/${año}`;
    }


    return String(fecha);
}