// ======================================================
// FIREBASE
// ======================================================

import {
    auth,
    db
} from "./firebase-config.js";


import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// ======================================================
// ELEMENTOS
// ======================================================

const formulario =
    document.getElementById("formRegistro");

const nombre =
    document.getElementById("nombre");

const apellido =
    document.getElementById("apellido");

const correo =
    document.getElementById("correo");

const fechaNacimiento =
    document.getElementById("fechaNacimiento");

const genero =
    document.getElementById("genero");

const password =
    document.getElementById("password");

const confirmarPassword =
    document.getElementById("confirmarPassword");

const consentimiento =
    document.getElementById("consentimiento");

const mensaje =
    document.getElementById("mensajeRegistro");

const btnRegistro =
    document.getElementById("btnRegistro");


// ======================================================
// REQUISITOS CONTRASEÑA
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
// VALIDACIÓN EN TIEMPO REAL
// ======================================================

password.addEventListener(
    "input",
    validarPassword
);


// ======================================================
// VALIDAR CONTRASEÑA
// ======================================================

function validarPassword() {

    const valor =
        password.value;


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
// ACTUALIZAR REQUISITO
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

    mensaje.textContent =
        texto;


    mensaje.className =
        "mensaje-registro mensaje-error";
}


function mostrarExito(texto) {

    mensaje.textContent =
        texto;


    mensaje.className =
        "mensaje-registro mensaje-exito";
}


// ======================================================
// RESTAURAR BOTÓN
// ======================================================

function restaurarBoton() {

    btnRegistro.disabled =
        false;


    btnRegistro.textContent =
        "Registrarme";
}


// ======================================================
// LIMPIAR REQUISITOS
// ======================================================

function limpiarRequisitosPassword() {

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
}


// ======================================================
// REGISTRO
// ======================================================

formulario.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();


        btnRegistro.disabled =
            true;


        btnRegistro.textContent =
            "Registrando...";


        // ==================================================
        // DATOS
        // ==================================================

        const nombreUsuario =
            nombre.value.trim();


        const apellidoUsuario =
            apellido.value.trim();


        const correoUsuario =
            correo.value
                .trim()
                .toLowerCase();


        const fechaUsuario =
            fechaNacimiento.value;


        const generoUsuario =
            genero.value;


        const passwordUsuario =
            password.value;


        const confirmacionUsuario =
            confirmarPassword.value;


        // ==================================================
        // VALIDACIONES
        // ==================================================

        if (
            nombreUsuario === "" ||
            apellidoUsuario === "" ||
            correoUsuario === "" ||
            fechaUsuario === "" ||
            generoUsuario === "" ||
            passwordUsuario === "" ||
            confirmacionUsuario === ""
        ) {

            mostrarError(
                "Debes completar todos los campos."
            );


            restaurarBoton();

            return;
        }


        if (!validarPassword()) {

            mostrarError(
                "La contraseña no cumple todos los requisitos."
            );


            restaurarBoton();

            return;
        }


        if (
            passwordUsuario !==
            confirmacionUsuario
        ) {

            mostrarError(
                "Las contraseñas no coinciden."
            );


            restaurarBoton();

            return;
        }


        if (!consentimiento.checked) {

            mostrarError(
                "Debes aceptar la autorización para continuar."
            );


            restaurarBoton();

            return;
        }


        // ==================================================
        // FIREBASE
        // ==================================================

        try {

            // ----------------------------------------------
            // CREAR CUENTA
            // ----------------------------------------------

            const credencial =
                await createUserWithEmailAndPassword(
                    auth,
                    correoUsuario,
                    passwordUsuario
                );


            const usuario =
                credencial.user;


            // ----------------------------------------------
            // CREAR PERFIL
            // ----------------------------------------------
            //
            // TODOS los usuarios nuevos nacen como
            // "usuario".
            //
            // NUNCA asignamos admin automáticamente.
            // ----------------------------------------------

            await setDoc(
                doc(
                    db,
                    "usuarios",
                    usuario.uid
                ),
                {

                    nombre:
                        nombreUsuario,

                    apellido:
                        apellidoUsuario,

                    correo:
                        correoUsuario,

                    fechaNacimiento:
                        fechaUsuario,

                    genero:
                        generoUsuario,

                    rol:
                        "usuario",

                    creadoEn:
                        serverTimestamp()

                }
            );


            // ----------------------------------------------
            // CORREO DE VERIFICACIÓN
            // ----------------------------------------------

            await sendEmailVerification(
                usuario
            );


            // ----------------------------------------------
            // CERRAR SESIÓN
            // ----------------------------------------------

            await signOut(auth);


            // ----------------------------------------------
            // MENSAJE
            // ----------------------------------------------

            mostrarExito(
                "✓ Registro realizado correctamente. " +
                "Hemos enviado un correo de verificación a " +
                correoUsuario +
                ". Revisa tu bandeja de entrada y activa tu cuenta."
            );


            formulario.reset();


            limpiarRequisitosPassword();

        } catch (error) {

            console.error(
                "Error durante el registro:",
                error
            );


            switch (error.code) {

                case "auth/email-already-in-use":

                    mostrarError(
                        "Este correo electrónico ya está registrado."
                    );

                    break;


                case "auth/invalid-email":

                    mostrarError(
                        "El correo electrónico no es válido."
                    );

                    break;


                case "auth/weak-password":

                    mostrarError(
                        "La contraseña es demasiado débil."
                    );

                    break;


                case "auth/network-request-failed":

                    mostrarError(
                        "No fue posible conectarse con Firebase."
                    );

                    break;


                case "auth/too-many-requests":

                    mostrarError(
                        "Se realizaron demasiados intentos. Inténtalo más tarde."
                    );

                    break;


                default:

                    mostrarError(
                        "Ocurrió un error al crear la cuenta."
                    );

                    break;
            }

        } finally {

            restaurarBoton();

        }

    }
);