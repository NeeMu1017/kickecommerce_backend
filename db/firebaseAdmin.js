const admin = require("firebase-admin");
const serviceAccount = require("./kickecommerce-8ff60-firebase-adminsdk-5r8y8-e8dc3b32d4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket : 'gs://kickecommerce-8ff60.appspot.com'
});
const db = admin;
module.exports = db;
