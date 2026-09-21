// ======================================================
// FIREBASE
// ======================================================

import {
    auth,
    db
} from "./firebase-config.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// ======================================================
// ELEMENTOS DEL MENÚ
// ======================================================

const menuInvitado =
    document.getElementById("menuInvitado");

const menuUsuario =
    document.getElementById("menuUsuario");

const botonCuenta =
    document.getElementById("botonCuenta");

const dropdownCuenta =
    document.getElementById("dropdownCuenta");

const nombreUsuario =
    document.getElementById("nombreUsuario");

const opcionAdmin =
    document.getElementById("opcionAdmin");

const cerrarSesion =
    document.getElementById("cerrarSesion");


// ======================================================
// DETECTAR ESTADO DE AUTENTICACIÓN
// ======================================================

onAuthStateChanged(
    auth,
    async function (usuario) {

        // ==================================================
        // USUARIO AUTENTICADO Y CORREO VERIFICADO
        // ==================================================

        if (
            usuario &&
            usuario.emailVerified
        ) {

            // Ocultar Iniciar sesión / Registrarse

            menuInvitado.classList.add(
                "oculto"
            );


            // Mostrar menú del usuario

            menuUsuario.classList.remove(
                "oculto"
            );


            // Por seguridad, ocultamos Admin
            // mientras consultamos Firestore

            opcionAdmin.classList.add(
                "oculto"
            );


            try {

                // IMPORTANTE:
                // La colección oficial es "usuarios"
                // TODO EN MINÚSCULAS.

                const referenciaUsuario =
                    doc(
                        db,
                        "usuarios",
                        usuario.uid
                    );


                const documentoUsuario =
                    await getDoc(
                        referenciaUsuario
                    );


                // ==================================================
                // PERFIL ENCONTRADO
                // ==================================================

                if (documentoUsuario.exists()) {

                    const datos =
                        documentoUsuario.data();


                    console.log(
                        "Perfil encontrado:",
                        datos
                    );


                    // ----------------------------------------------
                    // MOSTRAR NOMBRE
                    // ----------------------------------------------

                    if (
                        datos.nombre &&
                        datos.nombre.trim() !== ""
                    ) {

                        nombreUsuario.textContent =
                            datos.nombre;

                    } else {

                        nombreUsuario.textContent =
                            "Mi cuenta";

                    }


                    // ----------------------------------------------
                    // COMPROBAR ROL
                    // ----------------------------------------------

                    const rol =
                        String(
                            datos.rol || ""
                        )
                        .trim()
                        .toLowerCase();


                    console.log(
                        "Rol detectado:",
                        rol
                    );


                    // ----------------------------------------------
                    // ADMINISTRADOR
                    // ----------------------------------------------

                    if (rol === "admin") {

                        opcionAdmin.classList.remove(
                            "oculto"
                        );


                        console.log(
                            "Usuario administrador"
                        );

                    }

                    // ----------------------------------------------
                    // USUARIO NORMAL
                    // ----------------------------------------------

                    else {

                        opcionAdmin.classList.add(
                            "oculto"
                        );


                        console.log(
                            "Usuario normal"
                        );

                    }

                }

                // ==================================================
                // NO EXISTE PERFIL EN FIRESTORE
                // ==================================================

                else {

                    console.warn(
                        "No existe un documento para este usuario en Firestore."
                    );


                    nombreUsuario.textContent =
                        usuario.email.split("@")[0];


                    opcionAdmin.classList.add(
                        "oculto"
                    );

                }

            } catch (error) {

                console.error(
                    "Error obteniendo el perfil de Firestore:",
                    error
                );


                nombreUsuario.textContent =
                    "Mi cuenta";


                opcionAdmin.classList.add(
                    "oculto"
                );

            }

        }

        // ==================================================
        // NO HAY SESIÓN
        // ==================================================

        else {

            menuInvitado.classList.remove(
                "oculto"
            );


            menuUsuario.classList.add(
                "oculto"
            );


            opcionAdmin.classList.add(
                "oculto"
            );


            dropdownCuenta.classList.add(
                "oculto"
            );

        }

    }
);


// ======================================================
// ABRIR / CERRAR MENÚ DE CUENTA
// ======================================================

botonCuenta.addEventListener(
    "click",
    function (evento) {

        evento.stopPropagation();


        dropdownCuenta.classList.toggle(
            "oculto"
        );

    }
);


// ======================================================
// EVITAR QUE CLIC DENTRO DEL MENÚ LO CIERRE
// ======================================================

dropdownCuenta.addEventListener(
    "click",
    function (evento) {

        evento.stopPropagation();

    }
);


// ======================================================
// CERRAR MENÚ AL HACER CLIC AFUERA
// ======================================================

document.addEventListener(
    "click",
    function () {

        dropdownCuenta.classList.add(
            "oculto"
        );

    }
);


// ======================================================
// CERRAR SESIÓN
// ======================================================

cerrarSesion.addEventListener(
    "click",
    async function () {

        try {

            await signOut(auth);


            window.location.href =
                "index.html";

        } catch (error) {

            console.error(
                "Error cerrando sesión:",
                error
            );

        }

    }
);