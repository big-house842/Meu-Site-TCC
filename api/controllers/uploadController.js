const path = require('path');
const fs = require('fs');

const ensureFolder = (folder) => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
};

exports.uploadSingle = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo recebido' });

    const folder = req.uploadFolder || 'uploads';
    ensureFolder(path.join(__dirname, '..', folder));

    // multer já colocou file em req.file (usamos diskStorage)
    // construímos a URL pública com base no server que serve uploads (/uploads)
    const file = req.file;
    const fileUrl = `${req.protocol}://${req.get('host')}/${folder}/${file.filename}`;

    res.json({ message: 'Upload OK', url: fileUrl, filename: file.filename });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Erro no upload' });
  }
};
