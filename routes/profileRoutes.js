const express = require("express");

const {
  getProfile,
  createProfile,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/", getProfile);
router.post("/", createProfile);

module.exports = router;