(() => {
  const form = document.querySelector('#resellerOpportunityForm');
  const status = document.querySelector('#resellerStatus');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      name: document.querySelector('#resellerName')?.value.trim(),
      email: document.querySelector('#resellerEmail')?.value.trim(),
      interest: `Reseller: ${document.querySelector('#resellerNeed')?.value}`,
      brief: document.querySelector('#resellerBrief')?.value.trim()
    };
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Opportunity not stored');
      form.reset();
      status.textContent = 'Opportunity stored locally · follow-up required · no external action taken';
    } catch (error) { status.textContent = error.message || 'Start npm run dev for local storage'; }
  });
})();
