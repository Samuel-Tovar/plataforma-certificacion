// ======================================================
// FIREBASE
// ======================================================

import { auth } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


// ======================================================
// ELEMENTOS DEL FORMULARIO
// ======================================================

const formulario = document.getElementById("formRegistro");

const password = document.getElementById("password");

const confirmarPassword =
    document.getElementById("confirmarPassword");

const correo = document.getElementById("correo");

const tipoPersona = document.getElementById("tipoPersona");

const campoGenero = document.getElementById("campoGenero");

const mensaje = document.getElementById("mensajeRegistro");

const consentimiento =
    document.getElementById("consentimiento");


// ======================================================
// REQUISITOS DE CONTRASEÑA
// ======================================================

const reqLongitud =
    document.getElementById("reqLongitud");

const reqMayuscula =
    document.getElementById("reqMayuscula");

const reqNumero =
    document.getElementById("reqNumero");

const reqASCII =
    document.getElementById("reqASCII");


// ======================================================
// EVENTOS
// ======================================================

password.addEventListener(
    "input",
    validarPassword
);


tipoPersona.addEventListener(
    "change",
    function () {

        if (tipoPersona.value === "natural") {

            campoGenero.style.display = "block";

        } else {

            campoGenero.style.display = "none";

        }

    }
);


// ======================================================
// VALIDACIÓN DE CONTRASEÑA
// ======================================================

function validarPassword() {

    const valor = password.value;


    const longitudValida =
        valor.length >= 8;


    const tieneMayuscula =
        /[A-Z]/.test(valor);


    const tieneLetra =
        /[A-Za-z]/.test(valor);


    const tieneNumero =
        /[0-9]/.test(valor);


    const soloASCII =
        /^[\x20-\x7E]+$/.test(valor);


    actualizarRequisito(
        reqLongitud,
        longitudValida
    );


    actualizarRequisito(
        reqMayuscula,
        tieneMayuscula
    );


    actualizarRequisito(
        reqNumero,
        tieneLetra && tieneNumero
    );


    actualizarRequisito(
        reqASCII,
        soloASCII
    );


    return (
        longitudValida &&
        tieneMayuscula &&
        tieneLetra &&
        tieneNumero &&
        soloASCII
    );

}


// ======================================================
// ACTUALIZAR REQUISITOS VISUALES
// ======================================================

function actualizarRequisito(
    elemento,
    valido
) {

    if (valido) {

        elemento.classList.add(
            "requisito-valido"
        );

    } else {

        elemento.classList.remove(
            "requisito-valido"
        );

    }

}


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
// ENVÍO DEL FORMULARIO
// ======================================================

formulario.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();


        // ----------------------------------------------
        // Validar contraseña
        // ----------------------------------------------

        if (!validarPassword()) {

            mostrarError(
                "La contraseña no cumple todos los requisitos."
            );

            return;
        }


        // ----------------------------------------------
        // Confirmación de contraseña
        // ----------------------------------------------

        if (
            confirmarPassword &&
            password.value !== confirmarPassword.value
        ) {

            mostrarError(
                "Las contraseñas no coinciden."
            );

            return;
        }


        // ----------------------------------------------
        // Validar consentimiento
        // ----------------------------------------------

        if (!consentimiento.checked) {

            mostrarError(
                "Debes aceptar la autorización para continuar."
            );

            return;
        }


        // ----------------------------------------------
        // Validar correo
        // ----------------------------------------------

        const correoUsuario =
            correo.value.trim();


        if (correoUsuario === "") {

            mostrarError(
                "Debes ingresar un correo electrónico."
            );

            return;
        }


        // ----------------------------------------------
        // Crear cuenta Firebase
        // ----------------------------------------------

        try {

            mostrarExito(
                "Creando cuenta..."
            );


            const credencial =
                await createUserWithEmailAndPassword(
                    auth,
                    correoUsuario,
                    password.value
                );


            const usuario =
                credencial.user;


            // ------------------------------------------
            // Enviar correo de verificación
            // ------------------------------------------

            await sendEmailVerification(
                usuario
            );


            // ------------------------------------------
            // Cerramos sesión inmediatamente
            // ------------------------------------------
            // Así el usuario no queda autenticado
            // antes de confirmar su correo.
            // ------------------------------------------

            await signOut(auth);


            // ------------------------------------------
            // Mensaje final
            // ------------------------------------------

            mostrarExito(
                "✓ Registro realizado correctamente. " +
                "Hemos enviado un correo de verificación a " +
                correoUsuario +
                ". Revisa tu bandeja de entrada y haz clic " +
                "en el enlace para activar tu cuenta."
            );


            // ------------------------------------------
            // Limpiar formulario
            // ------------------------------------------

            formulario.reset();

            campoGenero.style.display =
                "none";


            actualizarRequisito(
                reqLongitud,
                false
            );

            actualizarRequisito(
                reqMayuscula,
                false
            );

            actualizarRequisito(
                reqNumero,
                false
            );

            actualizarRequisito(
                reqASCII,
                false
            );


        } catch (error) {

            console.error(
                "Error al registrar:",
                error
            );


            // ------------------------------------------
            // Errores Firebase
            // ------------------------------------------

            switch (error.code) {

                case "auth/email-already-in-use":

                    mostrarError(
                        "Este correo electrónico ya está registrado."
                    );

                    break;


                case "auth/invalid-email":

                    mostrarError(
                        "El correo electrónico ingresado no es válido."
                    );

                    break;


                case "auth/weak-password":

                    mostrarError(
                        "La contraseña es demasiado débil."
                    );

                    break;


                case "auth/network-request-failed":

                    mostrarError(
                        "No fue posible conectarse con el servidor. " +
                        "Verifica tu conexión a Internet."
                    );

                    break;


                case "auth/too-many-requests":

                    mostrarError(
                        "Se realizaron demasiados intentos. " +
                        "Inténtalo nuevamente más tarde."
                    );

                    break;


                default:

                    mostrarError(
                        "Ocurrió un error al crear la cuenta."
                    );

                    break;

            }

        }

    }
);