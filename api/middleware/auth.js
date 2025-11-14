const jwt = require('jsonwebtoken');
const db = require('../config/firebaseConfig');

const JWT_SECRET = process.env.JWT_SECRET || "abacate";

const adminEmails = [
    "teste1@gmail.com",
    "teste2@email.com",
    "admin@artistasparanaenses.com"
];

const authADM = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Busca informações do usuário
        const userDoc = await db.collection('users').doc(decoded.userId).get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const userData = userDoc.data();

        if (!adminEmails.includes(userData.email)) {
            return res.status(403).json({ 
                error: 'Acesso negado. Somente administradores podem realizar esta ação.' 
            });
        }
        
        // Adiciona informações do usuário à requisição
        req.user = {
            id: userDoc.id,
            email: userData.email,
            nome: userData.nome,
            isAdmin: true
        };
        
        next();
    } catch (error) {
        console.error('❌ Erro na autenticação ADM:', error);
        return res.status(403).json({ error: 'Token inválido ou acesso não autorizado' });
    }
}

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Busca informações do usuário
        const userDoc = await db.collection('users').doc(decoded.userId).get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const userData = userDoc.data();
        
        // Adiciona informações do usuário à requisição
        req.user = {
            id: userDoc.id,
            email: userData.email,
            nome: userData.nome
        };
        
        next();
    } catch (error) {
        console.error('❌ Erro na autenticação:', error);
        return res.status(403).json({ error: 'Token inválido' });
    }
};

const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Busca informações atualizadas
        const userDoc = await db.collection('users').doc(decoded.userId).get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const userData = userDoc.data();

        res.json({
            valid: true,
            user: {
                id: userDoc.id,
                nome: userData.nome,
                email: userData.email,
                isAdmin: adminEmails.includes(userData.email)
            }
        });

    } catch (error) {
        console.error('❌ Erro ao verificar token:', error);
        res.status(403).json({ error: 'Token inválido' });
    }
};

module.exports = {
    auth,
    authADM,
    verifyToken
};