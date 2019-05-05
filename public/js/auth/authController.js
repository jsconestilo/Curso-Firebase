$(() => {    


    $("#btnRegistroEmail").click(() => {
        const nombres = $('#nombreContactoReg').val();
        const email = $('#emailContactoReg').val();
        const password = $('#passwordReg').val();
        // TODO : LLamar crear cuenta con email
        
        // Crear una instancia de la clase Autenticación (archivo autenticacion.js)
        const auth = new Autenticacion();
        // Invocar el método de crear cuenta con email y password
        auth.crearCuentaEmailPass(email, password, nombres);
    });

    $("#btnInicioEmail").click(() => {
        const email = $('#emailSesion').val();
        const password = $('#passwordSesion').val();
        // TODO : LLamar auth cuenta con email
        
        // Creamos una instancia de la clase Autenticacion
        const auth = new Autenticacion();
        auth.autEmailPass(email, password); 
    });

    $("#authGoogle").click(() => {
        // Creamos una instancia de la clase Autenticacion
        const objAuth = new Autenticacion()
        // Invocamos el método que nos permite logearnos con la cuenta de google
        objAuth.authCuentaGoogle()
    });

    $("#authFB").click(() => {
        // Creamos una instancia de la clase Autenticacion
        const objAuth = new Autenticacion();
        // Invocamos el método que nos permite logearnos con la cuenta de facebook
        objAuth.authCuentaFacebook();
    });
    //$("#authTwitter").click(() => //AUTH con Twitter);

    $('#btnRegistrarse').click(() => {
        $('#modalSesion').modal('close');
        $('#modalRegistro').modal('open');
    });

    $('#btnIniciarSesion').click(() => {
        $('#modalRegistro').modal('close');
        $('#modalSesion').modal('open');
    });

    $('#btnReestablecerPassword').click(() => {
        // Cerramos el modal general de iniciar sesion
        $('#modalSesion').modal('close');
        // Esta sección se encarga de mostrar el modal con el formulario
        // para ingresar el email y poder recuperar la contraseña asociada
        $('#modalRecoveryPassword').modal('open')
        
    });

    $('#btnRecoveryEmail').click(() => {
        // Esta sección se activa cuando el usuario hace click en el boton
        // de recuperar contraseña, situado en el formulario
        const email = $('#emailRecovery').val()
        const auth = new Autenticacion()
        // Se invoca el metodo que se encarga de reestablecer la contraseña
        auth.recuperarPasswordEmail(email)
            .then(() => {
                $('#emailRecovery').val('')
                $('.modal').modal('close')
            });
        // Para limpiar el campo, deberíamos hacerlo dentro del cuerpo
        // de una promesa....
    })

});