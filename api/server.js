// server.js - Versão corrigida sem duplicações
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares - CORS mais permissivo
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000', 'http://127.0.0.1:3000', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// **CORREÇÃO: Servir arquivos estáticos corretamente**
app.use(express.static(path.join(__dirname, '../public'), {
  index: false
}));

// Servir CSS, JS e imagens de forma específica
app.use('/styles', express.static(path.join(__dirname, '../public/styles')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/imagens', express.static(path.join(__dirname, '../public/imagens')));

// Criar pastas de upload se não existirem
const uploadFolders = [
    'uploads/artistas',
    'uploads/artigos', 
    'uploads/autores',
    'uploads/verbete',
    'uploads/premiacoes',
    'uploads/artigos_imagens'
];

uploadFolders.forEach(folder => {
    const fullPath = path.join(__dirname, folder);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Pasta criada: ${folder}`);
    }
});

// Servir uploads como estático
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas da API
app.use('/api', require('./routes/userRoutes'));
app.use('/api/artistas', require('./routes/artistasRoutes'));
app.use('/api/artigos', require('./routes/artigosRoutes'));
app.use('/api', require('./routes/uploadRoutes'));

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'OK', ts: new Date().toISOString() });
});

// **CORREÇÃO: Rotas para páginas HTML específicas**
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.get('/pagina_artigos', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pagina_artigos.html'));
});

app.get('/buttonInfo', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/buttonInfo.html'));
});

app.get('/sobre_nos', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/sobre_nos.html'));
});

app.get('/pagina_ADM', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pagina_ADM.html'));
});

app.get('/artigo', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/artigo.html'));
});

app.get('/esqueceuSenha', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/esqueceuSenha.html'));
});

// Fallback: qualquer rota não-API deve carregar o index.html
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint não encontrado', path: req.originalUrl });
  }
  return res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro na API:', err);
  res.status(500).json({ error: err.message || 'Erro interno' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}`);
  console.log(`📁 CSS e JS sendo servidos de: ${path.join(__dirname, '../public')}`);
});