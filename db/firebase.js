const firebase = require("firebase/app");
const storeg = require("firebase/storage");

const firebaseapp = firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.process.env.FIREBASE_API_KEY,
  storageBucket: process.env.FIREBASE_STOREGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_API_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
});

module.exports = { storeg: storeg.getStorage(firebaseapp) };
