const contenedor =
    document.getElementById("contenedorPublicaciones");

const botonesFiltro =
    document.querySelectorAll(".filtro");

let publicaciones = [];


async function cargarPublicaciones() {

    try {

        const respuesta =
            await fetch("../data/publicaciones.json");

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron cargar las publicaciones."
            );
        }


        const datos =
            await respuesta.json();


        publicaciones =
            datos.publicaciones;


        mostrarPublicaciones(publicaciones);


    } catch (error) {

        console.error(error);

        contenedor.innerHTML = `
            <p class="mensaje-error">
                No fue posible cargar las publicaciones.
            </p>
        `;

    }

}


function mostrarPublicaciones(lista) {

    contenedor.innerHTML = "";


    if (lista.length === 0) {

        contenedor.innerHTML = `
            <p>
                No hay publicaciones disponibles.
            </p>
        `;

        return;
    }


    lista.forEach(publicacion => {

        const tarjeta =
            document.createElement("article");


        tarjeta.classList.add(
            "tarjeta-publicacion"
        );


        tarjeta.innerHTML = `

            <span class="tipo-publicacion">
                ${obtenerNombreTipo(publicacion.tipo)}
            </span>

            <h2>
                ${publicacion.titulo}
            </h2>

            <p class="fecha-publicacion">
                ${formatearFecha(publicacion.fecha)}
            </p>

            <p>
                ${publicacion.descripcion}
            </p>

        `;


        contenedor.appendChild(tarjeta);

    });

}


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


function formatearFecha(fecha) {

    const partes =
        fecha.split("-");


    if (partes.length !== 3) {
        return fecha;
    }


    return `
        ${partes[2]}/${partes[1]}/${partes[0]}
    `;

}


botonesFiltro.forEach(boton => {

    boton.addEventListener(
        "click",
        function () {

            botonesFiltro.forEach(item => {
                item.classList.remove(
                    "activo-filtro"
                );
            });


            this.classList.add(
                "activo-filtro"
            );


            const tipo =
                this.dataset.tipo;


            if (tipo === "todos") {

                mostrarPublicaciones(
                    publicaciones
                );

            } else {

                const filtradas =
                    publicaciones.filter(
                        publicacion =>
                            publicacion.tipo === tipo
                    );


                mostrarPublicaciones(
                    filtradas
                );

            }

        }
    );

});


cargarPublicaciones();