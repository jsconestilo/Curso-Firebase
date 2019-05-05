$(() => {
  $('#btnModalPost').click(() => {
    $('#tituloNewPost').val('')
    $('#descripcionNewPost').val('')
    $('#linkVideoNewPost').val('')
    $('#btnUploadFile').val('')
    $('.determinate').attr('style', `width: 0%`)
    sessionStorage.setItem('imgNewPost', null)

    // TODO: Validar que el usuario esta autenticado

    // Materialize.toast(`Para crear el post debes estar autenticado`, 4000)

    $('#modalPost').modal('open')
  })

  $('#btnRegistroPost').click((event) => {
    event.preventDefault();
    event.stopPropagation();
    // Creamos una instancia de la clase Post para registrar el documento
    const post = new Post()

    // TODO: Validar que el usuario esta autenticado
    const user = firebase.auth().currentUser
    if(user == null) {
      Materialize.toast(`Para crear el Post debes estar autenticado`, 4000)
      // Hacemos esto para que no se ejecute lo demas
      return
    }

    // Materialize.toast(`Para crear el post debes estar autenticado`, 4000)

    // Recuperar la data del formulario para crear el POST
    const titulo = $('#tituloNewPost').val()
    const descripcion = $('#descripcionNewPost').val()
    const videoLink = $('#linkVideoNewPost').val()
    // Cuando se sube una imagen, se guarda una referencia de su URL de descarga en sessionStorage del navegador
    // Por tanto, verificamos si hay contenido en el item imgNewPost del storage,
    // de ser correcto nos quedamos con ese valor para guardarlo en la base de datos
    // de lo contario, almacenamos null
    const imagenLink = sessionStorage.getItem('imgNewPost') == 'null' ? null : sessionStorage.getItem('imgNewPost')

    // Invocar el método crearPost para proceder a guardarlo
    post.crearPost(user.uid, user.email, titulo, descripcion, imagenLink, videoLink)
      .then(resp => {
        // En el cuerpo del método retornamos una promise
        // Por tanto la usamos aqui para realizar tareas posteriores al registro
        Materialize.toast(`Post creado correctamente`, 4000)
        // Cerrar el modal con el form de registro de post
        $('.modal').modal('close')

        // Por buenas prácticas debemos de borrar la URL del storage, ya que
        // si vuelve a publicar sin imagen, estaría relacionando el valor almacenado aun en el storage
        //sessionStorage.setItem('imgNewPost', null)
        //Sin embargo esta tarea la realiza desde le momento que abrimos el modal para crear el post
      })
      .catch(err => {
        Materialize.toast(`Error => ${err}`, 4000)
      })
  })

  $('#btnUploadFile').on('change', e => {
    // TODO: Validar que el usuario esta autenticado
    const user = firebase.auth().currentUser
    if (user) {
      // Acceder al contenido del control de formulario de tipo file
      const file = e.target.files[0]

      // TODO: Referencia al storage
      const post = new Post()
      post.subirImagenPost(file, user.uid)
    } else {
      Materialize.toast(`Para crear el post debes estar autenticado`, 4000)
    }



   
    
  })
})
