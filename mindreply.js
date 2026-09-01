/**
 * MindReply chat — A11-K core.
 *
 * Fail-closed by design:
 *  - This is a static GitHub Pages surface, so there is no server-side key here.
 *  - The chat only activates when a serverless proxy endpoint is configured via
 *    the `data-proxy` attribute (or window.MINDREPLY_PROXY_URL). The proxy holds
 *    the Gemini key server-side; it is never placed in this file.
 *  - When no proxy is configured, the chat renders in "not configured" state and
 *    refuses to send. It never pretends a model is live.
 *
 * Usage:
 *   <div id="mindreply" data-proxy="https://your-proxy.example.com/gemini"></div>
 *   <script src="./mindreply.js" defer></script>
 */
(function () {
  "use strict";

  var AGENTS = [
    {
      id: "a11_private",
      label: "A11-Private (Myman Advisor)",
      role: "Private Advisor",
      description:
        "Your most trusted voice. Deep loyalty, protective boundaries, and long memory of owner goals.",
    },
    {
      id: "a11_ceo",
      label: "A11-CEO (Executive Brain)",
      role: "Chief Executive Brain",
      description:
        "Strategic C-suite partner. Holds the vision, drives revenue, and manages the subagent suite.",
    },
    {
      id: "a11_reseller_pro",
      label: "Reseller Pro Core Engine",
      role: "Domain & Commerce Plane",
      description:
        "Provider-neutral domain registrar bus, Stripe Connect splits, margin rules, and fail-closed release gates.",
    },
    {
      id: "a11_designer",
      label: "A11-Designer (Creative Director)",
      role: "Creative Director",
      description:
        "Visual excellence and brand coherence. Enforces the premium light AUREL editorial system.",
    },
  ];

  var MODELS = [
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro (Flagship)" },
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Fast)" },
    { id: "gemini-2.5-flash-thinking", label: "Gemini 2.5 Flash Thinking" },
    { id: "gemini-live-2.5-flash", label: "Gemini 2.5 Flash Live" },
  ];

  var SYSTEM_PROMPTS = {
    a11_private:
      "You are the A11-Private advisor. Speak absolute truth, bound risks, and protect owner sovereignty and privacy. Be warm, candid, and protective.",
    a11_ceo:
      "You are the A11-CEO executive brain. Advise strategically on commercial priorities, revenue, and execution. Be decisive and evidence-first. Never invent customers, revenue, or deployment status.",
    a11_reseller_pro:
      "You are the Reseller Pro Core Engine. Advise on domain registrar operations, provider-neutral bus routing, Stripe Connect splits, margin rules, and fail-closed release gates. Never claim a live mutation occurred without an authoritative server record.",
    a11_designer:
      "You are the A11-Designer creative director. Advise on the premium light AUREL editorial design system, brand architecture, and visual coherence. The dark visual brief is permanently banned.",
  };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function mount(root) {
    var proxy = root.getAttribute("data-proxy") || window.MINDREPLY_PROXY_URL || "";
    var configured = Boolean(proxy);

    var chat = el("div", "mr-chat");
    chat.setAttribute("role", "region");
    chat.setAttribute("aria-label", "MindReply copilot");

    // Header
    var head = el("div", "mr-chat-head");
    var headText = el("div");
    headText.appendChild(el("p", "mr-chat-eyebrow", "MindReply / Gemini-first"));
    headText.appendChild(el("h2", null, "MindReply copilot"));
    var state = el("span", "mr-chat-state" + (configured ? "" : " unconfigured"));
    state.appendChild(el("span", "dot"));
    state.appendChild(document.createTextNode(configured ? "Gemini connected" : "Not configured"));
    head.appendChild(headText);
    head.appendChild(state);
    chat.appendChild(head);

    // Toolbar
    var toolbar = el("div", "mr-chat-toolbar");
    var toggle = el("button", "mr-chat-toggle", "Advanced");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toolbar.appendChild(toggle);

    var controls = el("div", "mr-chat-controls");
    controls.style.display = "none";

    var agentField = el("label", "mr-chat-field");
    agentField.appendChild(el("span", null, "Agent"));
    var agentSelect = el("select");
    agentSelect.setAttribute("aria-label", "Select agent");
    AGENTS.forEach(function (a) {
      var opt = el("option", null, a.label);
      opt.value = a.id;
      agentSelect.appendChild(opt);
    });
    agentField.appendChild(agentSelect);
    controls.appendChild(agentField);

    var modelField = el("label", "mr-chat-field");
    modelField.appendChild(el("span", null, "Model"));
    var modelSelect = el("select");
    modelSelect.setAttribute("aria-label", "Select model");
    MODELS.forEach(function (m) {
      var opt = el("option", null, m.label);
      opt.value = m.id;
      modelSelect.appendChild(opt);
    });
    modelField.appendChild(modelSelect);
    controls.appendChild(modelField);

    toolbar.appendChild(controls);

    var agentBadge = el("div", "mr-chat-agent");
    var agentBadgeText = el("span");
    agentBadgeText.appendChild(el("strong", null, AGENTS[0].label));
    agentBadgeText.appendChild(el("small", null, AGENTS[0].role));
    agentBadge.appendChild(agentBadgeText);
    toolbar.appendChild(agentBadge);

    chat.appendChild(toolbar);

    toggle.addEventListener("click", function () {
      var open = controls.style.display !== "none";
      controls.style.display = open ? "none" : "flex";
      toggle.setAttribute("aria-expanded", String(!open));
    });

    agentSelect.addEventListener("change", function () {
      var agent = AGENTS.find(function (a) {
        return a.id === agentSelect.value;
      });
      if (agent) {
        agentBadgeText.querySelector("strong").textContent = agent.label;
        agentBadgeText.querySelector("small").textContent = agent.role;
      }
    });

    // Messages
    var scroll = el("div", "mr-chat-scroll");
    scroll.setAttribute("aria-live", "polite");
    chat.appendChild(scroll);

    var welcome = el("div", "mr-chat-row mr-chat-row-assistant");
    var welcomeBubble = el("div", "mr-chat-bubble");
    welcomeBubble.appendChild(
      el(
        "p",
        "mr-chat-text",
        configured
          ? "I am the MindReply copilot, running on Gemini. I answer about A11-K systems, research, and evidence. I will not invent customers, revenue, or deployment status."
          : "MindReply is not configured on this static surface. Add a serverless proxy endpoint (data-proxy) that holds the Gemini key server-side to enable the copilot."
      )
    );
    welcome.appendChild(welcomeBubble);
    scroll.appendChild(welcome);

    var error = el("p", "mr-chat-error");
    error.style.display = "none";
    chat.appendChild(error);

    // Form
    var form = el("form", "mr-chat-form");
    var input = el("input");
    input.type = "text";
    input.placeholder = "Ask about A11-K systems, research, or evidence…";
    input.setAttribute("aria-label", "MindReply message");
    input.disabled = !configured;
    var send = el("button", null, "Send");
    send.type = "submit";
    send.setAttribute("aria-label", "Send message");
    send.disabled = !configured;
    form.appendChild(input);
    form.appendChild(send);
    chat.appendChild(form);

    // Foot
    var foot = el("div", "mr-chat-foot");
    foot.appendChild(
      el(
        "span",
        null,
        configured
          ? "Answers are grounded in current A11-K state."
          : "Gemini connector is not configured in this environment."
      )
    );
    var footLink = el("a", null, "Evidence →");
    footLink.href = "./announcements.html";
    foot.appendChild(footLink);
    chat.appendChild(foot);

    root.appendChild(chat);

    if (!configured) return;

    var messages = [];
    var busy = false;

    function scrollBottom() {
      scroll.scrollTop = scroll.scrollHeight;
    }

    function addMessage(role, content) {
      var row = el("div", "mr-chat-row " + (role === "user" ? "mr-chat-row-user" : "mr-chat-row-assistant"));
      var bubble = el("div", "mr-chat-bubble");
      bubble.appendChild(el("p", "mr-chat-text", content));
      row.appendChild(bubble);
      scroll.appendChild(row);
      scrollBottom();
      return row;
    }

    function setBusy(value) {
      busy = value;
      input.disabled = value;
      send.disabled = value || !input.value.trim();
      if (value) {
        var thinking = el("div", "mr-chat-row mr-chat-row-assistant");
        var tb = el("div", "mr-chat-bubble");
        var t = el("span", "mr-chat-thinking");
        t.appendChild(el("span", "mr-chat-spin"));
        t.appendChild(document.createTextNode(" Thinking"));
        tb.appendChild(t);
        thinking.appendChild(tb);
        scroll.appendChild(thinking);
        scrollBottom();
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var text = input.value.trim();
      if (!text || busy) return;

      addMessage("user", text);
      input.value = "";
      send.disabled = true;
      error.style.display = "none";
      setBusy(true);

      var agent = AGENTS.find(function (a) {
        return a.id === agentSelect.value;
      });
      var systemPrompt = agent ? SYSTEM_PROMPTS[agent.id] : undefined;

      var payload = {
        messages: messages.concat([{ role: "user", content: text }]),
        model: modelSelect.value,
        systemPrompt: systemPrompt,
      };
      messages.push({ role: "user", content: text });

      fetch(proxy, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (response) {
          if (response.status === 503) {
            throw new Error("Gemini is not configured on the proxy.");
          }
          if (!response.ok) {
            throw new Error("The copilot could not be reached.");
          }
          return response.json();
        })
        .then(function (data) {
          var content = data && data.content ? data.content : "No response.";
          messages.push({ role: "model", content: content });
          addMessage("assistant", content);
        })
        .catch(function (err) {
          error.textContent = err.message || "The copilot could not be reached.";
          error.style.display = "block";
        })
        .finally(function () {
          setBusy(false);
        });
    });

    input.addEventListener("input", function () {
      send.disabled = busy || !input.value.trim();
    });
  }

  function init() {
    var roots = document.querySelectorAll("#mindreply, [data-mindreply]");
    roots.forEach(mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
