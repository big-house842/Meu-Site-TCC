// artigos.js - Atualizado para sincronizar com artistas

// Carregar artigos listagem
async function fetchArtigos() {
    try {
      const artigos = await api.get('/artigos');
      const wrapper = document.querySelector('.articles-list');
      if (!wrapper) return artigos;
      
      wrapper.innerHTML = '';
      artigos.forEach(a => {
        const node = document.createElement('a');
        node.href = `artigo.html?id=${a.id}`;
        node.innerHTML = `
          <div class="article-div">
            <p>${a.titulo || a.nomeArtista || 'Artigo sem título'}</p>
            <div class="subtopics-div">
              <p class="subtopic-text">${a.autor || a.nomeArtista || ''}</p>
            </div>
          </div>
        `;
        wrapper.appendChild(node);
      });
      return artigos;
    } catch (err) { 
      console.error('Erro ao carregar artigos:', err); 
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    fetchArtigos();
  });