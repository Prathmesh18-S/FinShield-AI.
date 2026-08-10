const authService = require("../services/authService");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginAdmin(email, password);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const checkSetupStatus = async (req, res) => {
  try {
    const result = await authService.checkSetupStatus();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const setupFirstAdmin = async (req, res) => {
  try {
    const result = await authService.setupFirstAdmin(req.body);
    res.status(201).json({
      success: true,
      message: "First administrator created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  loginAdmin,
  checkSetupStatus,
  setupFirstAdmin
};