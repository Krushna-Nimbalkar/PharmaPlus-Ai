protectPage('admin');

const usersTable = document.getElementById('usersTable');

async function loadUsers() {
  const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeader() });
  const users = await res.json();

  usersTable.innerHTML = users
    .map(
      (user) => `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${user.specialization || user.company || '-'}</td>
        <td>
          ${user.role !== 'admin' ? `<button onclick="removeUser('${user._id}')">Delete</button>` : '-'}
        </td>
      </tr>
    `
    )
    .join('');
}

async function removeUser(id) {
  await fetch(`${API_BASE}/admin/users/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  loadUsers();
}

window.removeUser = removeUser;

document.getElementById('doctorForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: doctorName.value,
    email: doctorEmail.value,
    specialization: doctorSpecialization.value,
    password: doctorPassword.value
  };

  await fetch(`${API_BASE}/admin/doctor`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(payload)
  });

  e.target.reset();
  loadUsers();
});

document.getElementById('mrForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: mrName.value,
    email: mrEmail.value,
    company: mrCompany.value,
    password: mrPassword.value
  };

  await fetch(`${API_BASE}/admin/mr`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(payload)
  });

  e.target.reset();
  loadUsers();
});

loadUsers();
