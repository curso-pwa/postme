/* Declaracion de variables globales */
let MAIN;
let MODAL_POST;
let BTN_SHOW_POST;
let BTN_CANCEL_POST;
let deferredPrompt;
let TITLE;
let DESCRIPTION;
let DB_POUCH;
let BTN_NOTIFICATIONS;
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
      const post = {
        title: TITLE,
        description: DESCRIPTION,
      }
      // Vamos a utilizar el SyncManager
      if (window.SyncManager) {
        // Grabar o armar nuestra logica
        const readySW = await navigator.serviceWorker.ready;
        await readySW.sync.register('new-post');
        post._id = new Date().toISOString();
        await DB_POUCH.put(post);
      } else {
        post.timestamp = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection('posts').add(post);
      }
      const data = {
        message: 'Registro exitosamente almacenado',
        timeout: 5000
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


const showNotification = () => {
  // new Notification('Notificaciones exitosamente activadas');
  navigator.serviceWorker.getRegistration()
    .then(instancia => {
      instancia.showNotification('Notificaciones exitosamente activadas para el dispositivo', {
        body: 'El cuerpo de la notificacion',
        icon: 'src/images/icons/icon-144x144.png',
        image: 'src/images/computer.jpg',
        badge: 'src/images/icons/icon-144x144.png',
        dir: 'ltr',
        tag: 'notification-postme',
        requireInteraction: true,
        vibrate: [100, 50, 200],
        actions: [
          { action: 'confirm', title: 'Aceptar', icon: 'src/images/icons/icon-144x144.png' },
          { action: 'cancel', title: 'Cancelar', icon: 'src/images/icons/icon-144x144.png' }
        ]
      });
    })
    .catch(err => console.error(err.message))
};

const urlBase64ToUint8Array = (base64String) => {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const configuracionSubscripcion = () => {
  if (navigator.serviceWorker) {
    let reg;
    navigator.serviceWorker.ready
     .then(sw => {
       reg = sw;
       return sw.pushManager.getSubscription()
     })
     .then(sub => {
       // hemos ejecutado web-push generate-vapid-keys
       var vapidPublicKey = 'BIqqiuWGzixlngOzbQE9pv6QSNgL08vy132Ss-Fi96bcpcWj9FMmSOIxU4N9NyjmzSig3gWQ-FiuuVJnyhX7nKA';
       var convertedublicKeyToVapid = urlBase64ToUint8Array(vapidPublicKey);
       return reg.pushManager.subscribe({
         userVisibleOnly: true,  // Que la notificacion entrante sea visible
         applicationServerKey: convertedublicKeyToVapid
       })
     })
     .then(res => {
       const urlRD = '/subscribe';
       return fetch(urlRD, {
         method: 'POST',
         cors: 'no-cors',
         headers: {
           'Content-Type': 'application/json',
           'Accept': 'application/json'
         },
         body: JSON.stringify(res)
       })
     })
     .then(() => {})// showNotification())
     .catch(err => console.error(err.message))
  }
}


const requestPermission = async () => {
  const result = await Notification.requestPermission();
  if (result !== 'granted') {
    const data = {
      message: 'El usuario no activo las notificaciones',
      timeout: 5000
    };
    Message('error').MaterialSnackbar.showSnackbar(data);
  } else {
    configuracionSubscripcion();
    // showNotification();
  }
};


window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Cuando se cargue todo nuestro DOM
window.addEventListener('load', async () => {
  try {
    // Declarando mi instancia de base de datos creada por PouchDB
    DB_POUCH = new PouchDB('posts');

    MAIN = document.querySelector('#main');
    MODAL_POST = document.querySelector('#modal-post-section');
    BTN_SHOW_POST = document.querySelector('#btn-upload-post');
    BTN_SHOW_POST.addEventListener('click', showPostModal);
    BTN_CANCEL_POST = document.querySelector('#btn-post-cancel');
    BTN_CANCEL_POST.addEventListener('click', closePostModal);
  
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('sw.js');
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
  
    // Seccion notificaciones
    BTN_NOTIFICATIONS = document.querySelector('#notifications-install');
    BTN_NOTIFICATIONS.addEventListener('click', requestPermission);
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
  } catch (error) {
    const data = {
      message: error.message,
      timeout: 5000
    };
    Message('error').MaterialSnackbar.showSnackbar(data);
  }
});