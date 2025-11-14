document.addEventListener('click', e => {
  if (e.target && e.target.matches('.upload-btn')) {
    const button = e.target;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', async () => {
      if (!input.files.length) return;
      const file = input.files[0];
      const fd = new FormData();
      fd.append('file', file);
      // determine target folder from button data attribute or parent
      let endpoint = '/upload/artigos';
      if (button.closest('.image-artist') || button.closest('.image-autor') || button.closest('.image-artist-btn')) endpoint = '/upload/artistas';
      try {
        const res = await fetch(`http://localhost:3000/api${endpoint}`, { method: 'POST', body: fd });
        const data = await res.json();
        button.nextElementSibling && (button.nextElementSibling.style.background = '#27ae60');
        showMessage('Arquivo anexado com sucesso', 'success', 2500);
      } catch (err) {
        console.error(err);
        showMessage('Erro no upload', 'error', 3000);
      }
    });
    input.click();
  }
});
