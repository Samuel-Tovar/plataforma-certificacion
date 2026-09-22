import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const authArea = document.getElementById("auth-area");


onAuthStateChanged(auth, async (user) => {

    if (!authArea) {
        console.warn(
            "No se encontró el elemento #auth-area en esta página."
        );

        return;
    }


    // ==========================
    // USUARIO NO AUTENTICADO
    // ==========================

    if (!user) {

        authArea.innerHTML = `
            <a href="login.html" class="btn-login">
                Iniciar sesión
            </a>

            <a href="registro.html" class="btn-registro">
                Registrarse
            </a>
        `;

        return;
    }


    // ==========================
    // USUARIO AUTENTICADO
    // ==========================

    let nombre = user.displayName || "Usuario";

    let rol = "usuario";


    // --------------------------------
    // Intentamos obtener datos Firestore
    // --------------------------------

    try {

        const referenciaUsuario = doc(
            db,
            "usuarios",
            user.uid
        );

        const documentoUsuario = await getDoc(
            referenciaUsuario
        );


        if (documentoUsuario.exists()) {

            const datos = documentoUsuario.data();

            if (datos.nombre) {

                nombre = datos.apellido
                    ? `${datos.nombre} ${datos.apellido}`
                    : datos.nombre;

            }


            if (datos.rol) {

                rol = datos.rol.toLowerCase();

            }

        }

    } catch (error) {

        console.warn(
            "No fue posible consultar el perfil de Firestore:",
            error
        );

    }


    // ============================================
    // RESPALDO TEMPORAL PARA ADMINISTRADORES UTP
    // ============================================
    //
    // Esto sirve para el prototipo.
    // Más adelante el rol debe depender únicamente
    // de Firestore / reglas de seguridad.

    const correo = user.email || "";

    if (
        correo.toLowerCase().endsWith("@utp.edu.co")
    ) {

        rol = "admin";

    }


    const esAdmin =
        rol === "admin" ||
        rol === "administrador";


    // ====================================
    // CREAR MENÚ DEL USUARIO
    // ====================================

    authArea.innerHTML = `

        <div class="menu-cuenta">

            <button
                id="btnCuenta"
                class="btn-cuenta"
                type="button"
            >

                👤 ${nombre}

                <span class="flecha-cuenta">
                    ▼
                </span>

            </button>


            <div
                id="menuCuentaDropdown"
                class="menu-cuenta-dropdown"
            >

                <button
                    type="button"
                    id="opcionMiCuenta"
                    class="opcion-cuenta"
                >
                    Mi cuenta
                </button>


                <button
                    type="button"
                    id="opcionConfiguracion"
                    class="opcion-cuenta"
                >
                    Configuración de la cuenta
                </button>


                ${
                    esAdmin
                    ? `
                        <a
                            href="administrar-publicaciones.html"
                            class="opcion-cuenta opcion-enlace"
                        >
                            Administrar publicaciones
                        </a>
                    `
                    : ""
                }


                <div class="separador-cuenta"></div>


                <button
                    type="button"
                    id="btnCerrarSesion"
                    class="opcion-cuenta cerrar-sesion"
                >
                    Cerrar sesión
                </button>

            </div>

        </div>

    `;


    // ====================================
    // ABRIR / CERRAR DROPDOWN
    // ====================================

    const btnCuenta =
        document.getElementById("btnCuenta");

    const dropdown =
        document.getElementById("menuCuentaDropdown");


    btnCuenta.addEventListener(
        "click",
        (evento) => {

            evento.stopPropagation();

            dropdown.classList.toggle(
                "mostrar"
            );

        }
    );


    // ====================================
    // MI CUENTA
    // ====================================

    const opcionMiCuenta =
        document.getElementById("opcionMiCuenta");


    opcionMiCuenta.addEventListener(
        "click",
        () => {

            dropdown.classList.remove(
                "mostrar"
            );


            window.dispatchEvent(
                new CustomEvent(
                    "abrirMiCuenta",
                    {
                        detail: {
                            user,
                            rol
                        }
                    }
                )
            );

        }
    );


    // ====================================
    // CONFIGURACIÓN
    // ====================================

    const opcionConfiguracion =
        document.getElementById(
            "opcionConfiguracion"
        );


    opcionConfiguracion.addEventListener(
        "click",
        () => {

            dropdown.classList.remove(
                "mostrar"
            );


            window.dispatchEvent(
                new CustomEvent(
                    "abrirConfiguracionCuenta",
                    {
                        detail: {
                            user,
                            rol
                        }
                    }
                )
            );

        }
    );


    // ====================================
    // CERRAR SESIÓN
    // ====================================

    const botonCerrarSesion =
        document.getElementById(
            "btnCerrarSesion"
        );


    botonCerrarSesion.addEventListener(
        "click",
        async () => {

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


});


// ====================================
// CERRAR MENÚ AL HACER CLIC AFUERA
// ====================================

document.addEventListener(
    "click",
    () => {

        const dropdown =
            document.getElementById(
                "menuCuentaDropdown"
            );


        if (dropdown) {

            dropdown.classList.remove(
                "mostrar"
            );

        }

    }
);