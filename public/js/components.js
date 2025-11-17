class ComponentLoader {
  static async load(id, file) {
    try {
      const el = document.getElementById(id);
      if (!el) {
        console.warn(`Elemento com id "${id}" não encontrado`);
        return;
      }

      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Erro ${response.status} ao carregar ${file}`);
      }

      const content = await response.text();
      el.innerHTML = content;

      // Adiciona classe de animação
      el.classList.add("fade-in");

      console.log(`✅ Componente ${file} carregado com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao carregar ${file}:`, error);

      // Fallback básico para navbar
      const el = document.getElementById(id);
      if (el && id === "navbar") {
        el.innerHTML = `
          <nav class="navbar" style="padding: 1rem; background: white; border-bottom: 1px solid #e1e8f0; display: flex; justify-content: space-between; align-items: center;">
            <a href="/" style="font-weight: bold; color: #2157c4; text-decoration: none; font-size: 1.2rem;">DDAP</a>
            <div id="navbar-actions">
              <button class="btn-login" onclick="openLoginModal()">Entrar</button>
              <button class="btn-register" onclick="openRegisterModal()">Criar Conta</button>
            </div>
          </nav>
        `;
        // Atualiza a navbar fallback também
        updateNavbar();
      }

      // Fallback básico para footer
      if (el && id === "footer") {
        el.innerHTML = `
          <footer style="background: #2157c4; color: white; padding: 2rem; text-align: center; margin-top: 2rem;">
            <p>&copy; 2024 Dicionário das Artistas Paranaenses</p>
          </footer>
        `;
      }
    }
  }

  static async loadAll() {
    console.log("🔄 Carregando componentes...");

    await this.load("navbar", "navbar.html");
    updateNavbar();
    await this.load("footer", "footer.html");
    ModalSystem.initAuthModals();

    // Verificar se o carousel de artistas carregou
    setTimeout(() => {
      const carouselTrack = document.getElementById("artistsCarouselTrack");
      if (carouselTrack && carouselTrack.children.length === 0) {
        console.log("🔄 Reinicializando carousel de artistas...");
        CarouselSystem.initArtistCarousel();
      }
    }, 2000);
  }
}

// ===== SISTEMA DE MODAIS =====
class ModalSystem {
  static createModal(id, title, content) {
    // Remove modal existente se houver
    const existingModal = document.getElementById(id);
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = id;
    modal.innerHTML = `
            <div class="modal-overlay" onclick="ModalSystem.close('${id}')"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="ModalSystem.close('${id}')">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
    document.body.appendChild(modal);
    return modal;
  }

  static open(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Foco no primeiro input
      setTimeout(() => {
        const firstInput = modal.querySelector("input");
        if (firstInput) firstInput.focus();
      }, 300);
    }
  }

  static close(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";

      // Limpar formulários
      const forms = modal.querySelectorAll("form");
      forms.forEach((form) => form.reset());
    }
  }

  // components.js - Modifique a função initAuthModals

  static initAuthModals() {
    console.log('🔄 Inicializando modais de autenticação...');
    
    // Modal de Login
    this.createModal(
      "loginModal",
      "Bem-vindo de Volta",
      `
      <div class="auth-message" id="loginMessage" style="display: none;"></div>
      <form class="auth-form login-form" novalidate>
        <div class="auth-input-group">
          <input type="email" placeholder="seu@email.com" required aria-required="true">
          <span class="input-icon">✉️</span>
        </div>
        <div class="auth-input-group">
          <input type="password" placeholder="Sua senha" required aria-required="true">
          <span class="input-icon">🔒</span>
        </div>
        <button type="submit" class="btn-primary">
          <span class="btn-text">Entrar na Conta</span>
          <span class="btn-spinner">⏳</span>
        </button>
        <div class="auth-links">
          <a href="#" onclick="ModalSystem.close('loginModal'); ModalSystem.open('registerModal'); return false;">
            Criar nova conta
          </a>
          <a href="esqueceuSenha.html" onclick="ModalSystem.close('loginModal')">
            Esqueci minha senha
          </a>
        </div>
      </form>
      `
    );
  
    // Modal de Registro
    this.createModal(
      "registerModal",
      "Criar Sua Conta",
      `
      <div class="auth-message" id="registerMessage" style="display: none;"></div>
      <form class="auth-form register-form" novalidate>
        <div class="auth-input-group">
          <input type="text" placeholder="Nome completo" required aria-required="true">
          <span class="input-icon">👤</span>
        </div>
        <div class="auth-input-group">
          <input type="email" placeholder="seu@email.com" required aria-required="true">
          <span class="input-icon">✉️</span>
        </div>
        <div class="auth-input-group">
          <input type="password" placeholder="Crie uma senha segura" required aria-required="true" minlength="6">
          <span class="input-icon">🔒</span>
        </div>
        <button type="submit" class="btn-primary">
          <span class="btn-text">Criar Minha Conta</span>
          <span class="btn-spinner">⏳</span>
        </button>
        <div class="auth-links">
          <a href="#" onclick="ModalSystem.close('registerModal'); ModalSystem.open('loginModal'); return false;">
            Já tenho uma conta
          </a>
        </div>
      </form>
      `
    );
  
    // Configurar os event listeners dos forms
    if (typeof setupModalForms === 'function') {
      console.log('✅ Configurando forms dos modais...');
      setupModalForms();
    } else {
      console.log('⚠️ setupModalForms não disponível, tentando novamente em 1s...');
      setTimeout(() => {
        if (typeof setupModalForms === 'function') {
          setupModalForms();
        }
      }, 1000);
    }
  }

  
  static setupAuthForms() {
    console.log("🔄 Configurando formulários dos modais...");

    // Configurar formulário de login no modal
    const loginForm = document.querySelector("#loginModal .login-form");
    if (loginForm) {
      console.log("✅ Formulário de login do modal encontrado");
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("📝 Submit do login no modal detectado");
        await handleLogin(loginForm);
      });
    } else {
      console.log("❌ Formulário de login do modal NÃO encontrado");
    }

    // Configurar formulário de registro no modal
    const registerForm = document.querySelector(
      "#registerModal .register-form"
    );
    if (registerForm) {
      console.log("✅ Formulário de registro do modal encontrado");
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("📝 Submit do registro no modal detectado");
        await handleRegister(registerForm);
      });
    } else {
      console.log("❌ Formulário de registro do modal NÃO encontrado");
    }
  }

  static initKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const openModal = document.querySelector(".modal.active");
        if (openModal) {
          this.close(openModal.id);
        }
      }
    });
  }
}

function updateNavbar() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const navbarActions = document.getElementById("navbar-actions");
  const navbarLinks = document.querySelector(".navbar-links");

  if (!navbarActions) return;

  if (token && user) {
    // Verificar se é admin - lógica mais abrangente
    const adminEmails = [
      "teste1@gmail.com", 
      "teste2@email.com", 
      "admin@artistasparanaenses.com",
      "admin@email.com",
      "adm@email.com"
    ];
    
    const isAdmin = adminEmails.includes(user.email.toLowerCase()) || 
                   user.isAdmin || 
                   user.email.toLowerCase().includes('admin') ||
                   user.email.toLowerCase().includes('adm');

    console.log('🔐 Verificação de admin:', {
      email: user.email,
      isAdmin: isAdmin,
      userData: user
    });

    navbarActions.innerHTML = `
      <div class="user-menu">
        <span class="user-greeting">Olá, ${user.nome.split(" ")[0]}</span>
        <button class="btn-logout" onclick="logout()">Sair</button>
      </div>
    `;

    // Adicionar link ADM nos links de navegação se for admin
    if (isAdmin && navbarLinks) {
      // Remover link ADM existente primeiro para evitar duplicação
      const existingAdmLink = navbarLinks.querySelector('.nav-link[href="pagina_ADM.html"]');
      if (existingAdmLink) {
        existingAdmLink.parentElement.remove();
      }

      // Criar novo link ADM
      const admLink = document.createElement('li');
      admLink.innerHTML = '<a href="pagina_ADM.html" class="nav-link">ADM</a>';
      navbarLinks.appendChild(admLink);
      
      console.log('✅ Link ADM adicionado na navbar');
    } else {
      // Remover link ADM se não for admin
      const existingAdmLink = navbarLinks.querySelector('.nav-link[href="pagina_ADM.html"]');
      if (existingAdmLink) {
        existingAdmLink.parentElement.remove();
        console.log('❌ Link ADM removido (usuário não é admin)');
      }
    }
  } else {
    navbarActions.innerHTML = `
      <button class="btn-login" onclick="openLoginModal()">Entrar</button>
      <button class="btn-register" onclick="openRegisterModal()">Criar Conta</button>
    `;

    // Remover link ADM se existir
    if (navbarLinks) {
      const existingAdmLink = navbarLinks.querySelector('.nav-link[href="pagina_ADM.html"]');
      if (existingAdmLink) {
        existingAdmLink.parentElement.remove();
      }
    }
  }
}

// Remover elementos duplicados
function removeDuplicateElements() {
  // Remover navbars duplicadas
  const navbars = document.querySelectorAll("nav, .navbar");
  if (navbars.length > 1) {
    for (let i = 1; i < navbars.length; i++) {
      if (navbars[i].parentElement.id !== "navbar") {
        navbars[i].remove();
      }
    }
  }

  // Remover footers duplicados
  const footers = document.querySelectorAll("footer, .site-footer");
  if (footers.length > 1) {
    for (let i = 1; i < footers.length; i++) {
      if (footers[i].parentElement.id !== "footer") {
        footers[i].remove();
      }
    }
  }
}

// function setupAuthFormsFallback() {
//   console.log("🔄 Configurando fallback para formulários de auth...");

//   // Fallback para formulários em páginas separadas
//   const standaloneLoginForm = document.querySelector(
//     ".login-form:not(.modal .login-form)"
//   );
//   const standaloneRegisterForm = document.querySelector(
//     ".register-form:not(.modal .register-form)"
//   );

//   if (standaloneLoginForm) {
//     console.log("✅ Formulário de login standalone encontrado");
//     standaloneLoginForm.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       await handleLogin(standaloneLoginForm);
//     });
//   }

//   if (standaloneRegisterForm) {
//     console.log("✅ Formulário de registro standalone encontrado");
//     standaloneRegisterForm.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       await handleRegister(standaloneRegisterForm);
//     });
//   }
// }

// Inicialização quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  // Configurar modais de auth
  ModalSystem.initAuthModals();

  // Configurar eventos de teclado para acessibilidade
  document.addEventListener("keydown", function (e) {
    // Fechar modal com ESC
    if (e.key === "Escape") {
      const openModal = document.querySelector(".modal-overlay.active");
      if (openModal) {
        ModalSystem.close(openModal.id.replace("Modal", ""));
      }
    }

    // Navegação por tab nos modais
    if (e.key === "Tab" && document.querySelector(".modal-overlay.active")) {
      handleModalTabNavigation(e);
    }
  });
});

// Navegação por tab acessível nos modais
function handleModalTabNavigation(e) {
  const modal = document.querySelector(".modal-overlay.active");
  if (!modal) return;

  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
}

// Função de logout
window.logout = function () {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  updateNavbar();
  window.location.href = "index.html";
};

// Funções globais para abrir modais
window.openLoginModal = () => ModalSystem.open("loginModal");
window.openRegisterModal = () => ModalSystem.open("registerModal");

// Define as funções globais
window.loadNavbar = function () {
  return ComponentLoader.load("navbar", "navbar.html").then(updateNavbar);
};

window.loadFooter = function () {
  return ComponentLoader.load("footer", "footer.html");
};

window.loadComponents = function () {
  return ComponentLoader.loadAll();
};

window.ModalSystem = ModalSystem;

// Carrega automaticamente quando DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    ComponentLoader.loadAll();
  });
} else {
  ComponentLoader.loadAll();
}
