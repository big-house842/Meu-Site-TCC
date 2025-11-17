// auth-frontend.js - Versão corrigida para modais

// Função melhorada para mostrar mensagens
function showAuthMessage(modalId, message, type = 'error') {
  const messageEl = document.querySelector(`#${modalId} .auth-message`);
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = `auth-message ${type}`;
    messageEl.style.display = 'block';
   
    // Auto-ocultar mensagens de sucesso
    if (type === 'success') {
      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 3000);
    }
  }
}

// Validação de formulário
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required]');
  let isValid = true;
 
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = 'var(--accent)';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });
 
  return isValid;
}

// Função de login
async function handleLogin(form) {
  console.log('🔐 Iniciando processo de login...');
  
  if (!validateForm(form)) {
    showAuthMessage('loginMessage', 'Por favor, preencha todos os campos obrigatórios', 'error');
    return;
  }

  const email = form.querySelector('input[type="email"]').value;
  const senha = form.querySelector('input[type="password"]').value;
  const button = form.querySelector('button[type="submit"]');

  // Estado de loading
  setButtonLoading(button, true);
  showAuthMessage('loginMessage', '', 'success'); // Limpar mensagens

  try {
    console.log('📤 Enviando dados de login...');
    const res = await api.post("/login", { email, senha });
   
    console.log('✅ Login bem-sucedido:', res);
    showAuthMessage('loginMessage', 'Login realizado com sucesso!', 'success');
   
    // Armazenar token e dados do usuário
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
   
    // Fechar modal após sucesso
    setTimeout(() => {
      ModalSystem.close('loginModal');
     
      // Atualizar navbar
      if (typeof updateNavbar === "function") {
        updateNavbar();
      }
     
      // Recarregar a página para atualizar o estado
      window.location.reload();
    }, 1500);
   
  } catch (err) {
    console.error("❌ Erro no login:", err);
    showAuthMessage('loginMessage', err.message || "Erro ao fazer login. Verifique suas credenciais.", 'error');
  } finally {
    setButtonLoading(button, false);
  }
}

// Função de registro
async function handleRegister(form) {
  console.log('📝 Iniciando processo de registro...');
  
  if (!validateForm(form)) {
    showAuthMessage('registerMessage', 'Por favor, preencha todos os campos obrigatórios', 'error');
    return;
  }

  const inputs = form.querySelectorAll('input');
  const nome = inputs[0].value.trim();
  const email = inputs[1].value.trim();
  const senha = inputs[2].value.trim();
  const button = form.querySelector('button[type="submit"]');

  // Validação de senha
  if (senha.length < 6) {
    showAuthMessage('registerMessage', 'A senha deve ter pelo menos 6 caracteres', 'error');
    return;
  }

  // Estado de loading
  setButtonLoading(button, true);
  showAuthMessage('registerMessage', '', 'success');

  try {
    console.log('📤 Enviando dados de registro...');
    const res = await api.post("/register", { nome, email, senha });
   
    console.log('✅ Registro bem-sucedido:', res);
    showAuthMessage('registerMessage', 'Conta criada com sucesso! Redirecionando...', 'success');
   
    // Fechar modal e abrir login após sucesso
    setTimeout(() => {
      ModalSystem.close('registerModal');
      ModalSystem.open('loginModal');
     
      // Preencher email automaticamente
      const loginEmail = document.querySelector('#loginModal input[type="email"]');
      if (loginEmail) loginEmail.value = email;
    }, 2000);
   
  } catch (err) {
    console.error("❌ Erro no cadastro:", err);
    showAuthMessage('registerMessage', err.message || "Erro ao criar conta. Tente novamente.", 'error');
  } finally {
    setButtonLoading(button, false);
  }
}

// Função de loading
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

// Configurar event listeners para os formulários dos modais
function setupModalForms() {
  console.log('🔄 Configurando formulários dos modais...');

  // Login Modal
  const loginForm = document.querySelector('#loginModal .login-form');
  if (loginForm) {
    console.log('✅ Formulário de login encontrado no modal');
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('🎯 Submit do login modal capturado!');
      handleLogin(loginForm);
    });
  }

  // Register Modal
  const registerForm = document.querySelector('#registerModal .register-form');
  if (registerForm) {
    console.log('✅ Formulário de registro encontrado no modal');
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('🎯 Submit do registro modal capturado!');
      handleRegister(registerForm);
    });
  }
}

// Funções globais para abrir modais
window.openLoginModal = () => {
  console.log('📲 Abrindo modal de login');
  ModalSystem.open('loginModal');
};

window.openRegisterModal = () => {
  console.log('📲 Abrindo modal de registro');
  ModalSystem.open('registerModal');
};

// Tornar as funções globais
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.setButtonLoading = setButtonLoading;
window.setupModalForms = setupModalForms;

// Configurar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔐 auth-frontend.js carregado');
  
  // Configurar os forms após um pequeno delay para garantir que os modais foram criados
  setTimeout(() => {
    setupModalForms();
  }, 1000);
});