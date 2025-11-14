const express = require('express');
const router = express.Router();

// Importações dos controllers
const { 
    login, 
    createUser, 
    getUsers, 
    getUserById, 
    deleteUser, 
    updateUser 
} = require('../controllers/userController');

// Importações dos middlewares
const { auth, authADM, verifyToken } = require("../middleware/auth.js");

// Rotas públicas
router.post('/register', createUser); // Cria usuário
router.post('/login', login); // Gera token

// Rotas protegidas
router.get('/verify', auth, verifyToken); // Verifica token
router.get('/users/:id', auth, getUserById); // Pega usuário por ID
router.put('/users/:id', auth, updateUser); // Atualiza usuário

// Rotas apenas para administradores
router.get('/users', authADM, getUsers); // Pega todos os usuários
router.delete('/users/:id', authADM, deleteUser); // Deleta usuário

// Rota de informações da API
router.get('/info', (req, res) => {
    res.json({
        name: 'API Dicionário das Artistas Paranaenses',
        version: '1.0.0',
        description: 'API para gerenciamento do projeto de pesquisa sobre artistas paranaenses',
        author: 'Gabriel Casagrande Dalmolin',
        routes: {
            public: ['/register', '/login'],
            protected: ['/verify', '/users/:id', '/users/:id'],
            admin: ['/users', '/users/:id (DELETE)']
        }
    });
});

module.exports = router;