const summary = document.getElementById('summary');
const nodes = document.getElementById('nodes');
const ORG = 'a11-k';

const partnerSlots = [
  { name: 'Infrastructure', status: 'open' },
  { name: 'Voice', status: 'open' },
  { name: 'Security', status: 'open' },
  { name: 'Hosting', status: 'open' }
];

function card(value, label) {
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<b>${value}</b><span>${label}</span>`;
  return el;
}

async function loadRepos() {
  try {
    const r = await fetch(`https://api.github.com/orgs/${ORG}/repos?per_page=100&sort=updated`);
    return await r.json();
  } catch {
    return [];
  }
}

function placeNode(x, y, cls, label) {
  const n = document.createElement('div');
  n.className = `node ${cls || ''}`.trim();
  n.style.left = `${x}px`;
  n.style.top = `${y}px`;
  nodes.appendChild(n);
  if (label) {
    const t = document.createElement('div');
    t.className = 'label';
    t.style.left = `${x}px`;
    t.style.top = `${y + 18}px`;
    t.textContent = label;
    nodes.appendChild(t);
  }
}

function starField() {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  ctx.scale(dpr, dpr);
  const stars = Array.from({ length: 180 }, () => ({ x: Math.random()*innerWidth, y: Math.random()*innerHeight, r: Math.random()*1.6, a: Math.random() }));
  function draw() {
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for (const s of stars) {
      s.a += 0.008;
      ctx.beginPath();
      ctx.fillStyle = `rgba(180,210,255,${0.35 + Math.sin(s.a)*0.25})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

async function init() {
  starField();
  const repos = await loadRepos();
  summary.append(card('Private', 'Framework posture'));
  summary.append(card(`${repos.length || 0}`, 'Repos discovered'));
  summary.append(card(`${partnerSlots.length}`, 'Open partner slots'));

  const cx = innerWidth / 2;
  const cy = innerHeight / 2;
  placeNode(cx, cy, '', 'A11-K');

  const ring1 = 170, ring2 = 260;
  repos.slice(0, 14).forEach((repo, i) => {
    const a = (Math.PI * 2 * i) / Math.max(repos.length, 1);
    placeNode(cx + Math.cos(a) * ring1, cy + Math.sin(a) * ring1, 'repo', repo.name);
  });

  partnerSlots.forEach((p, i) => {
    const a = (Math.PI * 2 * i) / partnerSlots.length + 0.25;
    placeNode(cx + Math.cos(a) * ring2, cy + Math.sin(a) * ring2, 'partner', p.name);
  });
}

init();
window.addEventListener('resize', () => location.reload());