const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({
    status: "success",
    msg: "All user data"
  });
});

router.post("/", (req, res, next) => {
  res.json({
    status: "success",
    msg: "User created"
  });
});

router.get("/:id", (req, res, next) => {
  res.json({
    status: "success",
    msg: "Get one user"
  });
});

router.patch("/:id", (req, res, next) => {
  res.json({
    status: "success",
    msg: "User updated"
  });
});

router.delete("/:id", (req, res, next) => {
  res.json({
    status: "success",
    msg: "user deleted"
  });
});

module.exports = router;
