class Post {
  constructor () {
      // TODO inicializar firestore y settings
      // Este es el método constructor de la clase Post, tiene el mismo comportamiento que todos los constrictos
      
      // Creamos una referencia al servicio de firestore
      this.db = firebase.firestore()
      // Especificamos que se deben usar objetos timestamp para los campos timestamp
      // Ya no es necesario, la nueva version la tiene en true por defecto
      //const settings = { timestampsInSnapshots: true }
      // Pasamos la configuración a firestore
      //this.db.settings(settings)
      
  }

  crearPost (uid, emailUser, titulo, descripcion, imagenLink, videoLink) {
    // Indicamos a firestore que coleccion se va a emplear para añadir el documento
    // El método add, genera automáticamene el id del documento
    
    // En este caso add devuelve promesa, por tanto la retornamos para que en la sección donde se invoca
    // este metodo, se hagan tareas una vez registrados los datos
    const data = {
      uid: uid,
      autor: emailUser,
      titulo: titulo,
      descripcion: descripcion,
      imagenLink: imagenLink,
      videoLink: videoLink,
      // En este caso le indicamos a firestore que genere la fecha actual en el servidor
      fecha: firebase.firestore.FieldValue.serverTimestamp()
    }
    return this.db.collection('posts').add(data)
    .then(refDoc => {
      console.log(`Id del Post: ${refDoc.id}`)
    })
    .catch(error => {
      console.log(`Error al crear el post: ${error}`)
    })
  }

  consultarTodosPost () {
    // Nos Suscribirnos a la colección post para ser notificados en tiempo real sobre cambios en sus documentos
    // La primera vez se ejecuta para obtner todos los docuemtnos, pero posteriormente
    // Cuando algo cambia, este oyente se vuelve activar, y nos devuelve un snapshot con los cambios sucedidos en la coleccion
    // Añadir, Eliminar, Modificar
    // 
    // Para consultar más rápido los datos, firestore crea indices por cada campo en la colección
    // sin embargo, cuando el filtro requiere mas de un campo, se necesita crear indices compuestos.
    // Para ello se colocan las condiciones, y en la consola del navegador, ver el error y
    // proceder a dar clic en solucionarlo para que nos envie a la consola de firebase y lo cree automáticamente
    this.db.collection('posts')
      .orderBy('fecha', 'desc')
      .orderBy('titulo', 'asc')
      .onSnapshot(newSnapshot => {
      //Eliminar los posts de la página para volverlos a pintar
      $('#posts').empty()
      // Verificar si el nuevo snapshot esta vació
      if(newSnapshot.empty) {
        // Pintamos la página (seccion id posts) con un template HTML predeterminado
        $('#posts').append(this.obtenerTemplatePostVacio())
      } else {
        // Si hay data en el snapshot entonces la recorremos una a una
        newSnapshot.forEach(post => {
          // Por cada documento en la colección posts invocamos al método 
          // obtenerPostTemplate para pintar su data en pantalla
          // La data pasada como parametro es interpolada internamente en el plantilla
          let postHTML = this.obtenerPostTemplate(
            // Para recuperar la data del docuemento actual, invoco al método data( )
            // el cual retorna un JSON y así puedo acceder a sus atributos
            post.data().autor,
            post.data().titulo,
            post.data().descripcion,
            post.data().videoLink,
            post.data().imagenLink,
            // Las fechas las retorna en timestamp, entonces invocamos una utilidad
            // para procesar la fecha y retornarlo en otro formato
            // Se encientra en el archivo JS de utilidad
            Utilidad.obtenerFecha(post.data().fecha),
          )
          // Ahora añadirmos el marcado interpolado y retornado por el método 
          // obtenerPostTemplate a la página mediante jquery
          $('#posts').append(postHTML)
        })
      }
    })
  }

  consultarPostxUsuario (emailUser) {
    // En esta sección no me interesa escuchar cambios en tiempo real, por tanto
    // solo consulto una vez. Sin embargo este método se activa cuando
    // se visita ver post del usuario. Por tanto cada vez que se presione se lleva a cabo la consulta
    
    // COmo está estructurado el proyecto, esta instrucción en apriencia no sirve
    // ya que como hay un oyente en la coleccion posts, por mas que le indique
    // que solo consulte una vez, el oyente esta escuhcanfo y actualizando la data.
    // 
    // // Para consultar más rápido los datos, firestore crea indices por cada campo en la colección
    // sin embargo, cuando el filtro requiere mas de un campo, se necesita crear indices compuestos.
    // Para ello se colocan las condiciones, y en la consola del navegador, ver el error y
    // proceder a dar clic en solucionarlo para que nos envie a la consola de firebase y lo cree automáticamente
    this.db.collection('posts')
      .orderBy('fecha', 'asc')
      .orderBy('titulo', 'desc')
      .where('autor', '==', emailUser).get()
      .then(snapshot => {
        //Eliminar los posts de la página para volverlos a pintar
        $('#posts').empty()
        // Verificar si el nuevo snapshot esta vació
        if(snapshot.empty) {
          // Pintamos la página (seccion id posts) con un template HTML predeterminado
          $('#posts').append(this.obtenerTemplatePostVacio())
        } else {
          // Si hay data en el snapshot entonces la recorremos una a una
          snapshot.forEach(post => {
            // Por cada documento en la colección posts invocamos al método 
            // obtenerPostTemplate para pintar su data en pantalla
            // La data pasada como parametro es interpolada internamente en el plantilla
            let postHTML = this.obtenerPostTemplate(
              // Para recuperar la data del docuemento actual, invoco al método data( )
              // el cual retorna un JSON y así puedo acceder a sus atributos
              post.data().autor,
              post.data().titulo,
              post.data().descripcion,
              post.data().videoLink,
              post.data().imagenLink,
              // Las fechas las retorna en timestamp, entonces invocamos una utilidad
              // para procesar la fecha y retornarlo en otro formato
              // Se encientra en el archivo JS de utilidad
              Utilidad.obtenerFecha(post.data().fecha),
            )
            // Ahora añadirmos el marcado interpolado y retornado por el método 
            // obtenerPostTemplate a la página mediante jquery
            $('#posts').append(postHTML)
          })
        }
      })
      .catch(error => {
        console.log(`Error al consultar una vez los datos ${error}`)
      })
  }

  subirImagenPost (file, uid) {
    // Crear una referencia al servicio de storage de firebase
    // La referencia espera el path para almacenar el archivo.
    // imagesPosts/idusuariologeado/nombrearchvivo.extension
    const refStorage = firebase.storage().ref(`imagesPosts/${uid}/${file.name}`)
    // Indicar a storage que suba el archivo.
    // Esto nos retorna una tarea asincrona, que podemos inspeccionar sobre su estado actual
    const task = refStorage.put(file);
    // Inspeccionar la tarea o proceso de subida de archivo
    task.on('state_changed', 
      snapshot => {
        // El primer parametro indica el progreso actual de subida de la imagen
        const porcentaje = snapshot.bytesTransferred / snapshot.totalBytes * 100
        $('.determinate').attr('style', `width: ${porcentaje}%`)
      },
      error => {
        // El segundo parametro es una función que se ejecuta si ha sucedido un error
        Materialize.toast(`Error al subir el archivo: ${error}`, 4000)
        console.log(error)
      },
      () => {
        // El tercer parametro es una funcion de exito de subuida
        // Como la tarea ha sido completada, accedemos a dicha instantanea, apuntamos a su referencia y obtenemos su URL de descarga
        task.snapshot.ref.getDownloadURL()
          .then(url => {
            console.log(url)
            // Una vez que se resuelve la promesa de obtener la URL de descarga del recurso subido
            // guardamos en sessionStorage del navegador una referencia hacia esa URL para posterormente utiliarla
            // y guardarla en la base de datos. (es un intermediario)
            sessionStorage.setItem('imgNewPost', url)
          })
          .catch(error => {
            // En caso de que la promesa falle, informamos de lo sucedido
            Materialize.toast(`Error al obtener la URL de descarga ${error}`, 4000)
          })
      }
    )

  }

  obtenerTemplatePostVacio () {
    return `<article class="post">
      <div class="post-titulo">
          <h5>Crea el primer Post a la comunidad</h5>
      </div>
      <div class="post-calificacion">
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-vacia" href="*"></a>
      </div>
      <div class="post-video">
          <iframe type="text/html" width="500" height="385" src='https://www.youtube.com/embed/bTSWzddyL7E?ecver=2'
              frameborder="0"></iframe>
          </figure>
      </div>
      <div class="post-videolink">
          Video
      </div>
      <div class="post-descripcion">
          <p>Crea el primer Post a la comunidad</p>
      </div>
      <div class="post-footer container">         
      </div>
  </article>`
  }

  obtenerPostTemplate (autor, titulo, descripcion, videoLink, imagenLink, fecha) {
    if (imagenLink) {
      return `<article class="post">
            <div class="post-titulo">
                <h5>${titulo}</h5>
            </div>
            <div class="post-calificacion">
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-vacia" href="*"></a>
            </div>
            <div class="post-video">                
                <img id="imgVideo" src='${imagenLink}' class="post-imagen-video" 
                    alt="Imagen Video">     
            </div>
            <div class="post-videolink">
                <a href="${videoLink}" target="blank">Ver Video</a>                            
            </div>
            <div class="post-descripcion">
                <p>${descripcion}</p>
            </div>
            <div class="post-footer container">
                <div class="row">
                    <div class="col m6">
                        Fecha: ${fecha}
                    </div>
                    <div class="col m6">
                        Autor: ${autor}
                    </div>        
                </div>
            </div>
        </article>`
    }

    return `<article class="post">
                <div class="post-titulo">
                    <h5>${titulo}</h5>
                </div>
                <div class="post-calificacion">
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-vacia" href="*"></a>
                </div>
                <div class="post-video">
                    <iframe type="text/html" width="500" height="385" src='${videoLink}'
                        frameborder="0"></iframe>
                    </figure>
                </div>
                <div class="post-videolink">
                    Video
                </div>
                <div class="post-descripcion">
                    <p>${descripcion}</p>
                </div>
                <div class="post-footer container">
                    <div class="row">
                        <div class="col m6">
                            Fecha: ${fecha}
                        </div>
                        <div class="col m6">
                            Autor: ${autor}
                        </div>        
                    </div>
                </div>
            </article>`
  }
}
