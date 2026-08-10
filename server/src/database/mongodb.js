const mongoose = require("mongoose");
const dns = require("dns");
const env = require("../config/env");

const connectDB = async () => {
  try {
    // Fix: Node.js c-ares DNS resolver defaults to 127.0.0.1 on this system,
    // which has no DNS server listening, causing SRV lookups to fail with ECONNREFUSED.
    // Explicitly set public DNS servers to ensure MongoDB SRV records resolve correctly.
    dns.setServers(["8.8.8.8", "8.8.4.4"]);

    await mongoose.connect(env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;