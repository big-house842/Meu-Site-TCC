// utils.js - Melhor tratamento de mensagens

function el(q, ctx=document){ return ctx.querySelector(q); }
function all(q, ctx=document){ return Array.from(ctx.querySelectorAll(q)); }

function showMessage(text, type='success', timeout=3500){
    console.log(`💬 Exibindo mensagem: ${text} (${type})`);
    
    // Remove mensagens existentes
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    const div = document.createElement('div');
    div.className = type === 'error' ? 'error-message' : 'success-message';
    div.textContent = text;
    div.style.position = 'fixed';
    div.style.top = '20px';
    div.style.right = '20px';
    div.style.zIndex = '10001';
    div.style.padding = '1rem 1.5rem';
    div.style.borderRadius = '8px';
    div.style.fontWeight = '600';
    div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    document.body.appendChild(div);
    
    // Animação de entrada
    setTimeout(() => {
        div.style.opacity = '1';
        div.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(()=>{
        div.style.opacity = '0';
        div.style.transform = 'translateY(-20px)';
        setTimeout(()=>div.remove(), 300);
    }, timeout);
}

function setImageFallback() {
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'imagens/placeholder.jpg';
        }
    }, true);
}

window.utils = { el, all, showMessage, setImageFallback };