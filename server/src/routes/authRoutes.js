const express = require("express");
const router = express.Router();

const { loginAdmin, checkSetupStatus, setupFirstAdmin } = require("../controllers/authController");

router.post("/login", loginAdmin);
router.get("/setup-status", checkSetupStatus);
router.post("/setup", setupFirstAdmin);

module.exports = router;