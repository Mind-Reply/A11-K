(function () {
  const state = {
    user: null,
    blocks: new Set(["hero", "products", "contact"]),
    template: "premium-saas",
    vibe: null,
    pages: ["home", "look", "shop", "story"],
  };

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* —— Session —— */
  try {
    const saved = localStorage.getItem("bw_user");
    if (saved) state.user = JSON.parse(saved);
  } catch (_) {}

  function refreshLoginUI() {
    const label = $("#loginLabel");
    if (!label) return;
    label.textContent = state.user ? state.user.name.split("@")[0] : "Login";
  }
  refreshLoginUI();

  /* —— Pages —— */
  function showPage(id) {
    $$(".page").forEach((p) => p.classList.remove("active"));
    $$(".page-tab").forEach((t) => t.classList.toggle("active", t.dataset.page === id));
    const el = document.getElementById("page-" + id);
    if (el) el.classList.add("active");
  }

  $$(".page-tab").forEach((tab) => {
    tab.addEventListener("click", () => showPage(tab.dataset.page));
  });

  const addPage = $("#btnAddPage");
  if (addPage) {
    addPage.addEventListener("click", () => {
      const name = prompt("New page name?", "New page");
      if (!name) return;
      const id = "p" + Date.now().toString(36);
      state.pages.push(id);
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "page-tab";
      tab.dataset.page = id;
      tab.textContent = name.slice(0, 18);
      tab.addEventListener("click", () => showPage(id));
      addPage.before(tab);

      const sec = document.createElement("section");
      sec.className = "page";
      sec.id = "page-" + id;
      sec.innerHTML =
        '<div class="preview-page"><p class="kicker">Custom page</p><h2 contenteditable="true">' +
        escapeHtml(name) +
        '</h2><p class="story-body" contenteditable="true">Write anything. This is your page.</p>' +
        '<button type="button" class="btn" data-open-pub>Publish</button></div>';
      $(".stage").appendChild(sec);
      bindPubTriggers(sec);
      showPage(id);
    });
  }

  /* —— Blocks (puzzle) —— */
  $$(".block").forEach((b) => {
    if (state.blocks.has(b.dataset.block)) b.classList.add("on");
    b.addEventListener("click", () => {
      const id = b.dataset.block;
      if (state.blocks.has(id)) {
        state.blocks.delete(id);
        b.classList.remove("on");
      } else {
        state.blocks.add(id);
        b.classList.add("on");
      }
    });
  });

  /* —— Sparks —— */
  const sparks = {
    beauty: {
      title: "Unapologetic",
      tag: "Classy cosmetics. #sets that look expensive on camera.",
      template: "unapologetic-sets",
      blocks: ["hero", "products", "video", "contact", "gallery"],
    },
    me: {
      title: "About me",
      tag: "My work, my story, how to reach me.",
      template: "premium-saas",
      blocks: ["hero", "gallery", "contact", "faq"],
    },
    luxury: {
      title: "Maison",
      tag: "Quiet luxury. Curated pieces. No noise.",
      template: "aurel-luxury",
      blocks: ["hero", "products", "gallery", "contact"],
    },
    app: {
      title: "Launch",
      tag: "Modern product site. Clear value. One strong CTA.",
      template: "premium-saas",
      blocks: ["hero", "products", "faq", "contact"],
    },
  };

  $$(".spark").forEach((btn) => {
    btn.addEventListener("click", () => {
      const conf = sparks[btn.dataset.spark];
      if (!conf) return;
      applySpark(conf);
      botSay("Nice pick — I set your title, vibe, and puzzle pieces. Tweak anything, then hit Publish.");
    });
  });

  function applySpark(conf) {
    state.template = conf.template;
    state.vibe = conf.template;
    const t = $("#siteTitle");
    const g = $("#siteTag");
    const shop = $("#shopTitle");
    if (t) t.textContent = conf.title;
    if (g) g.textContent = conf.tag;
    if (shop && conf.template === "unapologetic-sets") shop.textContent = "#sets";
    state.blocks = new Set(conf.blocks);
    $$(".block").forEach((b) => b.classList.toggle("on", state.blocks.has(b.dataset.block)));
  }

  /* —— Chat —— */
  const chatPanel = $("#chatPanel");
  const btnChat = $("#btnChat");
  const btnChatClose = $("#btnChatClose");

  function setChat(open) {
    if (!chatPanel || !btnChat) return;
    chatPanel.hidden = !open;
    btnChat.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (btnChat) btnChat.addEventListener("click", () => setChat(chatPanel.hidden));
  if (btnChatClose) btnChatClose.addEventListener("click", () => setChat(false));

  function botSay(text) {
    const log = $("#chatLog");
    if (!log) return;
    const d = document.createElement("div");
    d.className = "bubble bot";
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }

  function userSay(text) {
    const log = $("#chatLog");
    if (!log) return;
    const d = document.createElement("div");
    d.className = "bubble user";
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }

  function replyTo(msg) {
    const m = msg.toLowerCase();
    if (/beauty|cosmetic|makeup|unapolog|sets|#sets|shop/.test(m)) {
      applySpark(sparks.beauty);
      return "Done — beauty / #sets vibe loaded. Open Shop page or Publish when ready.";
    }
    if (/luxury|gold|premium|maison/.test(m)) {
      applySpark(sparks.luxury);
      return "Luxury shell on. Edit the title, add gallery, publish when it feels expensive.";
    }
    if (/portfolio|about me|personal|cv|resume/.test(m)) {
      applySpark(sparks.me);
      return "About-me layout ready. Write your story on the Story page.";
    }
    if (/app|saas|startup|software|product/.test(m)) {
      applySpark(sparks.app);
      return "Product site pieces are on. Keep the CTA loud. Publish anytime.";
    }
    if (/publish|live|ship|launch/.test(m)) {
      openPublish();
      return "Publish panel is open — confirm and go.";
    }
    if (/design|photo|edit|canvas|studio|draw/.test(m)) {
      showPage("look");
      return "Design room is open. Tap Start designing for the full editor.";
    }
    if (/research|firecrawl|scrape|search|competitor|seo/.test(m)) {
      return "Research uses Firecrawl (wrap only). Open Research in the top bar, or run D:\\MRPRODUCTION\\ESTATE\\agents\\firecrawl\\search.ps1 with FIRECRAWL_API_KEY. Playground: firecrawl.dev search.";
    }
    return "Try: “beauty shop”, “luxury brand”, “about me”, “open design”, “research”, or “publish”.";
  }

  const chatForm = $("#chatForm");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#chatInput");
      const text = (input && input.value.trim()) || "";
      if (!text) return;
      userSay(text);
      if (input) input.value = "";
      setTimeout(() => botSay(replyTo(text)), 280);
    });
  }

  /* —— Login —— */
  const loginModal = $("#loginModal");
  function openLogin() {
    if (loginModal) loginModal.hidden = false;
  }
  function closeLogin() {
    if (loginModal) loginModal.hidden = true;
  }
  const btnLogin = $("#btnLogin");
  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      if (state.user) {
        if (confirm("Log out " + state.user.name + "?")) {
          state.user = null;
          localStorage.removeItem("bw_user");
          refreshLoginUI();
        }
      } else openLogin();
    });
  }
  const btnLoginClose = $("#btnLoginClose");
  if (btnLoginClose) btnLoginClose.addEventListener("click", closeLogin);
  if (loginModal) {
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) closeLogin();
    });
  }
  const btnDoLogin = $("#btnDoLogin");
  if (btnDoLogin) {
    btnDoLogin.addEventListener("click", () => {
      const name = ($("#loginName") && $("#loginName").value.trim()) || "Creator";
      state.user = { name: name, at: new Date().toISOString() };
      localStorage.setItem("bw_user", JSON.stringify(state.user));
      refreshLoginUI();
      closeLogin();
      botSay("Hey " + name.split("@")[0] + " — workspace unlocked. Build freely.");
      setChat(true);
    });
  }

  /* —— Editor —— */
  function loadEditor() {
    const cover = $("#editorCover");
    const frame = $("#editor");
    if (cover) cover.classList.add("gone");
    if (frame && (frame.getAttribute("src") === "about:blank" || !frame.src || frame.src.includes("about:blank"))) {
      frame.src = "https://www.photopea.com";
    }
  }
  ["btnLoadEditor", "btnLoadEditor2", "btnOpenStudio"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", () => {
      showPage("look");
      loadEditor();
    });
  });

  /* —— Publish straight away —— */
  const publishModal = $("#publishModal");

  function openPublish() {
    const title = ($("#siteTitle") && $("#siteTitle").textContent.trim()) || "My site";
    const pubTitle = $("#pubTitle");
    if (pubTitle && !pubTitle.value) pubTitle.value = title;
    if (publishModal) publishModal.hidden = false;
  }
  function closePublish() {
    if (publishModal) publishModal.hidden = true;
  }

  function bindPubTriggers(root) {
    $$("[data-open-pub]", root || document).forEach((b) =>
      b.addEventListener("click", openPublish)
    );
  }
  bindPubTriggers();

  ["btnPublishNow", "btnPubFromHero"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", openPublish);
  });
  const btnPubClose = $("#btnPubClose");
  if (btnPubClose) btnPubClose.addEventListener("click", closePublish);
  if (publishModal) {
    publishModal.addEventListener("click", (e) => {
      if (e.target === publishModal) closePublish();
    });
  }

  const pubOk = $("#pubOk");
  const btnDoPublish = $("#btnDoPublish");
  if (pubOk && btnDoPublish) {
    pubOk.addEventListener("change", () => {
      btnDoPublish.disabled = !pubOk.checked;
    });
  }

  if (btnDoPublish) {
    btnDoPublish.addEventListener("click", () => {
      if (!pubOk || !pubOk.checked) return;
      const title =
        ($("#pubTitle") && $("#pubTitle").value.trim()) ||
        ($("#siteTitle") && $("#siteTitle").textContent.trim()) ||
        "My site";
      const url = ($("#pubUrl") && $("#pubUrl").value.trim()) || null;
      const id = Math.random().toString(16).slice(2, 12);
      const slug = slugify(title);
      const payload = {
        brand: "BRUSHworks",
        fingerprint: "LIBRA-BW-AK-2026",
        user: state.user,
        projectId: id,
        title: title,
        slug: slug,
        tagline: ($("#siteTag") && $("#siteTag").textContent.trim()) || "",
        template: state.template,
        blocks: Array.from(state.blocks),
        pages: state.pages,
        productionUrl: url,
        publishedAt: new Date().toISOString(),
        status: "publish-package-ready",
      };

      const cli = [
        "# BRUSHworks — published package",
        "# " + title + " · " + id,
        "",
        "cd C:\\Users\\skyri\\MRPRODUCTION\\brands\\brushworks",
        'node builder.js create "' + title.replace(/"/g, "") + '" ' + state.template,
        "node builder.js deploy-prep " + id,
        url
          ? "node builder.js register " + id + " " + url
          : "# node builder.js register " + id + " https://YOUR.pages.dev",
        "",
        JSON.stringify(payload, null, 2),
      ].join("\n");

      const out = $("#pubOut");
      if (out) out.textContent = cli;

      try {
        localStorage.setItem("bw_last_publish", JSON.stringify(payload));
      } catch (_) {}

      botSay("Published package ready for “" + title + "”. Copy the handoff or run the CLI to go fully live.");
      btnDoPublish.textContent = "Published ✓";
      setTimeout(() => {
        btnDoPublish.textContent = "Publish now 🚀";
      }, 2000);
    });
  }

  function slugify(s) {
    return (
      String(s || "site")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 48) || "site"
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // boot
  showPage("home");
})();
