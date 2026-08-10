const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new Error("Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, admin.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: admin._id,
      role: admin.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );

  return {
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
    token,
  };
};

const checkSetupStatus = async () => {
  const count = await Admin.countDocuments();
  return { isSetupRequired: count === 0 };
};

const setupFirstAdmin = async (adminData) => {
  const count = await Admin.countDocuments();
  if (count > 0) {
    throw new Error("Initialization failed: An administrator already exists.");
  }

  const { firstName, lastName, organization, email, password } = adminData;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await Admin.create({
    name: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    role: 'Admin', // First user is always Super Admin
    organization
  });

  return {
    id: newAdmin._id,
    name: newAdmin.name,
    email: newAdmin.email,
    role: newAdmin.role
  };
};

module.exports = {
  loginAdmin,
  checkSetupStatus,
  setupFirstAdmin
};