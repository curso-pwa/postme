const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.addPost = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  // Despues de guardar algo, almacenar en otro lugar elastic nuestros datos ...
  response.send("Hello from Firebase!");
});
