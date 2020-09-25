/* Declaracion de variables globales */
let MAIN;
let MODAL_POST;
let BTN_SHOW_POST;
let BTN_CANCEL_POST;
let deferredPrompt;
let TITLE;
let DESCRIPTION;
// Funciones
const showPostModal = () => {
  MAIN.style.display = 'none';
  MODAL_POST.style.display = 'block';
  setTimeout(() => {
    MODAL_POST.style.transform = 'translateY(0)';
  }, 1);
};
const closePostModal = () => {
  MAIN.style.display = 'block';
  MODAL_POST.style.transform = 'translateY(100vh)';
};

const sendData = async (e) => {
  try {
    e.preventDefault();
    TITLE = document.querySelector('#title').value;
    DESCRIPTION = document.querySelector('#description').value;
    if (TITLE && DESCRIPTION) {
      await db.collection('posts').add({
        title: TITLE,
        description: DESCRIPTION,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      const data = {
        message: 'Registro exitosamente almacenado',
        timeout: 1500  // 1 con 30
      };
      Message().MaterialSnackbar.showSnackbar(data);
    } else {
      const data = {
        message: 'Faltan campos por llenar',
        timeout: 1500
      };
      Message('error').MaterialSnackbar.showSnackbar(data);
    }
  } catch (error) {
    const data = {
      message: error.message,
      timeout: 1500
    };
    Message('error').MaterialSnackbar.showSnackbar(data);
  }
};


window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Cuando se cargue todo nuestro DOM
window.addEventListener('load', async () => {
  MAIN = document.querySelector('#main');
  MODAL_POST = document.querySelector('#modal-post-section');
  BTN_SHOW_POST = document.querySelector('#btn-upload-post');
  BTN_SHOW_POST.addEventListener('click', showPostModal);
  BTN_CANCEL_POST = document.querySelector('#btn-post-cancel');
  BTN_CANCEL_POST.addEventListener('click', closePostModal);

  // await Notification.requestPermission();

  if ('serviceWorker' in navigator) {
    const response = await navigator.serviceWorker.register('sw.js');
    if (response) {
      const ready = await navigator.serviceWorker.ready;
      // ready.showNotification('Hola curso-pwa..', {
      //   body: 'Este sera un mensaje mas largo',
      //   vibrate: [200, 100, 200, 100, 200, 100, 200]
      // });
    }
  }

  window.Message = (option = 'success', container = document.querySelector('#toast-container')) => {
    container.classList.remove('success');
    container.classList.remove('error');
    container.classList.add(option);
    return container;
  };

  window.Loading = (option = 'block') => {
    document.querySelector('#loading').style.display = option;
  };


  // Agarrando el boton enviar post
  const btnPostSubmit = document.querySelector('#btn-post-submit');
  btnPostSubmit.addEventListener('click', (e) => sendData(e));

  const bannerInstall = document.querySelector('#banner-install');
  bannerInstall.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const response = await deferredPrompt.userChoice;
      if (response.outcome === 'dismissed') {
        console.error('El usuario cancelo la instalación');
      }
    }
  });

  // IndexDB
  // if ('indexedDB' in window) {
  //   const request = window.indexedDB.open('mi-base-datos', 2);

  //   // Observer 
  //   request.onupgradeneeded = event => {
  //     let db = event.target.result;
  //     db.createObjectStore('cursos', {
  //       keyPath: 'id'
  //     });
  //   };
  //   // Errores

  //   request.onerror = (event) => {
  //     console.log('----------Esto cuando ocurrira cualquier cosa que no tengamos en cosideracion-----------');
  //     console.log(event);
  //     console.log('------------------------------------');
  //   };
    // Success

    // request.onsuccess = (event) => {

    //   // Agregar
    //   let db = event.target.result;
      
    //   const cursosData = [
    //     {
    //       id: '1',
    //       curso: 'Mi primera PWA',
    //       descripcion: 'Este sera un curso para trabajar offline'
    //     },
    //     {
    //       id: '2',
    //       curso: 'React Avanzado',
    //       descripcion: 'Curso de react con puro hooks'
    //     },
    //     {
    //       id: '3',
    //       curso: 'Vue Avanzado',
    //       descripcion: 'Curso en el cual veremos un clon de youtube'
    //     }
    //   ];

    //   let cursosTransaccion = db.transaction('cursos', 'readwrite');

    //   // Ocurre un error en la transaccion
    //   cursosTransaccion.onerror = (event) => {
    //     console.error('[IDB]', event.target.error );
    //   };

    //   // Informa sobre el éxito de la transacción
    //   cursosTransaccion.oncomplete = event => {
    //     console.info('[IDB]', event);
    //   }; 

    //   let cursosStore = cursosTransaccion.objectStore('cursos');
      
    //   for ( let curso of cursosData ) {
    //     cursosStore.add( curso );
    //   }
      
    //   cursosStore.onsuccess = event => {
    //     console.info('Nuevo curso agregado al IDB');
    //   };
    // };

  // }

});