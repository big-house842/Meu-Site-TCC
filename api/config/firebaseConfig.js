const admin = require('firebase-admin');
const path = require('path');

// Caminho para o arquivo de credenciais do Firebase
const serviceAccount = require(path.join(__dirname, '../../firebase-credenciais.json'));

// Inicializar o Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Verificar conexão
db.listCollections()
  .then(collections => {
    console.log('✅ Firebase conectado com sucesso!');
    console.log(`📁 Coleções disponíveis: ${collections.map(c => c.id).join(', ') || 'Nenhuma'}`);
  })
  .catch(error => {
    console.error('❌ Erro ao conectar com Firebase:', error);
  });

module.exports = db;