(() => {
  const fallbackPortfolio = [
    { id: 'a11-k', name: 'A11-K.space', category: 'Private SuperIntelligence operating layer', outcome: 'A sovereign control surface for high-value work, research, and execution.', url: 'https://a11-k.space' },
    { id: 'mindreply', name: 'MindReply', category: 'Reply, offer, and next-action system', outcome: 'Turns missed replies and unclear offers into calm, persuasive next actions.', url: 'https://mind-reply.com' },
    { id: 'aurel', name: 'Aurel', category: 'Premium infrastructure and operations', outcome: 'High-trust digital operations presented with a premium, focused experience.', url: 'https://aurel.io' },
    { id: 'brushworks', name: 'Brushworks', category: 'Design-to-site studio', outcome: 'Move from direction to a structured, exportable site package.', url: 'https://a11-k.space/brushworks' },
    { id: 'letreseller', name: 'LetReseller', category: 'Provider-neutral reseller operations', outcome: 'Domains, hosting, billing, projects, support, and fulfilment in one operating layer.', url: 'https://latreseller.lat' }
  ];
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const api = async (route, options = {}) => {
    const response = await fetch(route, { headers: { 'content-type': 'application/json', ...(options.headers || {}) }, ...options });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    return data;
  };
  const mount = document.querySelector('.stage');
  if (!mount) return;

  const panel = document.createElement('section');
  panel.className = 'page platform-page';
  panel.id = 'page-platform';
  panel.innerHTML = `<div class="preview-page">
    <p class="kicker">A11-K portfolio</p>
    <h2>One owner. Several focused systems.</h2>
    <p class="story-body">Choose the surface that matches the problem. Each property has a clear commercial role; Brushworks turns the next brief into a structured package.</p>
    <div class="portfolio-cards" id="bwPortfolioCards"></div>
    <div class="sales-actions">
      <a class="btn" href="SALES_KIT.md" target="_blank" rel="noreferrer">Open sales kit</a>
      <button type="button" class="btn ghost" id="bwCopyOffer">Copy master offer</button>
      <button type="button" class="btn ghost" id="bwOpenLeadForm">Capture a lead</button>
      <span id="bwOfferStatus" class="tiny" aria-live="polite"></span>
    </div>
    <form class="lead-form" id="bwLeadForm" hidden>
      <input id="bwLeadName" maxlength="120" placeholder="Name" aria-label="Name" />
      <input id="bwLeadEmail" type="email" required maxlength="240" placeholder="Email" aria-label="Email" />
      <select id="bwLeadInterest" aria-label="Interest">
        <option>A11-K.space</option><option>MindReply</option><option>Aurel</option><option>Brushworks</option><option>LetReseller</option>
      </select>
      <textarea id="bwLeadBrief" maxlength="2000" placeholder="What needs to work?" aria-label="Brief"></textarea>
      <button type="submit" class="btn sm">Store lead locally</button>
      <span id="bwLeadStatus" class="tiny" aria-live="polite"></span>
    </form>
    <div class="local-workspace">
      <div class="workspace-head"><div><p class="kicker">Local workspace</p><h3>Build, package, repeat.</h3></div><span class="status-pill">NO EXTERNAL CALLS</span></div>
      <div class="workspace-actions">
        <button type="button" class="btn sm" id="bwCreateProject">Create local project</button>
        <button type="button" class="btn sm ghost" id="bwRefreshProjects">Refresh projects</button>
        <button type="button" class="btn sm ghost" id="bwRefreshHealth">Check local API</button>
      </div>
      <form class="project-form" id="bwProjectForm">
        <input id="bwProjectName" required maxlength="120" placeholder="Project name" aria-label="Project name" />
        <input id="bwProjectPrompt" maxlength="5000" placeholder="Prompt: luxury reseller portfolio…" aria-label="Project prompt" />
        <button type="submit" class="btn sm">Generate layout</button>
      </form>
      <div id="bwProjectList" class="project-list"><span class="tiny">Start the local server to load projects.</span></div>
      <span id="bwPlatformStatus" class="tiny" aria-live="polite">Local package mode · not checked</span>
    </div>
  </div>`;
  mount.appendChild(panel);

  const rail = document.querySelector('.pages-rail');
  const add = document.querySelector('#btnAddPage');
  if (rail && add) {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'page-tab';
    tab.dataset.page = 'platform';
    tab.textContent = 'Portfolio';
    add.before(tab);
    tab.addEventListener('click', () => showPlatform());
  }

  let portfolio = fallbackPortfolio;
  let projects = [];
  let activeProjectId = null;

  function showPlatform() {
    document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));
    document.querySelectorAll('.page-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.page === 'platform'));
    panel.classList.add('active');
    refreshProjects();
  }

  function renderPortfolio() {
    const target = document.querySelector('#bwPortfolioCards');
    if (!target) return;
    target.innerHTML = portfolio.map((item) => `<a class="portfolio-card" href="${escape(item.url)}" target="_blank" rel="noreferrer"><strong>${escape(item.name)}</strong><span>${escape(item.category)}</span><small>${escape(item.outcome)}</small><em>Catalogue entry · live status not claimed</em></a>`).join('');
  }

  function setStatus(text) {
    const status = document.querySelector('#bwPlatformStatus');
    if (status) status.textContent = text;
  }

  function renderProjects() {
    const target = document.querySelector('#bwProjectList');
    if (!target) return;
    if (!projects.length) {
      target.innerHTML = '<span class="tiny">No local projects yet. Create the first sellable package.</span>';
      return;
    }
    target.innerHTML = projects.map((project) => `<article class="project-row" data-project-id="${escape(project.id)}"><div><strong>${escape(project.name)}</strong><span>${escape(project.template)} · ${escape(project.status)}</span></div><div class="project-buttons"><button type="button" class="btn xs" data-project-action="generate">Generate</button><button type="button" class="btn xs ghost" data-project-action="duplicate">Duplicate</button><button type="button" class="btn xs ghost" data-project-action="publish">Package</button></div></article>`).join('');
    target.querySelectorAll('[data-project-action]').forEach((button) => button.addEventListener('click', () => handleProjectAction(button.closest('[data-project-id]').dataset.projectId, button.dataset.projectAction)));
  }

  async function refreshProjects() {
    try {
      const data = await api('/api/projects');
      projects = data.projects || [];
      renderProjects();
      setStatus(`${projects.length} local project${projects.length === 1 ? '' : 's'} · stored in .brushworks`);
    } catch {
      setStatus('Start local API with npm run dev · static preview remains available');
    }
  }

  async function checkHealth() {
    try {
      const data = await api('/api/health');
      setStatus(data.ok ? 'API ready · local only · live deployment not claimed' : 'API unavailable');
    } catch {
      setStatus('API unavailable · run npm run dev');
    }
  }

  async function createProject(name, prompt) {
    const created = await api('/api/projects', { method: 'POST', body: JSON.stringify({ name, prompt, description: `Commercial package for ${name}.` }) });
    activeProjectId = created.id;
    if (prompt) await generateProject(created.id, prompt);
    await refreshProjects();
    return created;
  }

  async function generateProject(id, prompt) {
    const generated = await api(`/api/projects/${encodeURIComponent(id)}/generate`, { method: 'POST', body: JSON.stringify({ prompt }) });
    activeProjectId = id;
    return generated.project;
  }

  async function handleProjectAction(id, action) {
    try {
      if (action === 'generate') {
        const prompt = window.prompt('Prompt for this project', 'premium conversion-focused website');
        if (!prompt) return;
        await generateProject(id, prompt);
        setStatus('Layout generated locally · no external provider called');
      }
      if (action === 'duplicate') {
        await api(`/api/projects/${encodeURIComponent(id)}/duplicate`, { method: 'POST', body: '{}' });
        setStatus('Project duplicated · local draft stored');
      }
      if (action === 'publish') {
        const result = await api(`/api/projects/${encodeURIComponent(id)}/publish`, { method: 'POST', body: '{}' });
        setStatus(`Package ready · ${result.artifactDir} · live deployment not claimed`);
      }
      await refreshProjects();
    } catch (error) {
      setStatus(error.message || 'Project action failed');
    }
  }

  document.querySelector('#bwRefreshHealth')?.addEventListener('click', checkHealth);
  document.querySelector('#bwRefreshProjects')?.addEventListener('click', refreshProjects);
  document.querySelector('#bwCreateProject')?.addEventListener('click', async () => {
    try {
      const created = await createProject('New A11-K commercial package', 'premium conversion-focused portfolio website');
      setStatus(`Created ${created.name} · generated locally`);
    } catch (error) { setStatus(error.message || 'Start local API with npm run dev'); }
  });
  document.querySelector('#bwProjectForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.querySelector('#bwProjectName')?.value.trim();
    const prompt = document.querySelector('#bwProjectPrompt')?.value.trim();
    if (!name) return;
    try {
      await createProject(name, prompt);
      event.target.reset();
      setStatus('Sellable layout generated and stored locally');
    } catch (error) { setStatus(error.message || 'Project creation failed'); }
  });
  document.querySelector('#bwCopyOffer')?.addEventListener('click', async () => {
    const offer = 'A11-K builds focused digital systems that make the value obvious and ship a verifiable package. Request a focused build.';
    try { await navigator.clipboard.writeText(offer); document.querySelector('#bwOfferStatus').textContent = 'Offer copied'; } catch { document.querySelector('#bwOfferStatus').textContent = offer; }
  });
  document.querySelector('#bwOpenLeadForm')?.addEventListener('click', () => {
    const form = document.querySelector('#bwLeadForm');
    if (form) form.hidden = !form.hidden;
  });
  document.querySelector('#bwLeadForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.querySelector('#bwLeadStatus');
    const payload = {
      name: document.querySelector('#bwLeadName')?.value.trim(),
      email: document.querySelector('#bwLeadEmail')?.value.trim(),
      interest: document.querySelector('#bwLeadInterest')?.value,
      brief: document.querySelector('#bwLeadBrief')?.value.trim()
    };
    try {
      await api('/api/leads', { method: 'POST', body: JSON.stringify(payload) });
      event.target.reset();
      if (status) status.textContent = 'Lead stored locally · follow-up required';
    } catch (error) {
      if (status) status.textContent = error.message || 'Lead not stored';
    }
  });

  window.BWPlatform = {
    async publish(payload) {
      try {
        let project = projects.find((item) => item.name === payload.title);
        if (!project) project = await api('/api/projects', { method: 'POST', body: JSON.stringify({ name: payload.title, description: payload.tagline, template: payload.template, blocks: payload.blocks, pages: payload.pages, prompt: payload.tagline }) });
        activeProjectId = project.id;
        await api(`/api/projects/${encodeURIComponent(project.id)}`, { method: 'PUT', body: JSON.stringify({ name: payload.title, description: payload.tagline, template: payload.template, blocks: payload.blocks, pages: payload.pages, prompt: payload.tagline }) });
        const result = await api(`/api/projects/${encodeURIComponent(project.id)}/publish`, { method: 'POST', body: '{}' });
        setStatus(`Package ready · stored locally · ${result.artifactDir}`);
        await refreshProjects();
        return result;
      } catch (error) {
        setStatus(`Local package not written · ${error.message || 'start npm run dev'}`);
        return null;
      }
    }
  };

  (async () => {
    try {
      const data = await api('/api/portfolio');
      if (Array.isArray(data.items) && data.items.length) portfolio = data.items;
    } catch { /* static catalogue remains usable */ }
    renderPortfolio();
    refreshProjects();
  })();
})();
