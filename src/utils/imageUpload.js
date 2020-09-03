const fs = require("fs");
const path = require("path");

const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const { ErrorHandler } = require("./error");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let dir = "";

    dir = path.join(__dirname, "../temp");

    //with this multiple temp directories were being created
    // if (!fs.existsSync(dir)) {
    //   // Do something
    //   fs.mkdirSync(dir);
    // }

    cb(null, dir);
  },
  filename: function(req, file, cb) {
    console.log(file);
    cb(
      null,
      file.originalname.split(".")[0] +
        Date.now() +
        path.extname(file.originalname)
    ); //Appending extension
  }
});

// const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  var ext = path.extname(file.originalname);

  if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
    return cb(new ErrorHandler(400, "Only images are allowed 🖼"), false);
  }

  cb(null, true);
};

exports.upload = multer({ storage: storage, fileFilter });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//https://stackoverflow.com/questions/43701013/cloudinary-api-resolve-promise
//https://stackoverflow.com/questions/51014778/cloudinary-async-wait-upload-for-multiple-images-at-once-then-save-to-array-in-n

const cloudinaryPromise = async (image, dimensions = [640, 480]) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      image.path,
      { width: dimensions[0], height: dimensions[1], crop: "fill" },
      function(err, res) {
        console.log(err, res);
        if (res) {
          //https://stackoverflow.com/questions/41411604/how-to-delete-local-file-with-fs-unlink
          fs.unlink(image.path, err => {
            if (err) {
              console.log("failed to delete local image:" + err);
            } else {
              console.log("successfully deleted local image");
            }
          });

          resolve(res.secure_url);
        } else if (err) {
          console.error(err);
          //throw error in promise reject
          //https://stackoverflow.com/questions/21887856/should-an-async-api-ever-throw-synchronously
          //https://javascript.info/promise-basics
          reject(
            new ErrorHandler(500, `Failed to upload image to cloudinary. 🌩`)
          );
        }
      }
    );
  });
};

exports.cloudinaryResizeAndUploadImage = async (req, res, next) => {
  console.log(req.file);

  if (req.body.collection === "project") {
    if (req.method === "POST" && !req.file) {
      return next(
        new ErrorHandler(
          400,
          `When adding a new Category you have to upload images 💥`
        )
      );
      // return next();
    } else if (req.method === "PATCH" && !req.file) {
      //when editing a listing it is not compulsary to upload images
      return next();
    }

    //when I attached a then catch even with await it worked
    await cloudinaryPromise(req.file, [640, 480])
      .then(res => {
        req.body.image = res;
      })
      .catch(err => {
        console.log(err);
      });
  } else if (req.body.collection === "product") {
    if (req.method === "POST" && !req.file) {
      return next(
        new ErrorHandler(
          400,
          `When adding a new Product you have to upload images 💥`
        )
      );
      // return next();
    } else if (req.method === "PATCH" && !req.file) {
      //when editing a item it is not compulsary to upload images
      return next();
    }

    //when I attached a then catch even with await it worked
    await cloudinaryPromise(req.file, [640, 480])
      .then(res => {
        req.body.image = res;
      })
      .catch(err => {
        console.log(err);
      });
  } else if (
    !req.body.hasOwnProperty("collection") ||
    req.body.collection === undefined ||
    req.body.collection === null
  ) {
    return next(
      new ErrorHandler(
        400,
        `Please specify a collection property with values product or project 💥`
      )
    );
  }
  next();
};
