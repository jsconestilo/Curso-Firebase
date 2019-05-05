$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

  // Init Firebase nuevamente con los datos de configuración 
  // (ver archivo ConfigFirebase.js, en este caso le paso la constante (objeto))
  firebase.initializeApp(varConfig);


  // TODO: Adicionar el service worker 
  // (registrarlo para que lo ejecute en foregorunf y background)
  /*navigator.serviceWorker.register('notificaciones-sw.js')
    .then(registro => {
      // terminado el registro me devuelve el registro
      console.log('ServiceWorker registrado')
      // En este caso le informo al servicio de firebase messaging que use dicho registro
      // para usar el service worker registrado en el navegador
      firebase.messaging().useServiceWorker(registro)
    })
    .catch(error => {
      console.log(`Error al registrar el ServiceWorker ${error}`)
    })*/

 

  // TODO: Registrar LLave publica de messaging
  // 
  // Registrar credenciales para indicar a firebase message si hay notificaciones push
  // a donde las debe enviar
  // La clave se genera desde la configuracion del proyecto, apartado Cloud Messaging
  /*const messaging = firebase.messaging()
  messaging.usePublicVapidKey('BNeteaiiE_oUywidZDMb1217WSBTnlT9KWcZXJ7tWrK01BYerHINznoIVWqPADZkhJJJL02doAyMhw_c_NCwcmc')*/

  

  // TODO: Solicitar permisos para las notificaciones
  // Aqui aparece una ventanita en el navegador invitando al usuario a aceptar las notificacones
  /*messaging.requestPermissions()
    .then(() => {
      console.log('Permiso otorgado para recibir notificaciones')
      // En este caso solocitamos el token generado (cuando se otorgo el permiso)
      // Esto es asincrono, por tanto retornamos la promesa y nos encademos a ella
      return messaging.getToken()
    }).then(token => {
      // Una vez entregado el token
      // Debemos registrar los tokens de usuarios que permitieron recibir notificaciones en la base de datos
      const db = firebase.firestore()
      // En este caso el documento le asignamos un identificador (llave) igual al token
      // tokens/mitokengenerado/
      db.collection('tokens').doc(token).set({
        token: token
      }).catch(error => {
        console.log(`Error al insertar el token en la base de datos ${error}`)
      })
    })*/

  // Obtnener un nuevo token
  // Esto puede suceder cuando el usuario sale del navegador
  // o por algun mantenimiento del mismo cache (borrar archivos e historial)
  // 
  // En este caso el observador verifica si el token se ha refrescado
  /*messaging.onTokenRefresh(() => {
    messaging.getToken()
      .then(token => {
        console.log('El token se ha renovado')
        // En este caso el token nuevo debe ser almacenado en la base de datos
        const db = firebase.firestore()
        db.collection('tokens').doc(token).set({
          token: token
        }).catch(error => {
          console.log(`Error al insertar el token en la base de datos ${error}`)
        })
      })
  })*/
   

  // TODO: Recibir las notificaciones cuando el usuario esta foreground
  // Es decir, se encuentra en la app navegando
  /*messaging.onMessage(payload => {
    //En este caso el payload es el contenido o cuerpo de la notificación
    //Este apartado solo escucha la emisión de un mensaje push
    //Recordar que este debe ser disparado cuando se publica el post al cual estan suscritos los tokens del los usuarios
    Materialize.toast(
      `Ya tenemos un nuevo post. Revisalo, se llama ${payload.data.titulo}`,
      6000
    )
  })*/

  // TODO: Recibir las notificaciones cuando el usuario esta background
  // Estas se agregan dentro del service worker

  // TODO: Listening real time
  // El oyente se registro en el archivo de post.js, en este caso lo invoco para que se ejecute
  const post = new Post()
  post.consultarTodosPost();

  // TODO: Firebase observador del cambio de estado
  firebase.auth().onAuthStateChanged(user => {
    // En este caso, el observador se encuentra activo todo el tiempo.
    // escucha cuando un usuario se logea o cierra sesion de manera autmática
    // Verificamos si el usuario existe (se logeo)
    if(user) {
      // Cambiar el texto deñ boton de iniciar sesion por salir
      $('#btnInicioSesion').text('Salir')
      if(user.photoURL) {
        // Si el usuario se logeo por red social, tiene foto
        $('#avatar').attr('src', user.photoURL)  
      } else {
        // Mostrar una imagen por defecto cuando el usuario se logeo por email y pass
        $('#avatar').attr('src', 'imagenes/usuario_auth.png');
      }
    } else {
      // Si no hay usuario, es por que este ha cerrado sesion
      // Por tanto cambiamos el texto del boton de iniciar sesion
      $('#btnInicioSesion').text('Iniciar Sesion')
      // Colocamos la imagen de usuairos invitados
      $('#avatar').attr('src', 'imagenes/usuario.png')
    }

    //NOTA:
    //El codigo del boton de iniciarSesion se ejecuta cuando es presionado
    //pero este código se activa una vez firebase detecta un signOut o un signIn
    //
    //Es importante recordar que el estado del usuario, firebase lo guarda en
    //la cahe del navegador. POR ESO CUANDO SE REFRESCA, PIERDE LA INFO PERO
    //EN CUESTION DE SEGUNDOS LA RECUPERA
  })

  //$('#btnInicioSesion').text('Salir')
  //$('#avatar').attr('src', user.photoURL)
  //$('#avatar').attr('src', 'imagenes/usuario_auth.png')
  //$('#btnInicioSesion').text('Iniciar Sesión')
  //$('#avatar').attr('src', 'imagenes/usuario.png')

  // TODO: Evento boton inicio sesion
  $('#btnInicioSesion').click(() => {
    // Verificar el estado actual del usuario
    // si el usuario actual ya se encuentra autenticado
    const user = firebase.auth().currentUser
    if(user) {
      // En caso de ser correcto, el boton
      // tiene la obligacion de deslogear
      //$('#btnInicioSesion').text('Iniciar Sesion')
      firebase.auth().signOut()
        .then(() => {
          //$('#avatar').attr('src', 'imagenes/usuario.png')
          Materialize.toast(`SignOut correcto`, 4000)
        }).catch(error => {
          Materialize.toast(`Error al realizar SignOut ${error}`, 4000)
        })
    } else {
      // Si no hay usuario autenticado, mostraos el modal para que se loge o registre
      $('#modalSesion').modal('open')
      $('#emailSesion').val('')
      $('#passwordSesion').val('')
    }

    //$('#avatar').attr('src', 'imagenes/usuario.png')
    // Materialize.toast(`Error al realizar SignOut => ${error}`, 4000)
    

  })

  $('#avatar').click(() => {
    // En este caso, si se hace clic en el avatar el usuario se debe deslogear
    firebase.auth().signOut()
      .then(() => {
        // La promesa resuelta, nos permite modificar la imagen del avatar e informar al usuario del exito
        $('#avatar').attr('src', 'imagenes/usuario.png')
        Materialize.toast('SignOut correcto', 4000)
      })
      .catch(error => {
        Materialize.toast(`Error al realizar el SignOut ${error}`, 4000)
      })
    //$('#avatar').attr('src', 'imagenes/usuario.png')
    //Materialize.toast(`SignOut correcto`, 4000)
  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Posts de la Comunidad')
    const post = new Post()
    post.consultarTodosPost()
  })

  $('#btnMisPost').click(() => {
    // Inspecciono el usuario actual
    const user = firebase.auth().currentUser
    // Si el usuario existe es porque esta logeado
    if(user) {
      // Consultamos los post por su email
      const post = new Post()
      post.consultarPostxUsuario(user.email)
      // Cambio la leyenda de mi seccion de página
      $('#tituloPost').text('Mis Posts')
    } else{
      Materialize.toast(`Debes estar autenticado para ver tus posts`, 4000)    
    }
  })
})
