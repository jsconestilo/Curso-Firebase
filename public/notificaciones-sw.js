importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-messaging.js')


/* Un service worked nos permite enviar notificaciones a los usuarios
sin que esten presentes en la página en ese momento. Es como un hilo

foreground esta presente en la página (no requiere service worker)
background no esta presente en la página (navegador cerrado)*/

/*
// Init Firebase nuevamente con los datos de configuración (ver archivo ConfigFirebase.js)
firebase.initializeApp({
	projectId: "blogeek-platzi-e39ef",
  	messagingSenderId: "494562078979"
});

const messaging = firebase.messaging()

// TODO: Recibir las notificaciones cuando el usuario esta background
// Estas se agregan dentro del service worker
  // 
// Establecemos la notificación push que se enviará al navegador
messaging.setBackgroundMessageHandler(payload => {
	const tituloNotificacion = 'Ya tenemos una nuevo post',
	const opcionesNotificacion = {
		body: payload.data.titulo,
		icon: 'icons/icon_new_post.png',
		click_action: 'https://blogeek-platzi-e39ef.firebaseapp.com/'
	}

	// Ahora le indicamos a la ventana que muestre la notificación
	// Esto se encuentra estandarizado como Push API para los navegadores
	return self.registration.showNotification({
		tituloNotificacion,
		opcionesNotificacion
	})
})

*/