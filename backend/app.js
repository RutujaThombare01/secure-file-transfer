const express = require("express");
const dotenv = require("dotenv");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

dotenv.config(); // ✅ Load environment variables first

const app = express();
const fileRoutes = require("./routes/fileRoutes"); // ✅ Declare only once

// Middleware

app.use(cors({
  origin: "*", // Allow requests from anywhere
}));


// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/files", fileRoutes);

// CRON: Delete expired files every minute
cron.schedule("* * * * *", () => {
  const dir = path.join(__dirname, "uploads");
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const age = (Date.now() - stats.ctimeMs) / (60 * 1000); // age in minutes
    if (age > parseInt(process.env.EXPIRE_MINUTES)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted expired file: ${file}`);
    }
  });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

