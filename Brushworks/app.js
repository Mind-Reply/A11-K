(function () {
  const state = {
    step: 1,
    vibe: null,
    template: "premium-saas",
    name: "",
    blurb: "",
    pieces: new Set(["hero", "about", "products", "contact"]),
    approved: false,
    projectId: null,
  };

  const pieceLabels = {
    hero: "Big welcome",
    about: "About us",
    products: "Products / services",
    video: "Video spotlight",
    gallery: "Photo gallery",
    contact: "Contact / buy",
    faq: "FAQ",
    social: "Social links",
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function go(step) {
    state.step = step;
    $$(".screen").forEach((s) => s.classList.remove("active"));
    const el = document.getElementById("s" + step);
    if (el) el.classList.add("active");

    $$(".prog").forEach((p) => {
      const n = Number(p.dataset.go);
      p.classList.toggle("active", n === step);
      p.classList.toggle("done", n < step);
    });

    const labels = {
      1: "Step 1 of 4 · Pick a vibe",
      2: "Step 2 of 4 · Puzzle pieces",
      3: "Step 3 of 4 · Design",
      4: "Step 4 of 4 · Publish",
    };
    const pill = $("#stepPill");
    if (pill) pill.textContent = labels[step] || "";

    if (step === 4) renderSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updatePieceCount() {
    const el = $("#pieceCount");
    if (!el) return;
    const n = state.pieces.size;
    el.textContent = n === 1 ? "1 piece selected" : n + " pieces selected";
  }

  function renderSummary() {
    const name = ($("#siteName") && $("#siteName").value.trim()) || state.name || "My site";
    const blurb = ($("#siteBlurb") && $("#siteBlurb").value.trim()) || state.blurb || "—";
    state.name = name;
    state.blurb = blurb;

    const pieces = Array.from(state.pieces)
      .map((p) => pieceLabels[p] || p)
      .join(", ");

    const box = $("#summary");
    if (!box) return;
    box.innerHTML =
      card("Name", name) +
      card("Vibe", state.vibe || "custom") +
      card("Template", state.template) +
      card("Pieces", pieces || "none yet");
  }

  function card(k, v) {
    return '<div class="card"><b>' + escapeHtml(k) + "</b>" + escapeHtml(v) + "</div>";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function slugify(s) {
    return (
      String(s || "my-site")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 48) || "my-site"
    );
  }

  function refreshFinish() {
    const a = $("#chkLook") && $("#chkLook").checked;
    const b = $("#chkMine") && $("#chkMine").checked;
    const c = $("#chkGo") && $("#chkGo").checked;
    const btn = $("#btnFinish");
    if (btn) btn.disabled = !(a && b && c);
    state.approved = !!(a && b && c);
  }

  function buildPackage() {
    const id =
      state.projectId ||
      Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 6);
    state.projectId = id;
    const slug = slugify(state.name);
    const url = ($("#liveUrl") && $("#liveUrl").value.trim()) || "";
    const pieces = Array.from(state.pieces);

    const payload = {
      brand: "Brushworks",
      fingerprint: "LIBRA-BW-AK-2026",
      directive: "001-wrap-and-ship",
      projectId: id,
      name: state.name,
      slug: slug,
      blurb: state.blurb,
      vibe: state.vibe,
      template: state.template,
      pieces: pieces,
      productionUrl: url || null,
      createdAt: new Date().toISOString(),
      status: "approved-package-ready",
    };

    const cli = [
      "# Brushworks package — full handoff",
      "# Project: " + state.name,
      "# ID: " + id,
      "",
      "cd C:\\Users\\skyri\\MRPRODUCTION\\brands\\brushworks",
      'node builder.js create "' + state.name.replace(/"/g, "") + '" ' + state.template,
      "node builder.js deploy-prep " + id,
      url
        ? "node builder.js register " + id + " " + url
        : "# After Cloudflare Pages: node builder.js register " + id + " https://YOUR.pages.dev",
      "",
      "# Pieces: " + pieces.join(", "),
      "# Blurb: " + state.blurb,
      "",
      JSON.stringify(payload, null, 2),
    ].join("\n");

    return { payload, cli };
  }

  // Events
  $$(".vibe").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.vibe = btn.dataset.vibe;
      state.template = btn.dataset.template || "premium-saas";
      if (state.vibe === "shop") {
        ["hero", "products", "video", "contact", "social"].forEach((p) => state.pieces.add(p));
      }
      updatePieceCount();
      // Pre-fill friendly name hints
      const name = $("#siteName");
      if (name && !name.value) {
        const hints = {
          shop: "Unapologetic",
          business: "My Business",
          luxury: "Maison",
          ops: "Control",
          me: "My Name",
          blank: "Untitled",
        };
        name.value = hints[state.vibe] || "My site";
        name.placeholder = name.value;
      }
      go(2);
    });
  });

  $$(".piece").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = btn.dataset.piece;
      if (state.pieces.has(p)) {
        state.pieces.delete(p);
        btn.classList.remove("on");
      } else {
        state.pieces.add(p);
        btn.classList.add("on");
      }
      updatePieceCount();
    });
  });

  $$(".prog").forEach((p) => {
    p.addEventListener("click", () => {
      const n = Number(p.dataset.go);
      // Allow free navigation once started; step 1 always ok
      if (n === 1 || state.vibe || n <= state.step) go(n);
      else if (n === 2) go(2);
    });
  });

  $$("[data-back]").forEach((b) => {
    b.addEventListener("click", () => go(Number(b.dataset.back)));
  });

  const toDesign = $("#btnToDesign");
  if (toDesign) {
    toDesign.addEventListener("click", () => {
      state.name = ($("#siteName") && $("#siteName").value.trim()) || "My site";
      state.blurb = ($("#siteBlurb") && $("#siteBlurb").value.trim()) || "";
      go(3);
    });
  }

  function openEditor() {
    const tip = $("#studioTip");
    const frame = $("#editor");
    if (tip) tip.classList.add("gone");
    if (frame && (!frame.src || frame.src === "about:blank" || frame.getAttribute("src") === "about:blank")) {
      // Wrap only — Photopea is the engine
      frame.src = "https://www.photopea.com";
    }
  }

  const openBtn = $("#btnOpenEditor");
  if (openBtn) openBtn.addEventListener("click", openEditor);

  const skip = $("#btnSkipDesign");
  if (skip) skip.addEventListener("click", () => go(4));

  const toPub = $("#btnToPublish");
  if (toPub) toPub.addEventListener("click", () => go(4));

  $$("[data-go-pub]").forEach((b) => b.addEventListener("click", () => go(4)));

  ["chkLook", "chkMine", "chkGo"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", refreshFinish);
  });

  const finish = $("#btnFinish");
  if (finish) {
    finish.addEventListener("click", () => {
      if (!state.approved) return;
      const { cli } = buildPackage();
      const card = $("#doneCard");
      const out = $("#packageOut");
      if (out) out.textContent = cli;
      if (card) card.classList.remove("hidden");
      card && card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  const copy = $("#btnCopy");
  if (copy) {
    copy.addEventListener("click", async () => {
      const out = $("#packageOut");
      if (!out) return;
      try {
        await navigator.clipboard.writeText(out.textContent || "");
        copy.textContent = "Copied ✓";
        setTimeout(() => (copy.textContent = "Copy package"), 1500);
      } catch {
        copy.textContent = "Select & copy manually";
      }
    });
  }

  const again = $("#btnAgain");
  if (again) {
    again.addEventListener("click", () => {
      state.vibe = null;
      state.projectId = null;
      state.pieces = new Set(["hero", "about", "products", "contact"]);
      $$(".piece").forEach((p) => {
        p.classList.toggle("on", state.pieces.has(p.dataset.piece));
      });
      updatePieceCount();
      ["chkLook", "chkMine", "chkGo"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.checked = false;
      });
      refreshFinish();
      const card = $("#doneCard");
      if (card) card.classList.add("hidden");
      go(1);
    });
  }

  const help = $("#btnHelp");
  const modal = $("#helpModal");
  const closeHelp = $("#btnCloseHelp");
  if (help && modal) help.addEventListener("click", () => modal.classList.remove("hidden"));
  if (closeHelp && modal) closeHelp.addEventListener("click", () => modal.classList.add("hidden"));
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  }

  updatePieceCount();
  go(1);
})();
