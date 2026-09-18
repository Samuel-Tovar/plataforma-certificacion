const CLAVE_STORAGE = "aseutp_publicaciones";

const contenedor =
    document.getElementById("contenedorPublicaciones");

const botonesFiltro =
    document.querySelectorAll(".filtro");

let publicaciones = [];


// ========================================
// CARGAR PUBLICACIONES
// ========================================

async function cargarPublicaciones() {

    try {

        // Primero buscar publicaciones
        // creadas desde el panel administrativo
        const guardadas =
            localStorage.getItem(CLAVE_STORAGE);


        if (guardadas) {

            publicaciones =
                JSON.parse(guardadas);

        } else {

            // Si todavía no hay nada guardado,
            // cargar los datos iniciales del JSON

            const respuesta =
                await fetch(
                    "../data/publicaciones.json"
                );


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudieron cargar las publicaciones."
                );
            }


            const datos =
                await respuesta.json();


            publicaciones =
                datos.publicaciones || [];


            // Guardarlas como datos iniciales
            localStorage.setItem(
                CLAVE_STORAGE,
                JSON.stringify(publicaciones)
            );
        }


        // Ordenar desde la más reciente
        publicaciones.sort(
            (a, b) =>
                new Date(b.fecha) -
                new Date(a.fecha)
        );


        mostrarPublicaciones(
            publicaciones
        );


    } catch (error) {

        console.error(
            "Error cargando publicaciones:",
            error
        );


        contenedor.innerHTML = `
            <p class="mensaje-error">
                No fue posible cargar las publicaciones.
            </p>
        `;
    }
}


// ========================================
// MOSTRAR PUBLICACIONES
// ========================================

function mostrarPublicaciones(lista) {

    contenedor.innerHTML = "";


    if (!lista || lista.length === 0) {

        contenedor.innerHTML = `
            <p>
                No hay publicaciones disponibles.
            </p>
        `;

        return;
    }


    lista.forEach(
        publicacion => {

            const tarjeta =
                document.createElement("article");


            tarjeta.className =
                "tarjeta-publicacion";


            tarjeta.innerHTML = `

                ${
                    publicacion.imagen
                    ? `
                        <img
                            src="${publicacion.imagen}"
                            class="imagen-publicacion"
                            alt="${publicacion.titulo}"
                        >
                    `
                    : ""
                }


                <div class="contenido-publicacion">

                    <span class="tipo-publicacion">

                        ${obtenerNombreTipo(
                            publicacion.tipo
                        )}

                    </span>


                    <h2>
                        ${publicacion.titulo}
                    </h2>


                    <p class="fecha-publicacion">

                        ${formatearFecha(
                            publicacion.fecha
                        )}

                    </p>


                    <p>
                        ${publicacion.descripcion}
                    </p>

                </div>
            `;


            contenedor.appendChild(
                tarjeta
            );
        }
    );
}


// ========================================
// FILTROS
// ========================================

botonesFiltro.forEach(
    boton => {

        boton.addEventListener(
            "click",
            function () {

                botonesFiltro.forEach(
                    item => {

                        item.classList.remove(
                            "activo-filtro"
                        );
                    }
                );


                this.classList.add(
                    "activo-filtro"
                );


                const tipo =
                    this.dataset.tipo;


                if (tipo === "todos") {

                    mostrarPublicaciones(
                        publicaciones
                    );

                    return;
                }


                const filtradas =
                    publicaciones.filter(
                        publicacion =>
                            publicacion.tipo === tipo
                    );


                mostrarPublicaciones(
                    filtradas
                );
            }
        );
    }
);


// ========================================
// NOMBRE DEL TIPO
// ========================================

function obtenerNombreTipo(tipo) {

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
// INICIAR
// ========================================

cargarPublicaciones();