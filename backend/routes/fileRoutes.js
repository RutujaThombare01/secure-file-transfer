const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const router = express.Router();
const upload = require("../middlewares/upload"); // ✅ Use the middleware file

const UPLOADS_DIR = path.join(__dirname, "../uploads");

// ✅ Upload Route
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    console.log("Upload API hit");

    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    console.log("Received file:", file);

    const token = jwt.sign(
      { filename: file.filename },
      process.env.JWT_SECRET,
      { expiresIn: "60s" } // 1-minute expiration
    );

    const accessLink = `${process.env.CLIENT_DOMAIN}/view/${token}`;
    return res.json({ success: true, accessLink });

  } catch (err) {
    console.error("Error in upload route:", err);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// ✅ File Access Route
router.get("/access/:token", (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const filename = decoded.filename;
    const filePath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found or already deleted.");
    }

    return res.sendFile(filePath);
  } catch (err) {
    console.error("Access error:", err);
    return res.status(403).send("ForbiddenError: Invalid or Expired Link");
  }
});

module.exports = router;
