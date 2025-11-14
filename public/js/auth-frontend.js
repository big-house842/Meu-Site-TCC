// Função melhorada para mostrar mensagens
function showAuthMessage(modalId, message, type = "error") {
  const messageEl = document.querySelector(`#${modalId} .auth-message`);
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = `auth-message ${type}`;

    // Auto-ocultar mensagens de sucesso
    if (type === "success") {
      setTimeout(() => {
        messageEl.style.display = "none";
      }, 3000);
    }
  }
}

// Validação de formulário melhorada
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "var(--accent)";
      isValid = false;
    } else {
      input.style.borderColor = "";
    }
  });

  return isValid;
}

// Função de login atualizada
async function handleLogin(form) {
  if (!validateForm(form)) {
    showAuthMessage(
      "loginMessage",
      "Por favor, preencha todos os campos obrigatórios",
      "error"
    );
    return;
  }

  const email = form.querySelector('input[type="email"]').value;
  const senha = form.querySelector('input[type="password"]').value;
  const button = form.querySelector('button[type="submit"]');

  // Estado de loading
  setButtonLoading(button, true);
  showAuthMessage("loginMessage", ""); // Limpar mensagens anteriores

  try {
    console.log("🔐 Tentando login...");
    const res = await api.post("/login", { email, senha });

    showAuthMessage("loginMessage", "Login realizado com sucesso!", "success");

    // Armazenar token e dados do usuário
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    // FORÇAR ATUALIZAÇÃO DA NAVBAR IMEDIATAMENTE
    if (typeof updateNavbar === "function") {
      updateNavbar();
    }

    // Fechar modal após sucesso
    setTimeout(() => {
      ModalSystem.close("loginModal");

      // ATUALIZAR NOVAMENTE PARA GARANTIR
      if (typeof updateNavbar === "function") {
        updateNavbar();
      }

      // Redirecionar se estiver na página de login
      if (window.location.pathname.includes("login.html")) {
        window.location.href = "index.html";
      }
    }, 1500);
  } catch (err) {
    console.error("❌ Erro no login:", err);
    showAuthMessage(
      "loginMessage",
      err.message || "Erro ao fazer login. Verifique suas credenciais.",
      "error"
    );
  } finally {
    setButtonLoading(button, false);
  }
}

// Função de registro atualizada
async function handleRegister(form) {
  if (!validateForm(form)) {
    showAuthMessage(
      "registerMessage",
      "Por favor, preencha todos os campos obrigatórios",
      "error"
    );
    return;
  }

  const inputs = form.querySelectorAll("input");
  const nome = inputs[0].value.trim();
  const email = inputs[1].value.trim();
  const senha = inputs[2].value.trim();
  const button = form.querySelector('button[type="submit"]');

  // Validação de senha
  if (senha.length < 6) {
    showAuthMessage(
      "registerMessage",
      "A senha deve ter pelo menos 6 caracteres",
      "error"
    );
    return;
  }

  // Estado de loading
  setButtonLoading(button, true);
  showAuthMessage("registerMessage", ""); // Limpar mensagens anteriores

  try {
    console.log("📝 Tentando criar conta...");
    const res = await api.post("/register", { nome, email, senha });

    showAuthMessage(
      "registerMessage",
      "Conta criada com sucesso! Redirecionando...",
      "success"
    );

    // Fechar modal e abrir login após sucesso
    setTimeout(() => {
      ModalSystem.close("registerModal");
      ModalSystem.open("loginModal");

      // Preencher email automaticamente
      const loginEmail = document.querySelector(
        '#loginModal input[type="email"]'
      );
      if (loginEmail) loginEmail.value = email;
    }, 2000);
  } catch (err) {
    console.error("❌ Erro no cadastro:", err);
    showAuthMessage(
      "registerMessage",
      err.message || "Erro ao criar conta. Tente novamente.",
      "error"
    );
  } finally {
    setButtonLoading(button, false);
  }
}

// Função de loading atualizada
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add("loading");
    button.disabled = true;
  } else {
    button.classList.remove("loading");
    button.disabled = false;
  }
}

// Funções globais para abrir modais
window.openLoginModal = () => {
  console.log("📲 Abrindo modal de login");
  ModalSystem.open("loginModal");
};

window.openRegisterModal = () => {
  console.log("📲 Abrindo modal de registro");
  ModalSystem.open("registerModal");
};

// Tornar as funções globais para serem acessadas de components.js
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.setButtonLoading = setButtonLoading;

// Configurar formulários standalone (páginas separadas)
document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "🔐 auth-frontend.js carregado - Configurando formulários standalone"
  );

  // Configurar formulário de login standalone (se existir)
  const standaloneLoginForm = document.querySelector(
    ".login-form:not(.modal .login-form)"
  );
  if (standaloneLoginForm) {
    console.log("✅ Formulário de login standalone encontrado");
    standaloneLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("📝 Submit do login standalone detectado");
      await handleLogin(standaloneLoginForm);
    });
  }

  // Configurar formulário de registro standalone (se existir)
  const standaloneRegisterForm = document.querySelector(
    ".register-form:not(.modal .register-form)"
  );
  if (standaloneRegisterForm) {
    console.log("✅ Formulário de registro standalone encontrado");
    standaloneRegisterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("📝 Submit do registro standalone detectado");
      await handleRegister(standaloneRegisterForm);
    });
  }
});
