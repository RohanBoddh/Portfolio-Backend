const express = require("express");

const {
  createContact,
  getContacts,
  updateContactStatus,
} = require("../controllers/contactController");

const router = express.Router();

router.post("/", createContact);
router.get("/", getContacts);
router.patch("/:id/status", updateContactStatus);

module.exports = router;