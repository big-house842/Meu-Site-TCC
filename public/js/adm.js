class InfoSystem {
  static initialized = false;

  static init() {
    if (this.initialized) return;

    console.log("🔄 Inicializando sistema de informações...");
    this.createInfoModal();
    this.setupInfoButtons();
    this.initKeyboardEvents();
    this.initialized = true;
    console.log("✅ Sistema de informações inicializado");
  }

  static createInfoModal() {
    // Remove modal existente se houver
    const existingModal = document.getElementById("infoModal");
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement("div");
    modal.className = "info-modal";
    modal.id = "infoModal";
    modal.innerHTML = `
            <div class="info-modal-overlay" onclick="InfoSystem.close()"></div>
            <div class="info-modal-container">
                <div class="info-modal-header">
                    <h3 id="infoModalTitle">Informações</h3>
                    <button class="info-modal-close" onclick="InfoSystem.close()">&times;</button>
                </div>
                <div class="info-modal-body">
                    <div id="infoModalContent" class="info-content"></div>
                </div>
            </div>
        `;
    document.body.appendChild(modal);
  }

  static setupInfoButtons() {
    console.log("🔧 Configurando botões de informação...");

    // Usar delegação de eventos para capturar cliques dinamicamente
    document.addEventListener("click", (e) => {
      const button = e.target.closest(".info-btn");
      if (button) {
        e.preventDefault();
        e.stopPropagation();

        const infoType = button.getAttribute("data-info");
        console.log("📝 Botão clicado:", infoType);

        if (infoType) {
          this.showInfo(infoType);
        }
      }
    });

    // Também configurar eventos diretamente nos botões existentes
    const infoButtons = document.querySelectorAll(".info-btn");
    console.log(`🔍 Encontrados ${infoButtons.length} botões de informação`);

    infoButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const infoType = button.getAttribute("data-info");
        console.log("📝 Botão direto clicado:", infoType);

        if (infoType) {
          this.showInfo(infoType);
        }
      });
    });
  }

  static showInfo(infoType) {
    console.log("📖 Mostrando informação:", infoType);

    const content = this.getInfoContent(infoType);
    if (!content) {
      console.error("❌ Conteúdo não encontrado para:", infoType);
      return;
    }

    const modal = document.getElementById("infoModal");
    const title = document.getElementById("infoModalTitle");
    const contentEl = document.getElementById("infoModalContent");

    if (!modal || !title || !contentEl) {
      console.error("❌ Elementos do modal não encontrados");
      return;
    }

    title.textContent = content.title;
    contentEl.innerHTML = content.html;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    console.log("✅ Modal aberto com sucesso");
  }

  static close() {
    const modal = document.getElementById("infoModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
      console.log("📪 Modal fechado");
    }
  }

  static initKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
      const modal = document.getElementById("infoModal");
      if (modal && modal.classList.contains("active")) {
        if (e.key === "Escape") {
          this.close();
        }
        if (e.key === "Tab") {
          this.handleTabFocus(e);
        }
      }
    });
  }

  static handleTabFocus(e) {
    const modal = document.getElementById("infoModal");
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

  static getInfoContent(infoType) {
    const infoContents = {
      "nome-artista": {
        title: "Nome da Artista",
        html: `
                    <div class="info-section">
                        <h4>📝 Como preencher</h4>
                        <p>Digite o nome completo da artista pesquisada, conforme registrado em fontes confiáveis.</p>
                    </div>
                    <div class="info-section">
                        <h4>💡 Dicas</h4>
                        <ul class="info-list">
                            <li>Use o formato: "Nome Sobrenome"</li>
                            <li>Inclua nomes artísticos se relevantes</li>
                            <li>Mantenha a grafia original</li>
                            <li>Verifique em múltiplas fontes</li>
                        </ul>
                    </div>
                    <div class="info-tip">
                        <strong>Exemplo:</strong> "Ana Maria Pacheco" ou "Tarsila do Amaral"
                    </div>
                `,
      },
      "conteudo-artigo": {
        title: "Conteúdo do Artigo",
        html: `
        <div class="info-section">
            <h4>📝 Como estruturar o conteúdo</h4>
            <p>Escreva o conteúdo completo do artigo sobre a artista. Use parágrafos, títulos e formatação para organizar o texto.</p>
        </div>
        <div class="info-section">
            <h4>🖼️ Inserindo imagens</h4>
            <p>Para inserir imagens em posições específicas do texto, use os marcadores:</p>
            <ul class="info-list">
                <li><strong>[IMAGEM:1]</strong> - Insere a primeira imagem</li>
                <li><strong>[IMAGEM:2]</strong> - Insere a segunda imagem</li>
                <li><strong>[IMAGEM:3]</strong> - Insere a terceira imagem</li>
            </ul>
            <p>As imagens serão inseridas na ordem que você fizer o upload.</p>
        </div>
        <div class="info-section">
            <h4>💡 Exemplo de uso</h4>
            <div class="info-tip">
                <strong>Texto exemplo:</strong><br><br>
                "A artista começou sua carreira em 1950...[IMAGEM:1]<br><br>
                Sua primeira exposição foi um sucesso...[IMAGEM:2]<br><br>
                Nas décadas seguintes, ela desenvolveu..."
            </div>
        </div>
    `,
      },

      "tempo-vida": {
        title: "Tempo de Vida",
        html: `
                    <div class="info-section">
                        <h4>📅 Formato recomendado</h4>
                        <p>Informe as datas de nascimento e falecimento no formato: <strong>ANO-NASCIMENTO - ANO-FALECIMENTO</strong></p>
                    </div>
                    <div class="info-section">
                        <h4>💡 Instruções</h4>
                        <ul class="info-list">
                            <li>Para artistas vivas: use "19XX - Presente"</li>
                            <li>Datas aproximadas: use "c. 1920" (circa)</li>
                            <li>Datas desconhecidas: deixe em branco e adicione nota</li>
                            <li>Sempre verifique a precisão das datas</li>
                        </ul>
                    </div>
                    <div class="info-tip">
                        <strong>Exemplos:</strong><br>
                        • "1903 - 1975"<br>
                        • "1950 - Presente"<br>
                        • "c. 1895 - 1960"
                    </div>
                `,
      },
      "imagem-artista": {
        title: "Imagem da Artista",
        html: `
                    <div class="info-section">
                        <h4>🖼️ Formatos aceitos</h4>
                        <p>
                            <span class="file-format-badge">JPEG</span>
                            <span class="file-format-badge">JPG</span>
                            <span class="file-format-badge">PNG</span>
                        </p>
                    </div>
                    <div class="info-section">
                        <h4>📏 Especificações técnicas</h4>
                        <ul class="info-list">
                            <li><strong>Tamanho máximo:</strong> 5MB por imagem</li>
                            <li><strong>Resolução recomendada:</strong> Mínimo 500x500 pixels</li>
                            <li><strong>Proporção:</strong> Preferencialmente quadrada ou 3:4</li>
                            <li><strong>Qualidade:</strong> Imagens nítidas e bem iluminadas</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h4>💡 Dicas para boa imagem</h4>
                        <ul class="info-list">
                            <li>Use retratos profissionais quando possível</li>
                            <li>Evite imagens pixeladas ou borradas</li>
                            <li>Prefira fundos neutros</li>
                            <li>Garanta que o rosto esteja bem visível</li>
                        </ul>
                    </div>
                `,
      },
      autores: {
        title: "Sistema de Autores",
        html: `
                    <div class="info-section">
                        <h4>👥 Como funciona</h4>
                        <p>Adicione todos os pesquisadores e colaboradores que participaram da criação deste artigo.</p>
                    </div>
                    <div class="info-section">
                        <h4>📋 Estrutura recomendada</h4>
                        <ul class="info-list">
                            <li><strong>Autor 1:</strong> Pesquisador principal</li>
                            <li><strong>Autor 2:</strong> Co-pesquisador/Colaborador</li>
                            <li><strong>Autor 3:</strong> Revisor/Consultor</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h4>⚙️ Funcionalidades</h4>
                        <ul class="info-list">
                            <li>Adicione até 3 autores</li>
                            <li>Cada autor precisa de nome e foto</li>
                            <li>Os autores serão exibidos no artigo</li>
                            <li>É possível remover autores adicionados</li>
                        </ul>
                    </div>
                `,
      },
      "nome-autor": {
        title: "Nome do Autor",
        html: `
                    <div class="info-section">
                        <h4>📝 Formato correto</h4>
                        <p>Digite o nome completo do autor no formato padrão acadêmico.</p>
                    </div>
                    <div class="info-section">
                        <h4>💡 Boas práticas</h4>
                        <ul class="info-list">
                            <li>Use: "Nome Completo Sobrenome"</li>
                            <li>Inclua titulação se relevante (Dr., Prof., etc.)</li>
                            <li>Mantenha a consistência entre artigos</li>
                            <li>Verifique a grafia correta</li>
                        </ul>
                    </div>
                    <div class="info-tip">
                        <strong>Exemplos:</strong><br>
                        • "Maria Silva Santos"<br>
                        • "Dr. João Pereira Lima"<br>
                        • "Prof. Ana Costa Oliveira"
                    </div>
                `,
      },
      "imagem-autor": {
        title: "Imagem do Autor",
        html: `
                    <div class="info-section">
                        <h4>🖼️ Formatos aceitos</h4>
                        <p>
                            <span class="file-format-badge">JPEG</span>
                            <span class="file-format-badge">JPG</span>
                            <span class="file-format-badge">PNG</span>
                        </p>
                    </div>
                    <div class="info-section">
                        <h4>📏 Especificações</h4>
                        <ul class="info-list">
                            <li><strong>Tamanho máximo:</strong> 5MB</li>
                            <li><strong>Formato ideal:</strong> Retrato quadrado</li>
                            <li><strong>Resolução mínima:</strong> 300x300 pixels</li>
                            <li><strong>Fundo:</strong> Preferencialmente neutro</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h4>👤 Diretrizes de imagem</h4>
                        <ul class="info-list">
                            <li>Foto profissional ou de boa qualidade</li>
                            <li>Rosto claramente visível</li>
                            <li>Iluminação adequada</li>
                            <li>Expressão profissional</li>
                        </ul>
                    </div>
                `,
      },
      verbete: {
        title: "Arquivo do Verbete",
        html: `
                    <div class="info-section">
                        <h4>📄 Formato exigido</h4>
                        <p>
                            <span class="file-format-badge">PDF</span> apenas
                        </p>
                    </div>
                    <div class="info-section">
                        <h4>📊 Especificações técnicas</h4>
                        <ul class="info-list">
                            <li><strong>Tamanho máximo:</strong> 10MB</li>
                            <li><strong>Páginas:</strong> Máximo 20 páginas</li>
                            <li><strong>Qualidade:</strong> Texto legível e nítido</li>
                            <li><strong>Segurança:</strong> PDF não protegido por senha</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h4>📝 Conteúdo esperado</h4>
                        <ul class="info-list">
                            <li>Biografia completa da artista</li>
                            <li>Trajetória artística e influências</li>
                            <li>Análise de obras principais</li>
                            <li>Contexto histórico e cultural</li>
                            <li>Referências bibliográficas</li>
                        </ul>
                    </div>
                    <div class="info-tip">
                        <strong>Dica:</strong> Use formatação clara, títulos e subtítulos para melhor organização do conteúdo.
                    </div>
                `,
      },
      "imagens-artigo": {
        title: "Imagens do Artigo",
        html: `
                    <div class="info-section">
                        <h4>🖼️ Formatos aceitos</h4>
                        <p>
                            <span class="file-format-badge">JPEG</span>
                            <span class="file-format-badge">JPG</span>
                            <span class="file-format-badge">PNG</span>
                        </p>
                    </div>
                    <div class="info-section">
                        <h4>📏 Especificações técnicas</h4>
                        <ul class="info-list">
                            <li><strong>Tamanho máximo por imagem:</strong> 5MB</li>
                            <li><strong>Quantidade máxima:</strong> 10 imagens</li>
                            <li><strong>Resolução mínima:</strong> 800x600 pixels</li>
                            <li><strong>Formato:</strong> Horizontal ou vertical</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h4>🎨 Tipos de imagens recomendadas</h4>
                        <ul class="info-list">
                            <li>Obras de arte da artista</li>
                            <li>Fotos de exposições</li>
                            <li>Imagens históricas relevantes</li>
                            <li>Detalhes de técnicas artísticas</li>
                            <li>Documentos importantes digitalizados</li>
                        </ul>
                    </div>
                    <div class="info-tip">
                        <strong>Como selecionar múltiplas imagens:</strong> Mantenha a tecla CTRL (Windows) ou CMD (Mac) pressionada enquanto clica nas imagens desejadas.
                    </div>
                `,
      },
      premiacoes: {
        title: "Premiações e Feitos",
        html: `
                    <div class="info-section">
                        <h4>📄 Formato exigido</h4>
                        <p>
                            <span class="file-format-badge">PDF</span> apenas
                        </p>
                    </div>
                    <div class="info-section">
                        <h4>📊 Especificações</h4>
                        <ul class="info-list">
                            <li><strong>Tamanho máximo:</strong> 10MB</li>
                            <li><strong>Organização:</strong> Cronológica ou por importância</li>
                            <li><strong>Conteúdo:</strong> Lista completa e detalhada</li>
                            <li><strong>Fontes:</strong> Incluir referências quando possível</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h4>📋 O que incluir</h4>
                        <ul class="info-list">
                            <li>Prêmios e distinções recebidos</li>
                            <li>Exposições individuais e coletivas</li>
                            <li>Coleções públicas e privadas</li>
                            <li>Publicações e críticas</li>
                            <li>Participações em eventos importantes</li>
                            <li>Reconhecimentos acadêmicos</li>
                        </ul>
                    </div>
                    <div class="info-tip">
                        <strong>Formatação sugerida:</strong> Use tabelas ou listas numeradas para melhor organização das informações cronológicas.
                    </div>
                `,
      },
    };

    return (
      infoContents[infoType] || {
        title: "Informações",
        html: "<p>Informações não disponíveis para este campo.</p>",
      }
    );
  }
}

// Função de fallback para upload - CORRIGIDA
async function tryAlternativeUpload(formData) {
  console.log("🔄 Tentando upload alternativo...");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await fetch(
      "http://localhost:3000/api/artigos/artigos-completos",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Não definir Content-Type para FormData - o browser faz automaticamente
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro na resposta:", errorText);
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Upload alternativo bem-sucedido:", data);
    return data;
  } catch (error) {
    console.error("❌ Upload alternativo também falhou:", error);
    throw error;
  }
}

// Envio do formulário - VERSÃO CORRIGIDA
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("🚀 Iniciando envio do formulário...");

    const token = localStorage.getItem("token");
    if (!token) {
      utils.showMessage(
        "Usuário não autenticado. Faça login novamente.",
        "error",
        3000
      );
      return;
    }

    // Validar arquivos
    if (!validateFiles()) {
      console.log("❌ Validação de arquivos falhou");
      return;
    }

    try {
      // Mostrar estado de loading no botão
      const submitBtn = form.querySelector(".btn-submit");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = "⏳ Publicando...";
      submitBtn.disabled = true;

      utils.showMessage("Enviando artigo...", "success", 2000);

      // Criar FormData para envio
      const formData = new FormData();

      // Dados básicos - CORRIGIDO: usar nomes consistentes
      formData.append(
        "nomeArtista",
        document.getElementById("nome-artista").value
      );
      formData.append("tempoVida", document.getElementById("tempo-vida").value);
      formData.append(
        "conteudoArtigo",
        document.getElementById("conteudo-artigo").value
      );

      // Imagem da artista - CORRIGIDO
      const imagemArtista = document.getElementById("imagem-artista").files[0];
      if (imagemArtista) {
        formData.append("imagemArtista", imagemArtista);
      }

      // Autores - CORRIGIDO: usar estrutura correta
      const autoresNomes = document.querySelectorAll(
        'input[name="autor-nome[]"]'
      );
      const autoresImagens = document.querySelectorAll(
        'input[name="autor-imagem[]"]'
      );

      autoresNomes.forEach((nomeInput, index) => {
        if (nomeInput.value.trim()) {
          formData.append(`autores[${index}][nome]`, nomeInput.value.trim());

          if (autoresImagens[index] && autoresImagens[index].files[0]) {
            formData.append(
              `autores[${index}][imagem]`,
              autoresImagens[index].files[0]
            );
          }
        }
      });

      // Arquivos PDF - CORRIGIDO
      const verbeteFile = document.getElementById("verbete").files[0];
      const premiacoesFile = document.getElementById("premiacoes").files[0];

      if (verbeteFile) formData.append("verbete", verbeteFile);
      if (premiacoesFile) formData.append("premiacoes", premiacoesFile);

      // Imagens múltiplas - CORRIGIDO
      const imagensFiles = document.getElementById("imagens").files;
      for (let i = 0; i < imagensFiles.length; i++) {
        formData.append("imagens", imagensFiles[i]);
      }

      console.log("📤 Enviando formulário com dados:", {
        nomeArtista: document.getElementById("nome-artista").value,
        tempoVida: document.getElementById("tempo-vida").value,
        conteudoArtigo:
          document.getElementById("conteudo-artigo").value.substring(0, 100) +
          "...",
        autores: Array.from(autoresNomes).map((a) => a.value),
        arquivos: {
          imagemArtista: imagemArtista?.name,
          verbete: verbeteFile?.name,
          premiacoes: premiacoesFile?.name,
          imagens: Array.from(imagensFiles).map((f) => f.name),
        },
      });

      // DEBUG: Verificar FormData
      console.log("📦 FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      // Enviar para a API - CORRIGIDO: usar endpoint correto
      let response;
      try {
        console.log("🔄 Tentando enviar para API...");
        response = await api.post("/artigos/artigos-completos", formData);
        console.log("✅ Resposta da API:", response);
      } catch (firstError) {
        console.log(
          "🔄 Primeira tentativa falhou, usando fallback...",
          firstError
        );
        response = await tryAlternativeUpload(formData);
      }

      if (response && response.id) {
        utils.showMessage("✅ Artigo publicado com sucesso!", "success", 3000);

        // Resetar formulário
        form.reset();
        resetFileIndicators();
        resetAutores();

        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Redirecionar para o artigo após 2 segundos
        setTimeout(() => {
          window.location.href = `artigo.html?id=${response.id}`;
        }, 2000);
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error) {
      console.error("❌ Erro ao publicar artigo:", error);

      // Restaurar botão
      const submitBtn = form.querySelector(".btn-submit");
      submitBtn.innerHTML = "Publicar Artigo Completo";
      submitBtn.disabled = false;

      // Mensagem de erro mais específica
      let errorMessage = "Erro ao publicar artigo";
      if (error.message.includes("404")) {
        errorMessage =
          "Serviço temporariamente indisponível. Verifique se o servidor está rodando.";
      } else if (error.message.includes("413")) {
        errorMessage =
          "Arquivos muito grandes. Reduza o tamanho e tente novamente.";
      } else if (error.message.includes("500")) {
        errorMessage =
          "Erro interno do servidor. Tente novamente em alguns minutos.";
      } else if (error.message.includes("Network Error")) {
        errorMessage =
          "Erro de conexão. Verifique sua internet e se o servidor está rodando.";
      } else if (
        error.message.includes("401") ||
        error.message.includes("403")
      ) {
        errorMessage =
          "Acesso não autorizado. Verifique se você está logado como administrador.";
      } else {
        errorMessage = error.message || "Erro ao publicar artigo";
      }

      utils.showMessage(errorMessage, "error", 5000);
    }
  });
}

// Variáveis globais
let autorCount = 1;

// Inicialização quando o DOM carregar
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 DOM Carregado - Inicializando página ADM");

  // Inicializar sistema de informações
  InfoSystem.init();

  const form = document.getElementById("form-artigo-completo");
  const autoresContainer = document.getElementById("autores-container");
  const btnAdicionarAutor = document.getElementById("adicionar-autor");

  function setupFileUploadIndicators() {
    document.querySelectorAll('input[type="file"]').forEach((input) => {
      input.addEventListener("change", function () {
        const statusElement = this.parentElement.querySelector(".file-status");
        if (this.files.length > 0) {
          if (this.multiple) {
            statusElement.textContent = `✔ ${this.files.length} arquivo(s) selecionado(s)`;
          } else {
            statusElement.textContent = "✔ " + this.files[0].name;
          }
          statusElement.style.color = "#27ae60";
          statusElement.style.fontWeight = "600";
          // Remover borda de erro se houver
          this.style.borderColor = "";
        } else {
          statusElement.textContent = "Anexar arquivo";
          statusElement.style.color = "";
          statusElement.style.fontWeight = "";
        }
      });

      // Adicionar validação visual
      input.addEventListener("invalid", function () {
        this.style.borderColor = "var(--accent)";
      });

      input.addEventListener("focus", function () {
        this.style.borderColor = "";
      });
    });
  }

  function setupFileUploadForElement(element) {
    element.querySelectorAll('input[type="file"]').forEach((input) => {
      input.addEventListener("change", function () {
        const statusElement = this.parentElement.querySelector(".file-status");
        if (this.files.length > 0) {
          statusElement.textContent = "✔ " + this.files[0].name;
          statusElement.style.color = "#27ae60";
          statusElement.style.fontWeight = "600";
          this.style.borderColor = "";
        }
      });
    });
  }

  // Configurar indicadores de arquivo
  setupFileUploadIndicators();

  // Adicionar autor dinamicamente
  if (btnAdicionarAutor) {
    btnAdicionarAutor.addEventListener("click", function () {
      if (autorCount >= 3) {
        utils.showMessage("Máximo de 3 autores permitidos", "error", 3000);
        return;
      }

      autorCount++;
      const autorDiv = document.createElement("div");
      autorDiv.className = "autor-group";
      autorDiv.dataset.autorId = autorCount;

      const numeroAutor = getAutorNumber(autorCount);

      autorDiv.innerHTML = `
                <div class="autor-header">
                    <span class="autor-number">${numeroAutor}</span>
                    <h3>Autor ${autorCount}</h3>
                    <button type="button" class="btn-remove-autor" onclick="removeAutor(this)">✕ Remover</button>
                </div>
                <div class="input-group">
                    <label>
                        Nome autor ${autorCount}:
                        <button type="button" class="info-btn" data-info="nome-autor">ℹ️</button>
                    </label>
                    <input type="text" name="autor-nome[]" required>
                </div>
                <div class="input-group">
                    <label>
                        Imagem do coautor ${autorCount - 1}:
                        <button type="button" class="info-btn" data-info="imagem-autor">ℹ️</button>
                    </label>
                    <div class="file-upload-group">
                        <input type="file" name="autor-imagem[]" accept="image/jpeg,image/jpg,image/png" required>
                        <span class="file-status">Anexar arquivo</span>
                    </div>
                </div>
            `;

      autoresContainer.appendChild(autorDiv);
      setupFileUploadForElement(autorDiv);

      // Re-inicializar sistema de informações para os novos botões
      InfoSystem.setupInfoButtons();

      // Atualizar visibilidade do botão de adicionar
      updateAddButtonVisibility();
    });
  }

  // Envio do formulário
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const token = localStorage.getItem("token");
      if (!token) {
        utils.showMessage("Usuário não autenticado", "error", 3000);
        return;
      }

      // Validar arquivos
      if (!validateFiles()) {
        return;
      }

      try {
        utils.showMessage("Enviando artigo...", "success", 2000);

        // Criar FormData para envio
        const formData = new FormData();

        // Dados básicos
        formData.append(
          "nomeArtista",
          document.getElementById("nome-artista").value
        );

        formData.append(
          "conteudoArtigo",
          document.getElementById("conteudo-artigo").value
        );

        formData.append(
          "tempoVida",
          document.getElementById("tempo-vida").value
        );

        // Imagem da artista
        const imagemArtista =
          document.getElementById("imagem-artista").files[0];
        if (imagemArtista) {
          formData.append("imagemArtista", imagemArtista);
        }

        // Autores
        const autoresNomes = document.querySelectorAll(
          'input[name="autor-nome[]"]'
        );
        const autoresImagens = document.querySelectorAll(
          'input[name="autor-imagem[]"]'
        );

        autoresNomes.forEach((nomeInput, index) => {
          if (nomeInput.value.trim()) {
            formData.append(`autores[${index}][nome]`, nomeInput.value);
            if (autoresImagens[index] && autoresImagens[index].files[0]) {
              formData.append(
                `autores[${index}][imagem]`,
                autoresImagens[index].files[0]
              );
            }
          }
        });

        // Arquivos
        const verbeteFile = document.getElementById("verbete").files[0];
        const premiacoesFile = document.getElementById("premiacoes").files[0];

        if (verbeteFile) formData.append("verbete", verbeteFile);
        if (premiacoesFile) formData.append("premiacoes", premiacoesFile);

        // Imagens múltiplas
        const imagensFiles = document.getElementById("imagens").files;
        for (let i = 0; i < imagensFiles.length; i++) {
          formData.append("imagens", imagensFiles[i]);
        }

        console.log("📤 Enviando formulário com dados:", {
          nomeArtista: document.getElementById("nome-artista").value,
          tempoVida: document.getElementById("tempo-vida").value,
          conteudoArtigo:
            document.getElementById("conteudo-artigo").value.substring(0, 100) +
            "...", // Primeiros 100 chars
          autores: Array.from(autoresNomes).map((a) => a.value),
          arquivos: {
            imagemArtista: imagemArtista?.name,
            verbete: verbeteFile?.name,
            premiacoes: premiacoesFile?.name,
            imagens: Array.from(imagensFiles).map((f) => f.name),
          },
        });

        // Enviar para a API
        let response;
        try {
          response = await api.post("/artigos/artigos-completos", formData);
        } catch (firstError) {
          console.log(
            "🔄 Primeira tentativa falhou, usando fallback...",
            firstError
          );
          response = await tryAlternativeUpload(formData);
        }

        if (response && response.id) {
          utils.showMessage("Artigo publicado com sucesso!", "success", 3000);
          form.reset();
          resetFileIndicators();
          resetAutores();

          // Redirecionar para o artigo após 2 segundos
          setTimeout(() => {
            window.location.href = `artigo.html?id=${response.id}`;
          }, 2000);
        } else {
          throw new Error("Resposta inválida do servidor");
        }
      } catch (error) {
        console.error("Erro ao publicar artigo:", error);

        let errorMessage = "Erro ao publicar artigo";
        if (error.message.includes("404")) {
          errorMessage =
            "Serviço temporariamente indisponível. Verifique se o servidor está rodando.";
        } else if (error.message.includes("413")) {
          errorMessage =
            "Arquivos muito grandes. Reduza o tamanho e tente novamente.";
        } else if (error.message.includes("500")) {
          errorMessage =
            "Erro interno do servidor. Tente novamente em alguns minutos.";
        } else if (error.message.includes("Network Error")) {
          errorMessage =
            "Erro de conexão. Verifique sua internet e se o servidor está rodando.";
        } else {
          errorMessage = error.message || "Erro ao publicar artigo";
        }

        utils.showMessage(errorMessage, "error", 5000);
      }
    });
  }
  
  // Inicializar
  updateAddButtonVisibility();
});
