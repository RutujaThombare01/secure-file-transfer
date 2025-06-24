// ✅ UPDATED: fileRoutes.js
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    const file = req.file;

    // Set token expiry to 60 seconds (1 minute)
    const token = jwt.sign(
      { filename: file.filename },
      process.env.JWT_SECRET,
      { expiresIn: "60s" }
    );

    const accessLink = `${process.env.CLIENT_DOMAIN}/view/${token}`;

    return res.json({ success: true, accessLink });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
});

router.get("/access/:token", (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const filename = decoded.filename;
    const filePath = path.join(UPLOADS_DIR, filename);

    return res.sendFile(filePath);
  } catch (err) {
    return res.status(403).send("ForbiddenError: Invalid or Expired Link");
  }
});

module.exports = router;
