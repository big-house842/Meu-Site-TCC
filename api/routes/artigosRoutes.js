const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // ✅ APENAS UMA VEZ
const artigoController = require('../controllers/artigoController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/artigos';
    
    if (file.fieldname === 'imagemArtista') folder = 'uploads/artistas';
    if (file.fieldname.includes('autor')) folder = 'uploads/autores';
    if (file.fieldname === 'verbete') folder = 'uploads/verbete';
    if (file.fieldname === 'premiacoes') folder = 'uploads/premiacoes';
    if (file.fieldname === 'imagens') folder = 'uploads/artigos_imagens';
    
    cb(null, path.join(__dirname, '..', folder));
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`)
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 10*1024*1024 }
});

// ✅ CORREÇÃO: Rota para artigos completos - DEVE vir antes das rotas padrão
router.post('/artigos-completos', upload.fields([
  { name: 'imagemArtista', maxCount: 1 },
  { name: 'verbete', maxCount: 1 },
  { name: 'premiacoes', maxCount: 1 },
  { name: 'imagens', maxCount: 10 },
  { name: 'autores[0][imagem]', maxCount: 1 },
  { name: 'autores[1][imagem]', maxCount: 1 },
  { name: 'autores[2][imagem]', maxCount: 1 }
]), artigoController.createCompleto);

// Rotas padrão
router.post('/', upload.single('image'), artigoController.create);
router.get('/', artigoController.getAll);
router.get('/:id', artigoController.getById);
router.put('/:id', upload.single('image'), artigoController.update);
router.delete('/:id', artigoController.delete);

module.exports = router;