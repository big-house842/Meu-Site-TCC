const db = require('../config/firebaseConfig');
const path = require('path');

const COLLECTION = 'artistas';

const toDto = (id, data) => ({ id, nome: data.nome, bio: data.bio, imageUrl: data.imageUrl, createdAt: data.createdAt });

exports.create = async (req, res) => {
  try {
    const { nome, bio } = req.body;
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/artistas/${req.file.filename}` : null;

    const data = {
      nome,
      bio,
      imageUrl,
      createdAt: new Date().toISOString()
    };

    const ref = await db.collection(COLLECTION).add(data);
    res.status(201).json({ id: ref.id, ...data });
  } catch (err) {
    console.error('Erro criar artista:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const snap = await db.collection(COLLECTION).get();
    const items = snap.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    res.json(items);
  } catch (err) {
    console.error('Erro buscar artistas:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Artista não encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('Erro buscar artista:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};
    if (req.body.nome) updateData.nome = req.body.nome;
    if (req.body.bio) updateData.bio = req.body.bio;
    if (req.file) updateData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/artistas/${req.file.filename}`;
    updateData.updatedAt = new Date().toISOString();

    await db.collection(COLLECTION).doc(id).update(updateData);
    res.json({ message: 'Artista atualizado com sucesso' });
  } catch (err) {
    console.error('Erro atualizar artista:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    res.json({ message: 'Artista deletado' });
  } catch (err) {
    console.error('Erro deletar artista:', err);
    res.status(500).json({ error: err.message });
  }
};
