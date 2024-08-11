const express = require("express");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const route = express.Router();
const admin = require("../../db/firebaseAdmin");
const { getDownloadURL } = require("firebase/storage");

const docref = admin.firestore().collection("Products");
const bucket = admin.storage().bucket();

const upload = multer({
  storage: multer.memoryStorage(),
});

route.get("/", async (req, res) => {
  try {
    const products = await docref.get();
    const data = products.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

route.post("/", upload.single("image"), async (req, res) => {
  const { name, description, price, category, quantity } = req.body;

  try {
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).send({ message: "Please upload an image" });
    }

    const imageUrl = await uploadImageAndGetUrl(file);

    await docref.add({
      name,
      description,
      price,
      category,
      image: imageUrl,
      quantity,
      id: uuidv4(),
    });

    res.send({ message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

async function uploadImageAndGetUrl(file) {
  const fileName = `images/${Date.now()}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  const metadata = {
    contentType: file.mimetype,
  };

  return new Promise((resolve, reject) => {
    const blobStream = fileUpload.createWriteStream({
      metadata: metadata,
    });

    blobStream.on("error", (error) => {
      reject(error);
    });

    blobStream.on("finish", () => {
      fileUpload
        .getSignedUrl({
          action: "read",
          expires: "03-09-2200",
        })
        .then((downloadURLs) => {
          resolve(downloadURLs[0]);
        })
        .catch((error) => {
          reject(error);
        });
    });

    blobStream.end(file.buffer);
  });
}

module.exports = route;
