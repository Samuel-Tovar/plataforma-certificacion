import {
    auth,
    db
} from "./firebase-config.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    Timestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


/* =====================================================
   ELEMENTOS
===================================================== */

const buscarUsuario =
    document.getElementById(
        "buscarUsuario"
    );


const listaUsuarios =
    document.getElementById(
        "listaUsuarios"
    );


const mensajeAdminUsuarios =
    document.getElementById(
        "mensajeAdminUsuarios"
    );


const modalUsuario =
    document.getElementById(
        "modalUsuario"
    );


const btnCerrarModalUsuario =
    document.getElementById(
        "btnCerrarModalUsuario"
    );


const btnCancelarUsuario =
    document.getElementById(
        "btnCancelarUsuario"
    );


const formAdminUsuario =
    document.getElementById(
        "formAdminUsuario"
    );


const modalNombreUsuario =
    document.getElementById(
        "modalNombreUsuario"
    );


const modalCorreoUsuario =
    document.getElementById(
        "modalCorreoUsuario"
    );


const adminAfiliado =
    document.getElementById(
        "adminAfiliado"
    );


const adminEstadoAfiliacion =
    document.getElementById(
        "adminEstadoAfiliacion"
    );


const adminFechaVinculacion =
    document.getElementById(
        "adminFechaVinculacion"
    );


const adminFechaRenovacion =
    document.getElementById(
        "adminFechaRenovacion"
    );


const adminRol =
    document.getElementById(
        "adminRol"
    );


const btnGuardarUsuario =
    document.getElementById(
        "btnGuardarUsuario"
    );


const mensajeModalUsuario =
    document.getElementById(
        "mensajeModalUsuario"
    );


/* =====================================================
   VARIABLES
===================================================== */

let usuarioAdministrador =
    null;


let usuarios =
    [];


let usuarioSeleccionado =
    null;


/* =====================================================
   COMPROBAR AUTENTICACIÓN Y ROL
===================================================== */

onAuthStateChanged(
    auth,

    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        usuarioAdministrador =
            user;


        try {

            const referenciaAdmin =
                doc(
                    db,
                    "usuarios",
                    user.uid
                );


            const documentoAdmin =
                await getDoc(
                    referenciaAdmin
                );


            if (!documentoAdmin.exists()) {

                bloquearAcceso();

                return;
            }


            const datosAdmin =
                documentoAdmin.data();


            if (
                datosAdmin.rol !== "admin"
            ) {

                bloquearAcceso();

                return;
            }


            /* =========================================
               EL USUARIO ES ADMINISTRADOR
            ========================================= */

            await cargarUsuarios();

        }

        catch (error) {

            console.error(
                "Error verificando permisos:",
                error
            );


            mensajeAdminUsuarios.textContent =
                "No fue posible verificar los permisos administrativos.";


            mensajeAdminUsuarios.classList.add(
                "mensaje-error"
            );

        }

    }
);


/* =====================================================
   BLOQUEAR ACCESO
===================================================== */

function bloquearAcceso() {

    mensajeAdminUsuarios.textContent =
        "No tienes permisos para acceder a esta sección.";


    mensajeAdminUsuarios.classList.add(
        "mensaje-error"
    );


    listaUsuarios.innerHTML =
        "";


    buscarUsuario.disabled =
        true;

}


/* =====================================================
   CARGAR USUARIOS
===================================================== */

async function cargarUsuarios() {

    try {

        mensajeAdminUsuarios.textContent =
            "Cargando usuarios...";


        mensajeAdminUsuarios.classList.remove(
            "mensaje-error",
            "mensaje-exito"
        );


        const referenciaUsuarios =
            collection(
                db,
                "usuarios"
            );


        const consultaUsuarios =
            await getDocs(
                referenciaUsuarios
            );


        usuarios =
            [];


        consultaUsuarios.forEach(
            documento => {

                usuarios.push(
                    {
                        id:
                            documento.id,

                        ...documento.data()
                    }
                );

            }
        );


        /* =========================================
           ORDENAR POR NOMBRE
        ========================================= */

        usuarios.sort(
            (a, b) => {

                const nombreA =
                    `${a.nombre || ""} ${a.apellido || ""}`
                        .trim()
                        .toLowerCase();


                const nombreB =
                    `${b.nombre || ""} ${b.apellido || ""}`
                        .trim()
                        .toLowerCase();


                return nombreA.localeCompare(
                    nombreB,
                    "es"
                );

            }
        );


        mostrarUsuarios(
            usuarios
        );


        mensajeAdminUsuarios.textContent =
            `${usuarios.length} usuario(s) registrado(s).`;

    }

    catch (error) {

        console.error(
            "Error cargando usuarios:",
            error
        );


        mensajeAdminUsuarios.textContent =
            "No fue posible cargar la lista de usuarios.";


        mensajeAdminUsuarios.classList.add(
            "mensaje-error"
        );

    }

}


/* =====================================================
   MOSTRAR USUARIOS
===================================================== */

function mostrarUsuarios(lista) {

    listaUsuarios.innerHTML =
        "";


    if (
        lista.length === 0
    ) {

        listaUsuarios.innerHTML =
            `
                <div class="usuario-admin-vacio">
                    No se encontraron usuarios.
                </div>
            `;

        return;
    }


    lista.forEach(
        usuario => {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "usuario-admin-tarjeta";


            const nombreCompleto =
                `${usuario.nombre || ""} ${usuario.apellido || ""}`
                    .trim() ||
                "Usuario sin nombre";


            const correo =
                usuario.correo ||
                "Correo no registrado";


            const afiliado =
                usuario.Afiliado === true ||
                usuario.afiliado === true;


            const estado =
                (
                    usuario.estadoAfiliacion ||
                    "PENDIENTE"
                )
                .toString()
                .toUpperCase();


            const programas =
                obtenerProgramas(
                    usuario
                );


            /* =========================================
               CLASE DEL ESTADO
            ========================================= */

            let claseEstado =
                "afiliacion-pendiente";


            if (
                afiliado &&
                estado === "ACTIVA"
            ) {

                claseEstado =
                    "afiliacion-activa";

            }

            else if (
                estado === "INACTIVA"
            ) {

                claseEstado =
                    "afiliacion-inactiva";

            }


            /* =========================================
               PROGRAMAS
            ========================================= */

            let programasHTML =
                "No registrado";


            if (
                programas.length > 0
            ) {

                programasHTML =
                    programas
                        .map(
                            programa =>
                                `<li>${escaparHTML(programa)}</li>`
                        )
                        .join("");

                programasHTML =
                    `
                        <ul class="usuario-admin-programas">
                            ${programasHTML}
                        </ul>
                    `;

            }


            /* =========================================
               HTML
            ========================================= */

            tarjeta.innerHTML =
                `
                    <div class="usuario-admin-info">

                        <div class="usuario-admin-principal">

                            <h2>
                                ${escaparHTML(nombreCompleto)}
                            </h2>

                            <p class="usuario-admin-correo">
                                ${escaparHTML(correo)}
                            </p>

                        </div>


                        <div class="usuario-admin-datos">

                            <div>

                                <span class="usuario-admin-etiqueta">
                                    Estado
                                </span>

                                <span
                                    class="estado-afiliacion ${claseEstado}"
                                >
                                    ${escaparHTML(estado)}
                                </span>

                            </div>


                            <div>

                                <span class="usuario-admin-etiqueta">
                                    Afiliado
                                </span>

                                <span>
                                    ${afiliado ? "Sí" : "No"}
                                </span>

                            </div>


                            <div>

                                <span class="usuario-admin-etiqueta">
                                    Rol
                                </span>

                                <span>
                                    ${escaparHTML(usuario.rol || "usuario")}
                                </span>

                            </div>


                            <div>

                                <span class="usuario-admin-etiqueta">
                                    Renovación
                                </span>

                                <span>
                                    ${formatearFecha(usuario.fechaRenovacion)}
                                </span>

                            </div>

                        </div>


                        <div class="usuario-admin-bloque-programas">

                            <span class="usuario-admin-etiqueta">
                                Programa(s)
                            </span>

                            ${programasHTML}

                        </div>

                    </div>


                    <div class="usuario-admin-acciones">

                        <button
                            class="boton-principal btn-gestionar-usuario"
                            type="button"
                            data-id="${usuario.id}"
                        >
                            Gestionar afiliación
                        </button>

                    </div>
                `;


            listaUsuarios.appendChild(
                tarjeta
            );

        }
    );


    /* =========================================
       BOTONES
    ========================================= */

    document
        .querySelectorAll(
            ".btn-gestionar-usuario"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",

                    () => {

                        abrirUsuario(
                            boton.dataset.id
                        );

                    }
                );

            }
        );

}


/* =====================================================
   BUSCADOR
===================================================== */

buscarUsuario.addEventListener(
    "input",

    () => {

        const texto =
            buscarUsuario.value
                .trim()
                .toLowerCase();


        if (
            texto === ""
        ) {

            mostrarUsuarios(
                usuarios
            );

            return;
        }


        const filtrados =
            usuarios.filter(
                usuario => {

                    const nombre =
                        `${usuario.nombre || ""} ${usuario.apellido || ""}`
                            .toLowerCase();


                    const correo =
                        (
                            usuario.correo ||
                            ""
                        )
                        .toLowerCase();


                    return (
                        nombre.includes(texto) ||
                        correo.includes(texto)
                    );

                }
            );


        mostrarUsuarios(
            filtrados
        );

    }
);


/* =====================================================
   ABRIR USUARIO
===================================================== */

function abrirUsuario(idUsuario) {

    const usuario =
        usuarios.find(
            elemento =>
                elemento.id === idUsuario
        );


    if (!usuario) {

        return;
    }


    usuarioSeleccionado =
        usuario;


    const nombreCompleto =
        `${usuario.nombre || ""} ${usuario.apellido || ""}`
            .trim() ||
        "Usuario";


    modalNombreUsuario.textContent =
        nombreCompleto;


    modalCorreoUsuario.textContent =
        usuario.correo ||
        "Correo no registrado";


    /* =========================================
       AFILIADO
    ========================================= */

    const afiliado =
        usuario.Afiliado === true ||
        usuario.afiliado === true;


    adminAfiliado.value =
        afiliado
            ? "true"
            : "false";


    /* =========================================
       ESTADO
    ========================================= */

    adminEstadoAfiliacion.value =
        (
            usuario.estadoAfiliacion ||
            "PENDIENTE"
        )
        .toString()
        .toUpperCase();


    /* =========================================
       FECHAS
    ========================================= */

    adminFechaVinculacion.value =
        fechaParaInput(
            usuario.fechaVinculacion
        );


    adminFechaRenovacion.value =
        fechaParaInput(
            usuario.fechaRenovacion
        );


    /* =========================================
       ROL
    ========================================= */

    adminRol.value =
        usuario.rol ||
        "usuario";


    /* =========================================
       EVITAR QUITARSE EL ADMIN A SÍ MISMO
    ========================================= */

    if (
        usuarioAdministrador &&
        usuario.id === usuarioAdministrador.uid
    ) {

        adminRol.disabled =
            true;

    }

    else {

        adminRol.disabled =
            false;

    }


    mensajeModalUsuario.textContent =
        "";


    mensajeModalUsuario.classList.remove(
        "mensaje-error",
        "mensaje-exito"
    );


    modalUsuario.classList.remove(
        "oculto"
    );

}


/* =====================================================
   CERRAR MODAL
===================================================== */

function cerrarModal() {

    modalUsuario.classList.add(
        "oculto"
    );


    usuarioSeleccionado =
        null;

}


/* =====================================================
   BOTONES CERRAR
===================================================== */

btnCerrarModalUsuario.addEventListener(
    "click",
    cerrarModal
);


btnCancelarUsuario.addEventListener(
    "click",
    cerrarModal
);


/* =====================================================
   CERRAR AL PULSAR FUERA
===================================================== */

modalUsuario.addEventListener(
    "click",

    evento => {

        if (
            evento.target === modalUsuario
        ) {

            cerrarModal();

        }

    }
);


/* =====================================================
   GUARDAR CAMBIOS
===================================================== */

formAdminUsuario.addEventListener(
    "submit",

    async evento => {

        evento.preventDefault();


        if (!usuarioSeleccionado) {

            return;
        }


        try {

            btnGuardarUsuario.disabled =
                true;


            btnGuardarUsuario.textContent =
                "Guardando...";


            mensajeModalUsuario.textContent =
                "Guardando cambios...";


            mensajeModalUsuario.classList.remove(
                "mensaje-error",
                "mensaje-exito"
            );


            const afiliado =
                adminAfiliado.value === "true";


            const estado =
                adminEstadoAfiliacion.value;


            const rol =
                adminRol.disabled
                    ? usuarioSeleccionado.rol || "admin"
                    : adminRol.value;


            const referenciaUsuario =
                doc(
                    db,
                    "usuarios",
                    usuarioSeleccionado.id
                );


            await updateDoc(
                referenciaUsuario,
                {

                    Afiliado:
                        afiliado,

                    estadoAfiliacion:
                        estado,

                    fechaVinculacion:
                        convertirFechaFirestore(
                            adminFechaVinculacion.value
                        ),

                    fechaRenovacion:
                        convertirFechaFirestore(
                            adminFechaRenovacion.value
                        ),

                    rol:
                        rol

                }
            );


            mensajeModalUsuario.textContent =
                "Los cambios administrativos se guardaron correctamente.";


            mensajeModalUsuario.classList.add(
                "mensaje-exito"
            );


            /* =========================================
               RECARGAR LISTA
            ========================================= */

            await cargarUsuarios();


            setTimeout(
                () => {

                    cerrarModal();

                },
                800
            );

        }

        catch (error) {

            console.error(
                "Error actualizando usuario:",
                error
            );


            mensajeModalUsuario.textContent =
                "No fue posible guardar los cambios.";


            mensajeModalUsuario.classList.add(
                "mensaje-error"
            );

        }

        finally {

            btnGuardarUsuario.disabled =
                false;


            btnGuardarUsuario.textContent =
                "Guardar cambios";

        }

    }
);


/* =====================================================
   PROGRAMAS
===================================================== */

function obtenerProgramas(usuario) {

    const programas =
        usuario.ProgramasEgreso ??
        usuario.programasEgreso ??
        usuario.ProgramaEgreso ??
        usuario.programaEgreso ??
        [];


    if (
        Array.isArray(programas)
    ) {

        return programas
            .map(
                programa =>
                    String(programa).trim()
            )
            .filter(
                programa =>
                    programa !== ""
            );

    }


    if (
        typeof programas === "string" &&
        programas.trim() !== ""
    ) {

        return [
            programas.trim()
        ];

    }


    return [];

}


/* =====================================================
   CONVERTIR FECHA A FIRESTORE
===================================================== */

function convertirFechaFirestore(
    fecha
) {

    if (!fecha) {

        return null;

    }


    const fechaJS =
        new Date(
            `${fecha}T12:00:00`
        );


    return Timestamp.fromDate(
        fechaJS
    );

}


/* =====================================================
   FECHA PARA INPUT
===================================================== */

function fechaParaInput(
    fecha
) {

    if (!fecha) {

        return "";

    }


    let fechaJS;


    if (
        typeof fecha === "object" &&
        typeof fecha.toDate === "function"
    ) {

        fechaJS =
            fecha.toDate();

    }

    else {

        fechaJS =
            new Date(
                fecha
            );

    }


    if (
        Number.isNaN(
            fechaJS.getTime()
        )
    ) {

        return "";

    }


    const año =
        fechaJS.getFullYear();


    const mes =
        String(
            fechaJS.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );


    const dia =
        String(
            fechaJS.getDate()
        )
        .padStart(
            2,
            "0"
        );


    return `${año}-${mes}-${dia}`;

}


/* =====================================================
   FORMATEAR FECHA
===================================================== */

function formatearFecha(
    fecha
) {

    if (!fecha) {

        return "No registrada";

    }


    if (
        typeof fecha === "object" &&
        typeof fecha.toDate === "function"
    ) {

        return fecha
            .toDate()
            .toLocaleDateString(
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


    return String(
        fecha
    );

}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escaparHTML(
    texto
) {

    return String(
        texto
    )
    .replaceAll(
        "&",
        "&amp;"
    )
    .replaceAll(
        "<",
        "&lt;"
    )
    .replaceAll(
        ">",
        "&gt;"
    )
    .replaceAll(
        '"',
        "&quot;"
    )
    .replaceAll(
        "'",
        "&#039;"
    );

}