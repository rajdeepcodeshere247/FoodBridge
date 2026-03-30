// Multer — handles multipart/form-data (food image uploads)
// Docs: https://github.com/expressjs/multer
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadsDir } = require('./uploads-path.config');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  /\.(jpeg|jpg|png|webp)$/.test(ext) ? cb(null, true) : cb(new Error('Images only'));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 3 * 1024 * 1024 } });
