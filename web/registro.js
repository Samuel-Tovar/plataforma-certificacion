const formulario = document.getElementById("formRegistro");

const password = document.getElementById("password");

const tipoPersona = document.getElementById("tipoPersona");

const campoGenero = document.getElementById("campoGenero");

const mensaje = document.getElementById("mensajeRegistro");


const reqLongitud = document.getElementById("reqLongitud");

const reqMayuscula = document.getElementById("reqMayuscula");

const reqNumero = document.getElementById("reqNumero");

const reqASCII = document.getElementById("reqASCII");


password.addEventListener("input", validarPassword);


tipoPersona.addEventListener("change", function () {

    if (tipoPersona.value === "natural") {

        campoGenero.style.display = "block";

    } else {

        campoGenero.style.display = "none";

    }

});


function validarPassword() {

    const valor = password.value;


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


function actualizarRequisito(
    elemento,
    valido
) {

    if (valido) {

        elemento.classList.add("requisito-valido");

    } else {

        elemento.classList.remove("requisito-valido");

    }

}


formulario.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        if (!validarPassword()) {

            mensaje.textContent =
                "La contraseña no cumple todos los requisitos.";

            mensaje.className =
                "mensaje-registro mensaje-error";

            return;
        }


        const consentimiento =
            document.getElementById("consentimiento");


        if (!consentimiento.checked) {

            mensaje.textContent =
                "Debes aceptar la autorización para continuar.";

            mensaje.className =
                "mensaje-registro mensaje-error";

            return;
        }


        mensaje.textContent =
            "✓ Información validada correctamente.";

        mensaje.className =
            "mensaje-registro mensaje-exito";


        /*
        IMPORTANTE:

        Aquí NO guardamos todavía los datos.

        Posteriormente enviaremos esta información
        al backend mediante una API.
        */

    }
);