const express = require("express");
const dotenv = require("dotenv");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

dotenv.config();
const app = express();

const UPLOADS_DIR = path.join(__dirname, "uploads");

// ✅ Synchronously ensure 'uploads' exists before anything else
try {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log("✅ uploads/ folder checked or created");
} catch (err) {
  console.error("❌ Error ensuring uploads folder:", err);
}

// Middleware
app.use(cors({ origin: process.env.CLIENT_DOMAIN }));
app.use(express.json());

// Static file serving
app.use("/uploads", express.static(UPLOADS_DIR));

// Routes
const fileRoutes = require("./routes/fileRoutes");
app.use("/api/files", fileRoutes);

// CRON for deleting expired files
cron.schedule("* * * * *", () => {
  try {
    fs.readdirSync(UPLOADS_DIR).forEach(file => {
      const filePath = path.join(UPLOADS_DIR, file);
      const stats = fs.statSync(filePath);
      const age = (Date.now() - stats.ctimeMs) / 60000;
      if (age > parseInt(process.env.EXPIRE_MINUTES)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted expired file: ${file}`);
      }
    });
  } catch (err) {
    console.error("🛑 CRON error:", err.message);
  }
});

// Server start
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
