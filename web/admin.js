const CLAVE_STORAGE = "aseutp_publicaciones";


// ========================================
// ELEMENTOS DEL HTML
// ========================================

const formulario =
    document.getElementById("formPublicacion");

const publicacionId =
    document.getElementById("publicacionId");

const tipoPublicacion =
    document.getElementById("tipoPublicacion");

const tituloPublicacion =
    document.getElementById("tituloPublicacion");

const descripcionPublicacion =
    document.getElementById("descripcionPublicacion");

const fechaPublicacion =
    document.getElementById("fechaPublicacion");

const imagenPublicacion =
    document.getElementById("imagenPublicacion");

const vistaPreviaImagen =
    document.getElementById("vistaPreviaImagen");

const listaAdmin =
    document.getElementById("listaAdmin");

const mensajeAdmin =
    document.getElementById("mensajeAdmin");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const btnCancelarEdicion =
    document.getElementById("btnCancelarEdicion");


let publicaciones = [];


// ========================================
// INICIAR PANEL
// ========================================

async function iniciarPanel() {

    publicaciones =
        await cargarPublicaciones();

    mostrarPublicacionesAdmin();
}


// ========================================
// CARGAR PUBLICACIONES
// ========================================

async function cargarPublicaciones() {

    const guardadas =
        localStorage.getItem(CLAVE_STORAGE);


    if (guardadas) {

        try {

            return JSON.parse(guardadas);

        } catch (error) {

            console.error(
                "Error leyendo publicaciones guardadas:",
                error
            );

        }
    }


    try {

        const respuesta =
            await fetch("../data/publicaciones.json");


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar publicaciones.json"
            );
        }


        const datos =
            await respuesta.json();


        localStorage.setItem(
            CLAVE_STORAGE,
            JSON.stringify(datos.publicaciones)
        );


        return datos.publicaciones;


    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "No fue posible cargar las publicaciones.",
            false
        );

        return [];
    }
}


// ========================================
// GUARDAR EN LOCALSTORAGE
// ========================================

function guardarLocalStorage() {

    try {

        localStorage.setItem(
            CLAVE_STORAGE,
            JSON.stringify(publicaciones)
        );

    } catch (error) {

        console.error(error);

        throw new Error(
            "No hay suficiente espacio para guardar la publicación. Intenta utilizar una imagen más pequeña."
        );
    }
}


// ========================================
// VISTA PREVIA DE LA IMAGEN
// ========================================

imagenPublicacion.addEventListener(
    "change",
    function () {

        const archivo =
            imagenPublicacion.files[0];


        vistaPreviaImagen.innerHTML = "";


        if (!archivo) {
            return;
        }


        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (!tiposPermitidos.includes(archivo.type)) {

            imagenPublicacion.value = "";

            mostrarMensaje(
                "Solo se permiten imágenes JPG, JPEG, PNG o WEBP.",
                false
            );

            return;
        }


        const url =
            URL.createObjectURL(archivo);


        vistaPreviaImagen.innerHTML = `
            <img
                src="${url}"
                class="imagen-vista-previa"
                alt="Vista previa de la imagen"
            >
        `;
    }
);


// ========================================
// PROCESAR Y COMPRIMIR IMAGEN
// ========================================

async function procesarImagen(archivo) {

    if (!archivo) {
        return "";
    }


    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (!tiposPermitidos.includes(archivo.type)) {

        throw new Error(
            "Solo se permiten imágenes JPG, JPEG, PNG o WEBP."
        );
    }


    if (archivo.size > 5 * 1024 * 1024) {

        throw new Error(
            "La imagen no puede superar los 5 MB."
        );
    }


    return new Promise(
        (resolve, reject) => {

            const lector =
                new FileReader();


            lector.onload =
                function (evento) {

                    const imagen =
                        new Image();


                    imagen.onload =
                        function () {

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            const maxAncho = 900;

                            let ancho =
                                imagen.width;

                            let alto =
                                imagen.height;


                            if (ancho > maxAncho) {

                                alto =
                                    alto *
                                    (maxAncho / ancho);

                                ancho =
                                    maxAncho;
                            }


                            canvas.width =
                                ancho;

                            canvas.height =
                                alto;


                            const ctx =
                            canvas.getContext("2d");
                            
                            // Fondo blanco para imágenes
                            // con transparencia
                            ctx.fillStyle = "#FFFFFF";
                            
                            ctx.fillRect(
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );
                            
                            // Dibujar imagen encima
                            ctx.drawImage(
                                imagen,
                                0,
                                0,
                                ancho,
                                alto
                            );

                            const imagenReducida =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.70
                                );


                            resolve(
                                imagenReducida
                            );
                        };


                    imagen.onerror =
                        function () {

                            reject(
                                new Error(
                                    "No fue posible procesar la imagen."
                                )
                            );
                        };


                    imagen.src =
                        evento.target.result;
                };


            lector.onerror =
                function () {

                    reject(
                        new Error(
                            "No fue posible leer la imagen."
                        )
                    );
                };


            lector.readAsDataURL(
                archivo
            );
        }
    );
}


// ========================================
// FORMULARIO
// ========================================

formulario.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();


        try {

            const idActual =
                publicacionId.value;


            if (idActual) {

                await editarPublicacion(
                    Number(idActual)
                );

            } else {

                await crearPublicacion();
            }


        } catch (error) {

            console.error(error);

            mostrarMensaje(
                error.message,
                false
            );
        }
    }
);


// ========================================
// CREAR PUBLICACIÓN
// ========================================

async function crearPublicacion() {

    const archivo =
        imagenPublicacion.files[0];


    let imagen = "";


    if (archivo) {

        imagen =
            await procesarImagen(
                archivo
            );
    }


    const nuevaPublicacion = {

        id: Date.now(),

        tipo:
            tipoPublicacion.value,

        titulo:
            tituloPublicacion
                .value
                .trim(),

        descripcion:
            descripcionPublicacion
                .value
                .trim(),

        fecha:
            fechaPublicacion.value,

        imagen:
            imagen
    };


    publicaciones.push(
        nuevaPublicacion
    );


    guardarLocalStorage();

    mostrarPublicacionesAdmin();

    limpiarFormulario();


    mostrarMensaje(
        "✓ Publicación creada correctamente.",
        true
    );
}


// ========================================
// EDITAR PUBLICACIÓN
// ========================================

async function editarPublicacion(id) {

    const indice =
        publicaciones.findIndex(
            publicacion =>
                publicacion.id === id
        );


    if (indice === -1) {

        mostrarMensaje(
            "No se encontró la publicación.",
            false
        );

        return;
    }


    // Mantener la imagen anterior
    // si el usuario no selecciona una nueva.
    let imagen =
        publicaciones[indice].imagen || "";


    const nuevoArchivo =
        imagenPublicacion.files[0];


    if (nuevoArchivo) {

        imagen =
            await procesarImagen(
                nuevoArchivo
            );
    }


    publicaciones[indice] = {

        id: id,

        tipo:
            tipoPublicacion.value,

        titulo:
            tituloPublicacion
                .value
                .trim(),

        descripcion:
            descripcionPublicacion
                .value
                .trim(),

        fecha:
            fechaPublicacion.value,

        imagen:
            imagen
    };


    guardarLocalStorage();

    mostrarPublicacionesAdmin();

    limpiarFormulario();


    mostrarMensaje(
        "✓ Publicación actualizada correctamente.",
        true
    );
}


// ========================================
// PREPARAR EDICIÓN
// ========================================

function prepararEdicion(id) {

    const publicacion =
        publicaciones.find(
            publicacion =>
                publicacion.id === id
        );


    if (!publicacion) {
        return;
    }


    publicacionId.value =
        publicacion.id;


    tipoPublicacion.value =
        publicacion.tipo;


    tituloPublicacion.value =
        publicacion.titulo;


    descripcionPublicacion.value =
        publicacion.descripcion;


    fechaPublicacion.value =
        publicacion.fecha;


    /*
        Un input type="file" NO puede
        rellenarse automáticamente.

        Por eso mantenemos la imagen
        anterior internamente.
    */

    imagenPublicacion.value = "";


    vistaPreviaImagen.innerHTML = "";


    if (publicacion.imagen) {

        vistaPreviaImagen.innerHTML = `

            <p class="texto-imagen-actual">
                Imagen actual:
            </p>

            <img
                src="${publicacion.imagen}"
                class="imagen-vista-previa"
                alt="Imagen actual"
            >

            <p class="ayuda-imagen">
                Selecciona otra imagen solamente
                si deseas reemplazarla.
            </p>
        `;
    }


    tituloFormulario.textContent =
        "Editar publicación";


    btnCancelarEdicion.hidden =
        false;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ========================================
// ELIMINAR PUBLICACIÓN
// ========================================

function eliminarPublicacion(id) {

    const confirmar =
        confirm(
            "¿Deseas eliminar esta publicación?"
        );


    if (!confirmar) {
        return;
    }


    publicaciones =
        publicaciones.filter(
            publicacion =>
                publicacion.id !== id
        );


    guardarLocalStorage();

    mostrarPublicacionesAdmin();


    // Si se estaba editando la misma
    // publicación que fue eliminada
    if (
        Number(publicacionId.value) === id
    ) {

        limpiarFormulario();
    }


    mostrarMensaje(
        "Publicación eliminada correctamente.",
        true
    );
}


// ========================================
// MOSTRAR PUBLICACIONES EN ADMIN
// ========================================

function mostrarPublicacionesAdmin() {

    listaAdmin.innerHTML = "";


    if (publicaciones.length === 0) {

        listaAdmin.innerHTML = `
            <p>
                No hay publicaciones registradas.
            </p>
        `;

        return;
    }


    const ordenadas =
        [...publicaciones].sort(
            (a, b) =>
                new Date(b.fecha) -
                new Date(a.fecha)
        );


    ordenadas.forEach(
        publicacion => {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "admin-publicacion";


            tarjeta.innerHTML = `

                ${
                    publicacion.imagen
                    ? `
                        <img
                            src="${publicacion.imagen}"
                            class="imagen-publicacion-admin"
                            alt="${publicacion.titulo}"
                        >
                    `
                    : ""
                }


                <span class="tipo-publicacion">
                    ${nombreTipo(publicacion.tipo)}
                </span>


                <h3>
                    ${publicacion.titulo}
                </h3>


                <p>
                    ${publicacion.descripcion}
                </p>


                <small>
                    ${formatearFecha(publicacion.fecha)}
                </small>


                <div class="acciones-admin">

                    <button
                        onclick="prepararEdicion(${publicacion.id})"
                        class="btn-editar"
                    >
                        Editar
                    </button>


                    <button
                        onclick="eliminarPublicacion(${publicacion.id})"
                        class="btn-eliminar"
                    >
                        Eliminar
                    </button>

                </div>
            `;


            listaAdmin.appendChild(
                tarjeta
            );
        }
    );
}


// ========================================
// LIMPIAR FORMULARIO
// ========================================

function limpiarFormulario() {

    formulario.reset();


    publicacionId.value = "";


    vistaPreviaImagen.innerHTML = "";


    tituloFormulario.textContent =
        "Nueva publicación";


    btnCancelarEdicion.hidden =
        true;
}


// ========================================
// CANCELAR EDICIÓN
// ========================================

btnCancelarEdicion.addEventListener(
    "click",
    limpiarFormulario
);


// ========================================
// NOMBRE DEL TIPO
// ========================================

function nombreTipo(tipo) {

    switch (tipo) {

        case "noticia":

            return "Noticia";


        case "convenio":

            return "Convenio";


        case "empleo":

            return "Oportunidad laboral";


        default:

            return "Publicación";
    }
}


// ========================================
// FORMATEAR FECHA
// ========================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "";
    }


    const partes =
        fecha.split("-");


    if (partes.length !== 3) {

        return fecha;
    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );
}


// ========================================
// MENSAJES
// ========================================

function mostrarMensaje(
    texto,
    exito
) {

    mensajeAdmin.textContent =
        texto;


    mensajeAdmin.className =
        exito
            ? "mensaje-registro mensaje-exito"
            : "mensaje-registro mensaje-error";


    setTimeout(
        () => {

            mensajeAdmin.textContent = "";

        },
        4000
    );
}


// ========================================
// INICIAR
// ========================================

iniciarPanel();