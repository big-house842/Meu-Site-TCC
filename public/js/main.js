document.addEventListener('DOMContentLoaded', () => {
  setTimeout(()=> {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const loginBtn = document.getElementById('loginBtn');
    const adminLink = document.getElementById('adminLink');
    if (loginBtn) loginBtn.textContent = token ? 'Minha Conta' : 'Login';
    if (userStr && adminLink) {
      try {
        const user = JSON.parse(userStr);
        const adminEmails = ["teste1@gmail.com","teste2@email.com","admin@artistasparanaenses.com"];
        if (adminEmails.includes(user.email)) adminLink.style.display = 'block';
      } catch(e){}
    }
  }, 250);
});
