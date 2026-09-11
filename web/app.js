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
            <div class="mensaje error">
                ❌ Ingrese un código de certificación.
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
                <div class="mensaje error">
                    <h2>❌ Certificación no encontrada</h2>

                    <p>
                        No existe una certificación asociada al código:
                    </p>

                    <strong>${codigoBuscado}</strong>
                </div>
            `;

            return;
        }


        const fechaFormateada = formatearFecha(
            certificado.fechaVinculacion
        );


        if (certificado.estado === "ACTIVO") {

            resultado.innerHTML = `
                <div class="certificado activo">

                    <h2>✅ Certificación válida</h2>

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
                        <span class="estado-activo">
                            ACTIVO
                        </span>
                    </p>

                    <p>
                        <strong>Fecha de vinculación:</strong>
                        ${fechaFormateada}
                    </p>

                </div>
            `;

        } else {

            resultado.innerHTML = `
                <div class="certificado inactivo">

                    <h2>⚠️ Certificación inactiva</h2>

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
                        <span class="estado-inactivo">
                            INACTIVO
                        </span>
                    </p>

                    <p>
                        <strong>Fecha de vinculación:</strong>
                        ${fechaFormateada}
                    </p>

                </div>
            `;
        }


    } catch (error) {

        console.error(error);

        resultado.innerHTML = `
            <div class="mensaje error">
                ❌ Ocurrió un error al consultar las certificaciones.
            </div>
        `;
    }
}


function formatearFecha(fecha) {

    const partes = fecha.split("-");

    if (partes.length !== 3) {
        return fecha;
    }

    const año = partes[0];
    const mes = partes[1];
    const dia = partes[2];

    return `${dia}/${mes}/${año}`;
}