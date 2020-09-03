const express = require("express");

const project = require("../controllers/project");

const { accessLevel } = require("../controllers/auth");

const {
  upload,
  cloudinaryResizeAndUploadImage
} = require("../utils/imageUpload");
const { checkToken } = require("../utils/jwt");

const router = express.Router();

router
  .route("/")
  .get(project.getAllProjects)
  .post(
    checkToken,
    accessLevel("root", "admin"),
    upload.single("image"),
    cloudinaryResizeAndUploadImage,
    project.createProject
  );

router
  .route("/:id")
  .get(project.getProject)
  .patch(
    checkToken,
    accessLevel("root", "admin"),
    upload.single("image"),
    cloudinaryResizeAndUploadImage,
    project.updateProject
  )
  .delete(checkToken, accessLevel("root", "admin"), project.deleteProject);

module.exports = router;
