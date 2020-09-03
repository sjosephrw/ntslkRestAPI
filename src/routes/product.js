const express = require("express");

const product = require("../controllers/product");

const { accessLevel } = require("../controllers/auth");

const {
  upload,
  cloudinaryResizeAndUploadImage
} = require("../utils/imageUpload");
const { checkToken } = require("../utils/jwt");

const router = express.Router();

router
  .route("/")
  .get(product.getAllProducts)
  .post(
    checkToken,
    accessLevel("root", "admin"),
    upload.single("image"),
    cloudinaryResizeAndUploadImage,
    product.createProduct
  );

router
  .route("/:id")
  .get(product.getProduct)
  .patch(
    checkToken,
    accessLevel("root", "admin"),
    upload.single("image"),
    cloudinaryResizeAndUploadImage,
    product.updateProduct
  )
  .delete(checkToken, accessLevel("root", "admin"), product.deleteProduct);

module.exports = router;
