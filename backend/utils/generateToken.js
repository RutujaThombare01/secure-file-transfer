// backend/utils/generateToken.js
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;



const generateToken = (filename) => {
  return jwt.sign({ filename }, process.env.JWT_SECRET, { expiresIn: "10m" });
};




const verifyToken = (req, res, next) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const filePath = path.join(__dirname, "../uploads", decoded.filename);
    req.filePath = filePath;
    next();
  } catch (err) {
    res.status(403).send("Forbidden");
  }
};

module.exports = { generateToken, verifyToken };
