(function () {
  const cart = [];
  const labels = {
    "set-one": "Set One — Noir",
    "set-two": "Set Two — Nude",
    "set-three": "Set Three — Velvet",
  };
  const line = document.getElementById("cartLine");
  document.querySelectorAll("[data-sku]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sku = btn.dataset.sku;
      cart.push(sku);
      if (line) {
        line.textContent =
          cart.length +
          " in cart · " +
          cart.map((s) => labels[s] || s).join(", ") +
          " · checkout wires to dropship next";
      }
      btn.textContent = "Added ✓";
      setTimeout(() => {
        btn.textContent = "Add";
      }, 1200);
    });
  });
})();
