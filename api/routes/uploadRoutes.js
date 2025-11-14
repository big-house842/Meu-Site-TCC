const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // ✅ APENAS UMA VEZ
const uploadController = require('../controllers/uploadController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.uploadFolder || 'uploads';
    const dest = path.join(__dirname, '..', folder);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error('Apenas imagens (jpeg/jpg/png/webp) são permitidas'));
  }
});

const setFolder = (folder) => (req, res, next) => {
  req.uploadFolder = folder;
  const fs = require('fs');
  const dir = path.join(__dirname, '..', folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  next();
};

router.post('/upload/artistas', setFolder('uploads/artistas'), upload.single('file'), uploadController.uploadSingle);
router.post('/upload/artigos', setFolder('uploads/artigos'), upload.single('file'), uploadController.uploadSingle);

module.exports = router;