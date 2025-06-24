const express = require("express");
const dotenv = require("dotenv");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

dotenv.config(); // Load environment variables first

const app = express();
const fileRoutes = require("./routes/fileRoutes");

// ✅ Ensure 'uploads' directory exists before anything else
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log("✅ uploads/ folder created");
}

// Middleware
app.use(cors({
  origin: "*", // Allow requests from anywhere
}));

// Serve uploaded files statically
app.use("/uploads", express.static(UPLOADS_DIR));

// Routes
app.use("/api/files", fileRoutes);

// ✅ CRON: Delete expired files every minute
cron.schedule("* * * * *", () => {
  fs.readdirSync(UPLOADS_DIR).forEach(file => {
    const filePath = path.join(UPLOADS_DIR, file);
    const stats = fs.statSync(filePath);
    const age = (Date.now() - stats.ctimeMs) / (60 * 1000); // age in minutes
    if (age > parseInt(process.env.EXPIRE_MINUTES)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted expired file: ${file}`);
    }
  });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
