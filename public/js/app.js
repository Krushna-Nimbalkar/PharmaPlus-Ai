const state = {
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user') || 'null'),
};

const els = {
  loginSection: document.getElementById('loginSection'),
  adminSection: document.getElementById('adminSection'),
  doctorSection: document.getElementById('doctorSection'),
  mrSection: document.getElementById('mrSection'),
  navActions: document.getElementById('navActions'),
};

const api = async (url, method = 'GET', body) => {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

const showStatus = (container, message, isError = false) => {
  const div = document.createElement('div');
  div.className = 'status';
  div.style.color = isError ? '#dc3545' : '#1a7f37';
  div.textContent = message;
  container.prepend(div);
  setTimeout(() => div.remove(), 3500);
};

const logout = () => {
  state.token = '';
  state.user = null;
  localStorage.clear();
  render();
};

const login = async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const data = await api('/api/auth/login', 'POST', { email, password });

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('token', state.token);
    localStorage.setItem('user', JSON.stringify(state.user));
    render();
  } catch (error) {
    alert(error.message);
  }
};

document.getElementById('loginForm').addEventListener('submit', login);

const renderNav = () => {
  els.navActions.innerHTML = state.user
    ? `<span>${state.user.name} (${state.user.role})</span> <button class="secondary" onclick="logout()">Logout</button>`
    : '';
};

const renderAdmin = async () => {
  const users = await api('/api/admin/users');
  els.adminSection.innerHTML = `
    <h2>Admin Dashboard</h2>
    <div class="form-grid">
      <form id="addDoctorForm" class="card">
        <h3>Add Doctor</h3>
        <input required name="name" placeholder="Name" />
        <input required name="email" type="email" placeholder="Email" />
        <input required name="specialization" placeholder="Specialization" />
        <input required name="password" type="password" placeholder="Password" />
        <button type="submit">Add Doctor</button>
      </form>
      <form id="addMrForm" class="card">
        <h3>Add MR</h3>
        <input required name="name" placeholder="Name" />
        <input required name="email" type="email" placeholder="Email" />
        <input required name="company" placeholder="Company" />
        <input required name="password" type="password" placeholder="Password" />
        <button type="submit">Add MR</button>
      </form>
    </div>

    <h3>All Users</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Specialization/Company</th><th>Action</th></tr>
        </thead>
        <tbody>
          ${users
            .map(
              (u) => `<tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td>${u.specialization || u.company || '-'}</td>
                <td>${u.role === 'admin' ? '-' : `<button class="danger" onclick="deleteUser('${u._id}')">Delete</button>`}</td>
              </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('addDoctorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    try {
      await api('/api/admin/doctor', 'POST', form);
      render();
    } catch (err) {
      showStatus(els.adminSection, err.message, true);
    }
  });

  document.getElementById('addMrForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    try {
      await api('/api/admin/mr', 'POST', form);
      render();
    } catch (err) {
      showStatus(els.adminSection, err.message, true);
    }
  });
};

const renderDoctor = async () => {
  const drugs = await api('/api/doctor/drugs');
  els.doctorSection.innerHTML = `
    <h2>Doctor Dashboard (${state.user.specialization || 'No specialization'})</h2>
    ${
      drugs.length
        ? drugs
            .map(
              (d) => `<div class="drug-card">
                  <h3>${d.name}</h3>
                  <p><strong>Category:</strong> ${d.category}</p>
                  <p><strong>Description:</strong> ${d.description}</p>
                  <form class="feedbackForm form-grid" data-drug="${d._id}">
                    <select name="opinion" required>
                      <option value="approve">Approve</option>
                      <option value="reject">Reject</option>
                      <option value="comment">Comment</option>
                    </select>
                    <input name="message" placeholder="Feedback message" />
                    <button type="submit">Submit Feedback</button>
                  </form>
                </div>`
            )
            .join('')
        : '<p>No matching drugs yet.</p>'
    }
  `;

  document.querySelectorAll('.feedbackForm').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = Object.fromEntries(new FormData(form));
      payload.drugId = form.dataset.drug;
      try {
        await api('/api/doctor/feedback', 'POST', payload);
        showStatus(els.doctorSection, 'Feedback submitted');
      } catch (err) {
        showStatus(els.doctorSection, err.message, true);
      }
    });
  });
};

const renderMr = async () => {
  const drugs = await api('/api/mr/drugs');
  els.mrSection.innerHTML = `
    <h2>MR Dashboard</h2>
    <form id="drugForm" class="form-grid">
      <input required name="name" placeholder="Drug name" />
      <input required name="category" placeholder="Category" />
      <input required name="targetSpecialization" placeholder="Target specialization" />
      <textarea required name="description" placeholder="Description"></textarea>
      <button type="submit">Add Drug & Notify Doctors</button>
    </form>

    <h3>Submitted Drugs</h3>
    ${
      drugs.length
        ? drugs
            .map(
              (d) => `<div class="drug-card">
                <h4>${d.name}</h4>
                <p>${d.description}</p>
                <p><strong>Category:</strong> ${d.category}</p>
                <p><strong>Target:</strong> ${d.targetSpecialization}</p>
              </div>`
            )
            .join('')
        : '<p>No drugs submitted yet.</p>'
    }
  `;

  document.getElementById('drugForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    try {
      const data = await api('/api/mr/drug', 'POST', form);
      showStatus(els.mrSection, data.message);
      render();
    } catch (err) {
      showStatus(els.mrSection, err.message, true);
    }
  });
};

const deleteUser = async (id) => {
  if (!confirm('Delete this user?')) return;
  try {
    await api(`/api/admin/user/${id}`, 'DELETE');
    render();
  } catch (err) {
    showStatus(els.adminSection, err.message, true);
  }
};

window.logout = logout;
window.deleteUser = deleteUser;

const render = async () => {
  renderNav();
  els.loginSection.classList.toggle('hidden', !!state.user);
  els.adminSection.classList.add('hidden');
  els.doctorSection.classList.add('hidden');
  els.mrSection.classList.add('hidden');

  if (!state.user) return;

  try {
    if (state.user.role === 'admin') {
      els.adminSection.classList.remove('hidden');
      await renderAdmin();
    } else if (state.user.role === 'doctor') {
      els.doctorSection.classList.remove('hidden');
      await renderDoctor();
    } else if (state.user.role === 'mr') {
      els.mrSection.classList.remove('hidden');
      await renderMr();
    }
  } catch (error) {
    if (error.message.includes('Unauthorized')) logout();
  }
};

render();
