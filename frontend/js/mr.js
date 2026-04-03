protectPage('mr');

const drugForm = document.getElementById('drugForm');
const mrDrugList = document.getElementById('mrDrugList');
const submitStatus = document.getElementById('submitStatus');

async function loadDrugs() {
  const res = await fetch(`${API_BASE}/mr/drugs`, { headers: authHeader() });
  const drugs = await res.json();

  mrDrugList.innerHTML = drugs.length
    ? drugs
        .map(
          (drug) => `
      <article class="drug-card">
        <h4>${drug.name}</h4>
        <p><strong>Category:</strong> ${drug.category}</p>
        <p><strong>Description:</strong> ${drug.description}</p>
        <p><strong>Target:</strong> ${drug.targetSpecialization}</p>
      </article>
    `
        )
        .join('')
    : '<p>No drugs submitted yet.</p>';
}

drugForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitStatus.textContent = 'Submitting...';

  const payload = {
    name: drugName.value,
    category: drugCategory.value,
    description: drugDescription.value,
    targetSpecialization: drugSpecialization.value
  };

  const res = await fetch(`${API_BASE}/mr/drugs`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    submitStatus.textContent = data.message || 'Failed to submit drug';
    return;
  }

  submitStatus.textContent = `Drug submitted. Email sent to ${data.notifiedDoctors} doctors.`;
  e.target.reset();
  loadDrugs();
});

loadDrugs();
