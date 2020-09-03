const express = require("express");

const category = require("../controllers/category");

const { accessLevel } = require("../controllers/auth");

const { checkToken } = require("../utils/jwt");

const router = express.Router();

// router.param('id', listingController.checkID);

//https://stackoverflow.com/questions/40215527/file-upload-with-multer-that-contains-input-name-array

router
  .route("/")
  .get(category.getAllCategories)
  .post(checkToken, accessLevel("root", "admin"), category.createCategory);

router
  .route("/:id")
  .get(category.getCategory)
  .patch(checkToken, accessLevel("root", "admin"), category.updateCategory)
  .delete(checkToken, accessLevel("root", "admin"), category.deleteCategory);

module.exports = router;
