// config/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage configuration for Pandit profile photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/pandits');
    fs.mkdirSync(dir, { recursive: true }); // Ensure uploads/pandits exists
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
