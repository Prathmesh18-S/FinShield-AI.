const bcrypt = require("bcryptjs");
const connectDB = require("../src/database/mongodb");
const Admin = require("../src/models/Admin");

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({
      email: "admin@finshield.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new Admin({
      name: "Prathmesh Solunke",
      email: "admin@finshield.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("✅ Admin created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createAdmin();