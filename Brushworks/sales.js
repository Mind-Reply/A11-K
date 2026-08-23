const form = document.querySelector('#salesLeadForm');
const status = document.querySelector('#salesLeadStatus');
form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const response = await fetch('/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Enquiry was not stored');
    form.reset();
    if (status) status.textContent = 'Enquiry stored locally · controlled follow-up required';
  } catch (error) {
    if (status) status.textContent = `${error.message} · run npm run dev`;
  }
});
