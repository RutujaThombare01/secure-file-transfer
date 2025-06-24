const express = require("express");
const dotenv = require("dotenv");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

dotenv.config();
const app = express();

// ✅ Create uploads folder before using it
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log("✅ uploads/ folder created");
}

// Middleware
app.use(cors({ origin: process.env.CLIENT_DOMAIN }));
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(UPLOADS_DIR));

// Routes
const fileRoutes = require("./routes/fileRoutes");
app.use("/api/files", fileRoutes);

// 🕒 CRON job to delete expired files
cron.schedule("* * * * *", () => {
  fs.readdirSync(UPLOADS_DIR).forEach(file => {
    const filePath = path.join(UPLOADS_DIR, file);
    const stats = fs.statSync(filePath);
    const age = (Date.now() - stats.ctimeMs) / 60000; // in minutes
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
