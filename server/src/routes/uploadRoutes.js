const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadCSV } = require("../controllers/uploadController");

// Protected CSV Upload Route
router.post("/", authenticate, upload.single("file"), uploadCSV);

module.exports = router;