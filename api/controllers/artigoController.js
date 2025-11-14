const db = require('../config/firebaseConfig');
const COLLECTION = 'artigos';

exports.create = async (req, res) => {
  try {
    const { titulo, autor, conteudo } = req.body;
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/artigos/${req.file.filename}` : null;

    const data = {
      titulo,
      autor,
      conteudo,
      imageUrl,
      createdAt: new Date().toISOString()
    };

    const ref = await db.collection(COLLECTION).add(data);
    res.status(201).json({ id: ref.id, ...data });
  } catch (err) {
    console.error('Erro criar artigo:', err);
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
    console.error('Erro buscar artigos:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createCompleto = async (req, res) => {
  try {
    const { nomeArtista, tempoVida } = req.body;
    const files = req.files;

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Processar imagem da artista
    const imagemArtistaUrl = files.imagemArtista ? 
      `${baseUrl}/uploads/artistas/${files.imagemArtista[0].filename}` : null;

    // Processar autores
    const autores = [];
    for (let i = 0; i < 3; i++) {
      const autorImagem = files[`autores[${i}][imagem]`];
      const autorNome = req.body[`autores[${i}][nome]`];
      
      if (autorNome) {
        autores.push({
          nome: autorNome,
          imagemUrl: autorImagem ? 
            `${baseUrl}/uploads/autores/${autorImagem[0].filename}` : null
        });
      }
    }

    // Processar arquivos PDF
    const verbeteUrl = files.verbete ? 
      `${baseUrl}/uploads/verbete/${files.verbete[0].filename}` : null;
    
    const premiacoesUrl = files.premiacoes ? 
      `${baseUrl}/uploads/premiacoes/${files.premiacoes[0].filename}` : null;

    // Processar imagens múltiplas
    const imagensUrls = files.imagens ? 
      files.imagens.map(file => `${baseUrl}/uploads/artigos_imagens/${file.filename}`) : [];

    const data = {
      nomeArtista,
      tempoVida,
      imagemArtistaUrl,
      autores,
      verbeteUrl,
      premiacoesUrl,
      imagensUrls,
      createdAt: new Date().toISOString(),
      tipo: 'completo'
    };

    const ref = await db.collection('artigos').add(data);
    res.status(201).json({ id: ref.id, ...data });
  } catch (err) {
    console.error('Erro criar artigo completo:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Artigo não encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('Erro buscar artigo:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};
    if (req.body.titulo) updateData.titulo = req.body.titulo;
    if (req.body.autor) updateData.autor = req.body.autor;
    if (req.body.conteudo) updateData.conteudo = req.body.conteudo;
    if (req.file) updateData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/artigos/${req.file.filename}`;
    updateData.updatedAt = new Date().toISOString();

    await db.collection(COLLECTION).doc(id).update(updateData);
    res.json({ message: 'Artigo atualizado com sucesso' });
  } catch (err) {
    console.error('Erro atualizar artigo:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    res.json({ message: 'Artigo deletado' });
  } catch (err) {
    console.error('Erro deletar artigo:', err);
    res.status(500).json({ error: err.message });
  }
};
