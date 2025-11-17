// carousel.js - Versão corrigida (apenas carousel automático)

const CarouselSystem = {
  currentIndex: 0,
  cardsPerView: 3,
  intervalId: null,
  isAnimating: false,
  autoCarouselIntervals: new Map(),

  // Carousel automático CORRIGIDO - SIMPLIFICADO
  initAuto() {
    const carousels = document.querySelectorAll('.automatic-carousel');
    
    carousels.forEach((carousel, index) => {
      const items = carousel.querySelector('.carousel-itens');
      if (!items) return;
     
      const slides = items.children;
      const totalSlides = slides.length;
      
      if (totalSlides === 0) return;

      // Configurar largura dos slides
      Array.from(slides).forEach(slide => {
        slide.style.minWidth = '100%';
        slide.style.flexShrink = '0';
        slide.style.flex = '0 0 100%';
      });

      let currentIndex = 0;
      items.style.transform = 'translateX(0)';
      
      // Função SIMPLIFICADA para mudar slide
      const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        const translateX = -currentIndex * 100;
        
        items.style.transform = `translateX(${translateX}%)`;
        items.style.transition = 'transform 0.8s ease-in-out';
      };

      // Iniciar autoplay
      const interval = setInterval(nextSlide, 4000);
      this.autoCarouselIntervals.set(carousel, interval);

      // Pausar no hover
      carousel.addEventListener('mouseenter', () => {
        const interval = this.autoCarouselIntervals.get(carousel);
        if (interval) {
          clearInterval(interval);
          this.autoCarouselIntervals.delete(carousel);
        }
      });
      
      carousel.addEventListener('mouseleave', () => {
        if (!this.autoCarouselIntervals.has(carousel)) {
          const newInterval = setInterval(nextSlide, 4000);
          this.autoCarouselIntervals.set(carousel, newInterval);
        }
      });

      console.log(`✅ Carousel automático ${index + 1} inicializado com ${totalSlides} slides`);
    });
  },

  // ===== CAROUSEL DE ARTISTAS =====
  // MANTENHA TODO O CÓDIGO DO CAROUSEL DE ARTISTAS EXATAMENTE COMO ESTÁ
  // NÃO ALTERE NADA DAQUI PARA BAIXO

  initArtistCarousel() {
    const track = document.getElementById('artistsCarouselTrack');
    const prevBtn = document.querySelector('.carousel-arrow-left');
    const nextBtn = document.querySelector('.carousel-arrow-right');
   
    if (!track) {
      console.log('❌ Carousel track não encontrado');
      return;
    }

    this.track = track;
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;

    // Configurar eventos
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (!this.isAnimating) this.prevSlide();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!this.isAnimating) this.nextSlide();
      });
    }

    // Inicializar
    this.loadArtistas().then(artistas => {
      if (artistas.length > 0) {
        this.renderArtistas(artistas);
        this.updateCarousel();
        this.startAutoPlay();
      } else {
        this.showEmptyState();
      }
    });

    // Redimensionamento responsivo
    window.addEventListener('resize', () => {
      this.cardsPerView = this.getCardsPerView();
      this.updateCarousel();
    });
  },

  getCardsPerView() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  },

  async loadArtistas() {
    try {
      console.log('🔄 Carregando artigos para o carousel...');
      const artigos = await api.get('/artigos');
      console.log(`✅ ${artigos.length} artigos carregados para o carousel`);
      
      // Filtrar apenas artigos que têm imagem da artista
      const artigosComImagem = artigos.filter(artigo => 
        artigo.imagemArtistaUrl || artigo.imageUrl
      );
      
      console.log(`🎨 ${artigosComImagem.length} artigos com imagem disponíveis`);
      return artigosComImagem;
    } catch (error) {
      console.error('❌ Erro ao carregar artigos para o carousel:', error);
      return [];
    }
  },

  renderArtistas(artigos) {
    if (!this.track) return;

    if (artigos.length === 0) {
      this.showEmptyState();
      return;
    }

    this.track.innerHTML = artigos.map(artigo => `
      <div class="artist-card">
        <a href="artigo.html?id=${artigo.id}" class="artist-card-link">
          <div class="artist-image-container">
            <img
              src="${artigo.imagemArtistaUrl || artigo.imageUrl || 'imagens/placeholder-artist.jpg'}"
              alt="${artigo.nomeArtista || artigo.titulo || 'Artista'}"
              class="artist-image"
              loading="lazy"
              onerror="this.src='imagens/placeholder-artist.jpg'"
            >
            <div class="artist-image-overlay"></div>
          </div>
          <div class="artist-info">
            <h3 class="artist-name">${artigo.nomeArtista || artigo.titulo || 'Artista Paranaense'}</h3>
            <p class="artist-bio">${this.getBioResumida(artigo)}</p>
            <div class="artist-cta">Ver perfil completo →</div>
          </div>
        </a>
      </div>
    `).join('');

    this.totalSlides = artigos.length;
    this.cardsPerView = this.getCardsPerView();
    
    console.log(`🎨 ${artigos.length} artigos renderizados no carousel`);
  },

  getBioResumida(artigo) {
    // Tenta pegar a bio do artigo de diferentes formas
    if (artigo.bio) {
      return artigo.bio.length > 100 ? artigo.bio.substring(0, 100) + '...' : artigo.bio;
    }
    
    if (artigo.conteudoArtigo) {
      const conteudoLimpo = artigo.conteudoArtigo.replace(/\[IMAGEM:\d+\]/g, '').trim();
      return conteudoLimpo.length > 100 ? conteudoLimpo.substring(0, 100) + '...' : conteudoLimpo;
    }
    
    if (artigo.conteudo) {
      return artigo.conteudo.length > 100 ? artigo.conteudo.substring(0, 100) + '...' : artigo.conteudo;
    }
    
    return 'Conheça a trajetória completa desta incrível artista paranaense...';
  },

  showEmptyState() {
    if (!this.track) return;
    
    this.track.innerHTML = `
      <div class="artists-empty-state">
        <div class="empty-icon">🎨</div>
        <h3>Nenhuma artista encontrada</h3>
        <p>Em breve teremos novidades!</p>
      </div>
    `;
    
    // Desabilitar navegação quando não há artistas
    if (this.prevBtn) this.prevBtn.style.display = 'none';
    if (this.nextBtn) this.nextBtn.style.display = 'none';
  },

  nextSlide() {
    if (!this.track || this.isAnimating) return;
    
    this.isAnimating = true;
    const totalSlides = this.totalSlides || this.track.children.length;
    const maxIndex = Math.ceil(totalSlides / this.cardsPerView) - 1;
   
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Volta ao início
    }
   
    this.updateCarousel();
    
    // Reset da flag após animação
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  },

  prevSlide() {
    if (!this.track || this.isAnimating) return;
    
    this.isAnimating = true;
    const totalSlides = this.totalSlides || this.track.children.length;
    const maxIndex = Math.ceil(totalSlides / this.cardsPerView) - 1;
   
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = maxIndex; // Vai para o final
    }
   
    this.updateCarousel();
    
    // Reset da flag após animação
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  },

  updateCarousel() {
    if (!this.track) return;

    const cardWidth = this.track.children[0]?.offsetWidth || 320;
    const gap = 32;
    const translateX = -this.currentIndex * (cardWidth + gap) * this.cardsPerView;
   
    this.track.style.transform = `translateX(${translateX}px)`;
    this.track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    // Atualizar estado dos botões
    this.updateButtons();
    
    console.log(`🔄 Carousel atualizado: índice ${this.currentIndex}, translateX: ${translateX}px`);
  },

  updateButtons() {
    const totalSlides = this.totalSlides || this.track.children.length;
    const maxIndex = Math.ceil(totalSlides / this.cardsPerView) - 1;
   
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
      this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
      this.prevBtn.style.cursor = this.currentIndex === 0 ? 'not-allowed' : 'pointer';
    }
   
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex >= maxIndex;
      this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
      this.nextBtn.style.cursor = this.currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
    }
  },

  startAutoPlay() {
    // Limpar intervalo anterior se existir
    if (this.intervalId) clearInterval(this.intervalId);
    
    // Só inicia autoplay se houver mais de 1 card por view
    if (this.cardsPerView < (this.totalSlides || 0)) {
      console.log('▶️ Iniciando autoplay do carousel');
      
      // Iniciar autoplay a cada 8 segundos (mais lento)
      this.intervalId = setInterval(() => {
        if (!this.isAnimating) {
          this.nextSlide();
        }
      }, 8000);
    }
  },

  stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏸️ Autoplay parado');
    }
  },

  // Inicializar tudo
  initAll() {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('🚀 Inicializando sistemas de carousel...');
      
      // Pequeno delay para garantir que o DOM esteja completamente pronto
      setTimeout(() => {
        this.initAuto();
        this.initArtistCarousel();
       
        // Pausar autoplay quando o usuário interagir
        const carousel = document.querySelector('.artists-carousel');
        if (carousel) {
          carousel.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
            console.log('🐭 Mouse entrou - autoplay pausado');
          });
          
          carousel.addEventListener('mouseleave', () => {
            this.startAutoPlay();
            console.log('🐭 Mouse saiu - autoplay retomado');
          });
          
          // Também pausar no focus para acessibilidade
          carousel.addEventListener('focusin', () => this.stopAutoPlay());
          carousel.addEventListener('focusout', () => this.startAutoPlay());
        }
      }, 500);
    });
  }
};

// Inicializar
CarouselSystem.initAll();