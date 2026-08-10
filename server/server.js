const app = require("./src/app");
const connectDB = require("./src/database/mongodb");
const env = require("./src/config/env");

const PORT = env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();