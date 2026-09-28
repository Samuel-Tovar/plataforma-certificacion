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


    // ====================================
    // CONSULTAR DATOS EN FIRESTORE
    // ====================================

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
    // RESPALDO TEMPORAL ADMINISTRADORES UTP
    // ============================================

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

                <span class="icono-cuenta">
                    👤
                </span>

                <span class="nombre-cuenta">
                    ${nombre}
                </span>

                <span class="flecha-cuenta">
                    ▼
                </span>

            </button>


            <div
                id="menuCuentaDropdown"
                class="menu-cuenta-dropdown"
            >


                <!-- MI CUENTA -->

                <a
                    href="cuenta.html"
                    class="opcion-cuenta"
                >
                    Mi cuenta
                </a>


                <!-- CONFIGURACIÓN -->

                <button
                    type="button"
                    id="opcionConfiguracion"
                    class="opcion-cuenta"
                >
                    Configuración de la cuenta
                </button>


                <!-- ADMINISTRADOR -->

                ${
                    esAdmin
                    ? `
                        <a
                            href="admin.html"
                            class="opcion-cuenta opcion-enlace"
                        >
                            Administrar publicaciones
                        </a>
                    `
                    : ""
                }


                <div class="separador-cuenta"></div>


                <!-- CERRAR SESIÓN -->

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
        document.getElementById(
            "menuCuentaDropdown"
        );


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