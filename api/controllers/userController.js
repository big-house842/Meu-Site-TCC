const bcrypt = require("bcrypt");
const db = require("../config/firebaseConfig");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "abacate";

const createUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!senha || !email || !nome) {
      return res
        .status(400)
        .json({ error: "Nome, email e senha são obrigatórios" });
    }

    console.log("📝 Tentando criar usuário:", { nome, email });

    // Buscar usuário por email - VERSÃO FIREBASE REAL
    const existingUser = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!existingUser.empty) {
      console.log("❌ Email já cadastrado:", email);
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(senha, 8);

    const userRef = await db.collection("users").add({
      nome: nome,
      email: email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Usuário cadastrado:", email);
    return res.status(201).json({
      message: "Usuário criado com sucesso",
      id: userRef.id,
      user: { nome, email },
    });
  } catch (err) {
    console.error("❌ Erro ao criar usuário:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const getUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        nome: userData.nome,
        email: userData.email,
        createdAt: userData.createdAt,
      });
    });
    res.json(users);
  } catch (error) {
    console.error("❌ Erro ao buscar usuários:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await db.collection("users").doc(id).get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "Usuário não encontrado" });

    const userData = userDoc.data();
    res.json({
      id: userDoc.id,
      nome: userData.nome,
      email: userData.email,
      createdAt: userData.createdAt,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    console.log("🔐 Tentando login para:", email);

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    // Busca o usuário pelo email - VERSÃO FIREBASE REAL
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (usersSnapshot.empty) {
      console.log("❌ Usuário não encontrado:", email);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Pegar o primeiro usuário encontrado
    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    console.log("📋 Usuário encontrado:", userData.email);

    // 🔥 CORREÇÃO: Verificação da senha com tratamento de erro
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(senha, userData.password);
      console.log("🔑 Senha válida?", isPasswordValid);
    } catch (bcryptError) {
      console.error("❌ Erro ao comparar senhas:", bcryptError);
      return res.status(500).json({ error: "Erro interno ao verificar senha" });
    }

    if (!isPasswordValid) {
      console.log("❌ Senha inválida para:", email);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Gera token JWT
    const token = jwt.sign(
      {
        userId: userId,
        email: userData.email,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("✅ Login realizado com sucesso:", email);

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: userId,
        nome: userData.nome,
        email: userData.email,
      },
    });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    return res
      .status(500)
      .json({ error: "Erro interno do servidor: " + error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).delete();
    console.log("✅ Usuário deletado:", id);
    res.json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao deletar usuário:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email } = req.body;

    const userDoc = await db.collection("users").doc(id).get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "Usuário não encontrado" });

    await db.collection("users").doc(id).update({
      nome: nome,
      email: email,
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Usuário atualizado:", id);
    res.json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao atualizar usuário:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  login,
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
