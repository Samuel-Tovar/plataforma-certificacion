window.addEventListener(
    "abrirMiCuenta",
    (evento) => {

        const usuario =
            evento.detail.user;

        const rol =
            evento.detail.rol;


        console.log(
            "Abrir Mi Cuenta"
        );

        console.log(
            "Usuario:",
            usuario
        );

        console.log(
            "Rol:",
            rol
        );


        alert(
            `Mi cuenta\n\nCorreo: ${usuario.email}\nRol: ${rol}`
        );

    }
);



window.addEventListener(
    "abrirConfiguracionCuenta",
    (evento) => {

        const usuario =
            evento.detail.user;


        console.log(
            "Abrir configuración"
        );

        console.log(
            usuario
        );


        alert(
            `Configuración de la cuenta\n\n${usuario.email}`
        );

    }
);