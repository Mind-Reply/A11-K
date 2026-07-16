(function () {
  const statusEl = document.getElementById("status");
  const promptEl = document.getElementById("prompt");
  const buildBtn = document.getElementById("buildBtn");
  const approveBtn = document.getElementById("approveBtn");
  const copyCliBtn = document.getElementById("copyCliBtn");
  const chips = document.querySelectorAll(".chip");

  if (!statusEl) return;

  let template = "premium-saas";
  let lastSiteId = null;

  function setStatus(text, ok) {
    statusEl.textContent = text;
    statusEl.classList.toggle("ok", !!ok);
  }

  function slugify(input) {
    return (
      String(input || "site")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 48) || "site"
    );
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      template = chip.dataset.template || "premium-saas";
      setStatus(`Template locked: ${template}`);
    });
  });

  if (buildBtn) {
    buildBtn.addEventListener("click", () => {
      const prompt = (promptEl && promptEl.value.trim()) || "";
      if (prompt.length < 8) {
        setStatus("Write what the site needs first (min 8 chars).");
        return;
      }
      lastSiteId = slugify(prompt.split(/[.!?]/)[0] || "new-site");
      const projectId = Math.random().toString(16).slice(2, 10);
      setStatus(
        `Draft ready · siteId=${lastSiteId} · template=${template} · projectId=${projectId} · review before publish. CLI: node builder.js create "${lastSiteId}" ${template}`,
        true
      );
    });
  }

  if (approveBtn) {
    approveBtn.addEventListener("click", () => {
      const id = lastSiteId || "draft-local";
      setStatus(
        `Publish waiting for your approval · /approvals/${id} · HTTPS production URL required after approve.`,
        true
      );
    });
  }

  if (copyCliBtn) {
    copyCliBtn.addEventListener("click", async () => {
      const name = lastSiteId || "NewSite";
      const cmd = `node builder.js create "${name}" ${template}`;
      try {
        await navigator.clipboard.writeText(cmd);
        setStatus(`Copied: ${cmd}`, true);
      } catch {
        setStatus(cmd, true);
      }
    });
  }
})();
