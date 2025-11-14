// artistas.js - Agora simplificado, pois o carousel cuida de tudo

// Esta função pode ser removida ou mantida para compatibilidade
async function fetchArtistas() {
    try {
      const artistas = await api.get('/artistas');
      console.log('Artistas carregados:', artistas);
      return artistas;
    } catch (err) { 
      console.error('Erro ao carregar artistas:', err);
      return [];
    }
  }
  
  // Opcional: manter para outras páginas que usam artistas
  document.addEventListener('DOMContentLoaded', () => {
    fetchArtistas();
  });