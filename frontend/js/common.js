function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function authHeader() {
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  };
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '../index.html';
}

function protectPage(requiredRole) {
  const user = getUser();
  if (!user || user.role !== requiredRole) {
    window.location.href = '../index.html';
  }
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}
