// carousel.js - Versão simplificada e corrigida
const CarouselSystem = {
  currentIndex: 0,
  cardsPerView: 3,
  intervalId: null,
  track: null,

  // Carousel automático (apresentação)
  initAuto() {
    const carousels = document.querySelectorAll('.automatic-carousel');
    carousels.forEach(carousel => {
      const items = carousel.querySelector('.carousel-itens');
      if (!items) return;
     
      const slides = items.children;
      const totalSlides = slides.length;
     
      Array.from(slides).forEach(slide => {
        slide.style.width = '100%';
        slide.style.flexShrink = '0';
      });

      let currentIndex = 0;
     
      const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        items.style.transform = `translateX(-${currentIndex * 100}%)`;
        items.style.transition = 'transform 0.8s ease';
      };

      let interval = setInterval(nextSlide, 5000);

      carousel.addEventListener('mouseenter', () => clearInterval(interval));
      carousel.addEventListener('mouseleave', () => {
        interval = setInterval(nextSlide, 5000);
      });
    });
  },

  // Carousel de artistas - SIMPLIFICADO
  initArtistCarousel() {
    this.track = document.getElementById('artistsCarouselTrack');
    const prevBtn = document.querySelector('.carousel-arrow-left');
    const nextBtn = document.querySelector('.carousel-arrow-right');
   
    if (!this.track) {
      console.log('❌ Carousel track não encontrado');
      return;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    this.loadArtistas().then(artistas => {
      if (artistas.length > 0) {
        this.renderArtistas(artistas);
        this.updateCarousel();
        this.startAutoPlay();
      }
    });

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
      const artistas = await api.get('/artistas');
      console.log(`✅ ${artistas.length} artistas carregados`);
      return artistas;
    } catch (error) {
      console.error('❌ Erro ao carregar artistas:', error);
      return [];
    }
  },

  renderArtistas(artistas) {
    if (!this.track) return;

    if (artistas.length === 0) {
      this.track.innerHTML = `
        <div class="artists-loading">
          <p>Nenhuma artista encontrada no momento.</p>
        </div>
      `;
      return;
    }

    this.track.innerHTML = artistas.map(artista => `
      <div class="artist-card">
        <a href="artigo.html?id=${artista.id}" class="artist-card-link">
          <div class="artist-image-container">
            <img
              src="${artista.imageUrl || 'imagens/placeholder-artist.jpg'}"
              alt="${artista.nome}"
              class="artist-image"
              loading="lazy"
              onerror="this.src='imagens/placeholder-artist.jpg'"
            >
          </div>
          <div class="artist-info">
            <h3 class="artist-name">${artista.nome}</h3>
            <p class="artist-bio">${artista.bio || 'Conheça a trajetória desta artista paranaense...'}</p>
            <div class="artist-cta">Ver perfil →</div>
          </div>
        </a>
      </div>
    `).join('');

    this.totalCards = artistas.length;
    this.cardsPerView = this.getCardsPerView();
  },

  nextSlide() {
    if (!this.track) return;
   
    const totalCards = this.totalCards || this.track.children.length;
    const maxIndex = Math.max(0, Math.ceil(totalCards / this.cardsPerView) - 1);
   
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
   
    this.updateCarousel();
  },

  prevSlide() {
    if (!this.track) return;
   
    const totalCards = this.totalCards || this.track.children.length;
    const maxIndex = Math.max(0, Math.ceil(totalCards / this.cardsPerView) - 1);
   
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = maxIndex;
    }
   
    this.updateCarousel();
  },

  updateCarousel() {
    if (!this.track || !this.track.children.length) return;

    const cardWidth = this.track.children[0].offsetWidth || 320;
    const gap = 32;
    const translateX = -this.currentIndex * (cardWidth + gap) * this.cardsPerView;
   
    this.track.style.transform = `translateX(${translateX}px)`;
    this.track.style.transition = 'transform 0.6s ease';

    this.updateButtons();
  },

  updateButtons() {
    const totalCards = this.totalCards || (this.track ? this.track.children.length : 0);
    const maxIndex = Math.max(0, Math.ceil(totalCards / this.cardsPerView) - 1);
   
    if (this.prevBtn) {
      const prevBtn = document.querySelector('.carousel-arrow-left');
      prevBtn.disabled = this.currentIndex === 0;
      prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
    }
   
    if (this.nextBtn) {
      const nextBtn = document.querySelector('.carousel-arrow-right');
      nextBtn.disabled = this.currentIndex >= maxIndex;
      nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
    }
  },

  startAutoPlay() {
    if (this.intervalId) clearInterval(this.intervalId);
   
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 6000);
  },

  initAll() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initAuto();
      
      setTimeout(() => {
        this.initArtistCarousel();
      }, 1000);
     
      const carousel = document.querySelector('.artists-carousel');
      if (carousel) {
        carousel.addEventListener('mouseenter', () => {
          if (this.intervalId) clearInterval(this.intervalId);
        });
        carousel.addEventListener('mouseleave', () => this.startAutoPlay());
      }
    });
  }
};

CarouselSystem.initAll();