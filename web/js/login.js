// ======================================================
// FIREBASE
// ======================================================

import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    signOut,
    reload
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


// ======================================================
// ELEMENTOS
// ======================================================

const formulario = document.getElementById("formLogin");

const correo = document.getElementById("correo");

const password = document.getElementById("password");

const mensaje = document.getElementById("mensajeLogin");


// ======================================================
// MENSAJES
// ======================================================

function mostrarError(texto) {

    mensaje.textContent = texto;

    mensaje.className =
        "mensaje-registro mensaje-error";

}


function mostrarExito(texto) {

    mensaje.textContent = texto;

    mensaje.className =
        "mensaje-registro mensaje-exito";

}


// ======================================================
// INICIAR SESIÓN
// ======================================================

formulario.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();


        const correoUsuario =
            correo.value.trim();

        const passwordUsuario =
            password.value;


        mensaje.textContent = "";


        // ----------------------------------------------
        // Validaciones básicas
        // ----------------------------------------------

        if (
            correoUsuario === "" ||
            passwordUsuario === ""
        ) {

            mostrarError(
                "Debes ingresar tu correo y contraseña."
            );

            return;
        }


        try {

            mostrarExito(
                "Verificando información..."
            );


            // ------------------------------------------
            // Inicio de sesión Firebase
            // ------------------------------------------

            const credencial =
                await signInWithEmailAndPassword(
                    auth,
                    correoUsuario,
                    passwordUsuario
                );


            const usuario =
                credencial.user;


            // ------------------------------------------
            // Actualizar información del usuario
            // ------------------------------------------

            await reload(usuario);


            // ------------------------------------------
            // Verificar correo electrónico
            // ------------------------------------------

            if (!usuario.emailVerified) {

                await signOut(auth);


                mostrarError(
                    "Tu correo electrónico todavía no ha sido verificado. " +
                    "Revisa tu bandeja de entrada y activa tu cuenta antes de ingresar."
                );

                return;
            }


            // ------------------------------------------
            // ACCESO PERMITIDO
            // ------------------------------------------

            mostrarExito(
                "✓ Inicio de sesión correcto."
            );


            // Pequeña espera para mostrar el mensaje
            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                800
            );


        } catch (error) {

            console.error(
                "Error al iniciar sesión:",
                error
            );


            // ------------------------------------------
            // ERRORES FIREBASE
            // ------------------------------------------

            switch (error.code) {

                case "auth/invalid-email":

                    mostrarError(
                        "El correo electrónico no es válido."
                    );

                    break;


                case "auth/invalid-credential":

                    mostrarError(
                        "El correo o la contraseña son incorrectos."
                    );

                    break;


                case "auth/user-disabled":

                    mostrarError(
                        "Esta cuenta ha sido deshabilitada."
                    );

                    break;


                case "auth/too-many-requests":

                    mostrarError(
                        "Se realizaron demasiados intentos. " +
                        "Inténtalo nuevamente más tarde."
                    );

                    break;


                case "auth/network-request-failed":

                    mostrarError(
                        "No fue posible conectarse con el servidor. " +
                        "Verifica tu conexión a Internet."
                    );

                    break;


                default:

                    mostrarError(
                        "No fue posible iniciar sesión."
                    );

                    break;

            }

        }

    }
);