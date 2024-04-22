require("./nodejs/Database/mongoose");
const express = require("express");
const cookie = require("cookie-parser");
const multer = require("multer");
const imageModel = require("./nodejs/Database/models/image.model");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const app = express();
const PORT = 3000;

//MiddleWare:
app.use(cookie());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/css", express.static("css"));
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use("/js", express.static(path.join(__dirname, "/js")));
//This is view type:
app.set("view engine", "ejs");

app.use(authRoutes);

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cd(null, file.originalname);
  },
});
const upload = multer({
  storage: Storage,
}).single("testImage");

app.get("/", (req, res) => {
  res.render("upload");
});

app.post("/", async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newImage = new imageModel({
        name: req.body.name,
        image: {
          data: req.filename,
          contentType: "image/png",
        },
      });
     newImage.create().then(() => {
          res.send("Successfully added");
     }).catch((err) => {
          res.send(err);
     });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
