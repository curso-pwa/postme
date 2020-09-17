/* Declaracion de variables globales */
let MAIN;
let MODAL_POST;
let BTN_SHOW_POST;
let BTN_CANCEL_POST;
let deferredPrompt;
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

  if ('serviceWorker' in navigator) {
    const response = await navigator.serviceWorker.register('sw.js');
    if (response) {
      console.info('Service worker registrado');
    }
  }

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


});