const boton = document.getElementById("btnVerificar");
const inputCodigo = document.getElementById("codigo");
const resultado = document.getElementById("resultado");


boton.addEventListener("click", verificarCertificacion);


inputCodigo.addEventListener("keydown", function (evento) {

    if (evento.key === "Enter") {
        verificarCertificacion();
    }

});


async function verificarCertificacion() {

    const codigoBuscado = inputCodigo.value.trim().toUpperCase();

    resultado.innerHTML = "";

    if (codigoBuscado === "") {

        resultado.innerHTML = `
            <div class="error">
                Ingrese un código de certificación.
            </div>
        `;

        return;
    }


    try {

        const respuesta = await fetch("../data/certificaciones.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la base de datos.");
        }

        const datos = await respuesta.json();

        const certificado = datos.certificaciones.find(
            item => item.codigo.toUpperCase() === codigoBuscado
        );


        if (!certificado) {

            resultado.innerHTML = `
                <div class="error">
                    Certificación no encontrada.
                </div>
            `;

            return;
        }


        resultado.innerHTML = `
            <div class="certificado">

                <h2>
                    ${
                        certificado.estado === "ACTIVO"
                        ? "✓ Certificación válida"
                        : "Certificación inactiva"
                    }
                </h2>

                <p>
                    <strong>Código:</strong>
                    ${certificado.codigo}
                </p>

                <p>
                    <strong>Nombre:</strong>
                    ${certificado.nombre}
                </p>

                <p>
                    <strong>Organización:</strong>
                    ${certificado.organizacion}
                </p>

                <p>
                    <strong>Cargo:</strong>
                    ${certificado.cargo}
                </p>

                <p>
                    <strong>Estado:</strong>
                    ${certificado.estado}
                </p>

                <p>
                    <strong>Fecha de vinculación:</strong>
                    ${certificado.fechaVinculacion}
                </p>

            </div>
        `;


    } catch (error) {

        console.error(error);

        resultado.innerHTML = `
            <div class="error">
                Ocurrió un error al consultar las certificaciones.
            </div>
        `;
    }
}