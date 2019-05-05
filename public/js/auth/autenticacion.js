class Autenticacion {
  autEmailPass (email, password) {
    // Autenticar el usuario con el método de Email y Password
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(result => {
        // Si la promesa se resuelve es que este usuario si se encuentra registrado con las credenciales propocionadas
        // Sin embargo...
        // Debemos validar (para este ejemplo) si realmente el usuario ha verificado la cuenta
        if(result.user.emailVerified) {
          // Colocamos su imagen de avatar en la aplicacion
          $('#avatar').attr('src', 'imagenes/usuario_auth.png')
          // Enviamos un mensaje de bienvenida
          Materialize.toast(`Bienvenido ${result.user.displayName}`, 5000)
        } else {
          // En este caso, el usuario hasta el momento no ha confirmado o activado su cuenta.
          // Por tanto, no debemos dar acceso.
          // Se le notifica de lo sucedido y se deslogea manualmente, ya que de manera autmática
          // en este punto firebase lo ha logeado automáticamente (puesto que el usuario si existe)
          firebase.auth().signOut();
          Materialize.toast(
            `Por favor, realiza la verificación de la cuenta`,
            5000
          )
        }
      })
    // Cerramos el modal de Login con Email y Password. Este se abre desde el authController cuando el
    // usuario decide logearse por este medio
    $('.modal').modal('close')
    
    //$('#avatar').attr('src', 'imagenes/usuario_auth.png')
    //Materialize.toast(`Bienvenido ${result.user.displayName}`, 5000)
    //$('.modal').modal('close')
   
  }

  crearCuentaEmailPass (email, password, nombres) {
    // Habilitar el servicio de autenticación de firebase
    let auth = firebase.auth();
    // Crear un usuario con Email y Password
    auth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        // La promesa retorna un objeto con el usuario registrado y automáticamente logeado
        // Podemos actualizar la informacion del usuario con datos adicionales. Ya que el servicio de auth()
        // Solo puede almacenar el emal, password, url_photo y name. Cualquier otro dato se debe almacenar en
        // el servicio de base de datos
        result.user.updateProfile({
          displayName: nombres
        })
        // Por buenas prácticas, enviamos un correo electrónico de confirmación de cuenta 
        // cuando el usuario se ha registrado por primera vez.
        // En este caso el correo tendrá un boton que al ser presionado, debe redireccionar al usuario
        // al home de nuestra aplicación
        const configuracion = {
          url: 'http://localhost:3000/'
        }
        result.user.sendEmailVerification(configuracion).catch(error => {
          console.log(error);
          Materialize.toast(error.message, 4000);
        })
        // Por defecto, firebase registra y logea automáticamente a los usuarios.
        // Sin embargo, para serciorarnos que el usuario confirme su registro, debemos deslogearlo
        // manualmente
        firebase.auth().signOut()
        // Ahora, mostramos un mensaje de bienvenida. Invitando al usuario a que confirme su cuentra via email
        Materialize.toast(
          `Bienvenido ${nombres}, debes realizar el proceso de verificación`,
          4000
        );
        // Cerrar la ventana modal, después del mensaje.
        // Esta ventana se abre cuando el usuario hace click en crear nna cuenta desde el boton de iniciar sesion.
        $('.modal').modal('close');
      })
      .catch(error => {
        // Si la promesa se ha rechazado, envia el error sucedido. En este caso lo mostramos mediante
        // la libreria de toast de Materialize
        console.log(error);
        Materialize.toast(error.message, 4000);
      })
    /*Materialize.toast(
      `Bienvenido ${nombres}, debes realizar el proceso de verificación`,
      4000
    )

    $('.modal').modal('close')*/
    
  }

  authCuentaGoogle () {
    // Definir el proveedor del servicio de autenticacion social
    const provider = new firebase.auth.GoogleAuthProvider();
    // Abrir una ventana emergente para pedir las credenciales de google.
    // No es beuna idea redireccionar a google, por cuestiones de experiencia de usuario
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        // La promesa resuelta es un objeto que envia google con los datos del usuario autenticado
        // En este caso colocamos como avatar la imagen que tiene en google
        $('#avatar').attr('src', result.user.photoURL)
        // Ahora cerramos el modal que se abrió cuando el usuario decidio iniciar sesion
        $('.modal').modal('close')
        // Solo mostramos un mensaje de bienvenida
        Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
      })
      .catch(error => {
        // En este caso si la promesa es rechazada, es debido a errores en sus credenciales.
        // Ahora cerramos el modal que se abrió cuando el usuario decidio iniciar sesion
        $('.modal').modal('close')
        console.error(error)
        Materialize.toast(`Error al autenticarse con google ${error}`, 4000)

      })
   
    //$('#avatar').attr('src', result.user.photoURL)
    //$('.modal').modal('close')
    //Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
  }

  authCuentaFacebook () {
    // Definir el proveedor del servicio de autenticacion social
    const provider = new firebase.auth.FacebookAuthProvider();
    // Abrir una ventana emergente para pedir las credenciales de google.
    // No es beuna idea redireccionar a facebook, por cuestiones de experiencia de usuario
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        // La promesa resuelta es un objeto que envia facebook con los datos del usuario autenticado
        // En este caso colocamos como avatar la imagen que tiene en facebook
        $('#avatar').attr('src', result.user.photoURL)
        // Ahora cerramos el modal que se abrió cuando el usuario decidio iniciar sesion
        $('.modal').modal('close')
        // Solo mostramos un mensaje de bienvenida
        Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
      })
      .catch(error => {
        // En este caso si la promesa es rechazada, es debido a errores en sus credenciales.
        // Ahora cerramos el modal que se abrió cuando el usuario decidio iniciar sesion
        $('.modal').modal('close')
        console.error(error)
        Materialize.toast(`Error al autenticarse con facebook ${error}`, 4000)

      })
    //$('#avatar').attr('src', result.user.photoURL)
    //$('.modal').modal('close')
    //Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
  }

  authTwitter () {
    // TODO: Crear auth con twitter
  }

  recuperarPasswordEmail (email) {
    // Verificar si se ha indicado un email para proceder a restablecer la contraseña
    if(email) {
      console.log(email);
      // Le indicamos la URL a la que debe redireccionar si el proceso es correcto    
      const configuracion = {
        url: 'http://localhost:3000/'
      }
      // El metodo sendPasswordResetEmail se encarga de reestableer la contraseña para el email indicado
      return firebase.auth().sendPasswordResetEmail(email, configuracion)
        .then(() => {
          // Si la promesa se resuelve, significa que se haenviado el email para restablecer el password
          //console.log(result)
          Materialize.toast(`Se ha enviado un correo para reestablecer la contraseña`, 4000)
          // En esta sección debemos cerrar el modal del formularo de restablecer conraseña
          //$('.modal').modal('close')
          // Devolvemos una promesa para cerrar y setear el campo de formulario
          //return new Promise.resolve();
        })
        .catch(error => {
          // Si la promesa es rechazada, algo paso
          console.log(error)
          Materialize.toast(`Un error a sucedo al enviar el correo de reestablecimiento de contraseña ${error}`, 4000)
          //$('.modal').modal('close')
          //// Devolvemos una promesa para cerrar y setear el campo de formulario
          //return new Promise.resolve();
        })
    } else {
      // Esto sucede a consecuencia de no indicar email para reestablecer la contraseña
      Materialize.toast(`Favor de ingresar un correo electrónico`)
      //$('.modal').modal('close')
    }
    //// Devolvemos una promesa para cerrar y setear el campo de formulario
         /// return Promise.resolve();
  }
}
