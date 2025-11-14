const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // ✅ APENAS UMA VEZ
const artistaController = require('../controllers/artistaController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads', 'artistas')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`)
});

const upload = multer({ storage, limits: { fileSize: 5*1024*1024 } });

router.post('/', upload.single('image'), artistaController.create);
router.get('/', artistaController.getAll);
router.get('/:id', artistaController.getById);
router.put('/:id', upload.single('image'), artistaController.update);
router.delete('/:id', artistaController.delete);

module.exports = router;