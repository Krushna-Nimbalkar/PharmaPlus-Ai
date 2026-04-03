protectPage('doctor');

const user = getUser();
document.getElementById('doctorInfo').textContent = `${user.name} (${user.specialization})`;

const drugList = document.getElementById('drugList');

function feedbackForm(drug) {
  const existing = drug.feedback;
  return `
    <form onsubmit="submitFeedback(event, '${drug._id}')">
      <select name="opinion" required>
        <option value="approve" ${existing?.opinion === 'approve' ? 'selected' : ''}>Approve</option>
        <option value="reject" ${existing?.opinion === 'reject' ? 'selected' : ''}>Reject</option>
        <option value="comment" ${existing?.opinion === 'comment' ? 'selected' : ''}>Comment</option>
      </select>
      <textarea name="message" placeholder="Add comments">${existing?.message || ''}</textarea>
      <button type="submit">Submit Feedback</button>
    </form>
  `;
}

async function loadDrugs() {
  const res = await fetch(`${API_BASE}/doctor/drugs`, { headers: authHeader() });
  const drugs = await res.json();

  drugList.innerHTML = drugs.length
    ? drugs
        .map(
          (drug) => `
      <article class="drug-card">
        <h4>${drug.name}</h4>
        <p><strong>Category:</strong> ${drug.category}</p>
        <p><strong>Description:</strong> ${drug.description}</p>
        <p><strong>Added By:</strong> ${drug.addedBy?.name || 'N/A'} (${drug.addedBy?.company || '-'})</p>
        ${feedbackForm(drug)}
      </article>
    `
        )
        .join('')
    : '<p>No drugs available for your specialization yet.</p>';
}

async function submitFeedback(event, drugId) {
  event.preventDefault();
  const form = event.target;

  await fetch(`${API_BASE}/doctor/feedback`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({
      drugId,
      opinion: form.opinion.value,
      message: form.message.value
    })
  });

  loadDrugs();
}

window.submitFeedback = submitFeedback;

loadDrugs();
