require("./nodejs/Database/mongoose");
const express = require("express");
const cookie = require("cookie-parser");
const imageModel = require("./nodejs/Database/models/image.model");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const { mongo } = require("mongoose");
const { MongoClient, GridFSBucket } = require("mongodb");
const multer = require("multer");
// const { GridFsStorage } = require('multer-gridfs-storage');
const app = express();
app.use(express.json());
// require("dotenv").config();
const PORT = 3000;
//const db = client.db(dbName);
//const bucket = new mongodb.GridFSBucket(db);

//MiddleWare:
app.use(cookie());
app.use(express.urlencoded({ extended: true }));

app.use("/css", express.static("css"));
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use("/js", express.static(path.join(__dirname, "/js")));

//This is view type:
app.set("view engine", "ejs");

app.use(authRoutes);

const url = process.env.MONGO_DB_URL;


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
