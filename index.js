// Empezando a trabajar con nodejs, express, bodyParser y web-push
const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const publicVapidKey = 'BIqqiuWGzixlngOzbQE9pv6QSNgL08vy132Ss-Fi96bcpcWj9FMmSOIxU4N9NyjmzSig3gWQ-FiuuVJnyhX7nKA';
const privateVapidKey = 'nG8GFt6CaylPLMxSD9LYta3fxo9PEmGXyLLL8JNhZ9w';

webPush.setVapidDetails('mailto:curso.apps.pwa@gmail.com', publicVapidKey, privateVapidKey);

app.get('/', (req, res) => {
  res.send('Funcionando correctamente...');
});

app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  res.status(201).json({});

  const payload = JSON.stringify({
    title: 'Notificaciones desde tu backend',
    body: 'Este es el cuerpo de la notificacion pero desde un backend'
  });

  webPush.sendNotification(subscription, payload)
    .catch(error => console.error(error));
});


app.set('port', process.env.PORT || 5000);
const server = app.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en ${server.address().port}`);
});