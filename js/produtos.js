renderShell("produtos.html");

let searchTerm = "";
let openMenuId = null;

renderProductsPage();
wireProductModal();

function renderProductsPage() {
  const products = Store.get().products;
  const root = document.getElementById("page-root");
  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  root.innerHTML = `
    <div class="page-head">
      <h1>Produtos</h1>
      <button class="btn btn-primary" id="btn-new-product">Criar produto</button>
    </div>

    <div class="card" style="padding:0; overflow:visible;">
      <div style="padding:20px 20px 0;">
        <div class="tabs">
          <div class="tab active">Meus produtos</div>
          <div class="tab">Minhas coproduções</div>
          <div class="tab">Minhas afiliações</div>
        </div>
        <div class="search-row">
          <input type="text" id="search-input" placeholder="Buscar..." value="${escapeHtml(searchTerm)}" />
          <select><option>Todos</option></select>
        </div>
      </div>

      <table class="products">
        <thead>
          <tr><th>Nome</th><th>Preço</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          ${filtered.length ? filtered.map(rowHtml).join("") : `
            <tr><td colspan="4" style="text-align:center; color:#9ca3af; padding:30px;">Nenhum produto encontrado.</td></tr>
          `}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("btn-new-product").addEventListener("click", () => openProductModal(null));

  document.getElementById("search-input").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderProductsPage();
  });

  filtered.forEach(p => {
    document.getElementById(`menu-btn-${p.id}`)?.addEventListener("click", (e) => {
      e.stopPropagation();
      openMenuId = openMenuId === p.id ? null : p.id;
      renderProductsPage();
    });
    document.getElementById(`edit-${p.id}`)?.addEventListener("click", () => openProductModal(p));
    document.getElementById(`toggle-${p.id}`)?.addEventListener("click", () => {
      Store.update(state => {
        const prod = state.products.find(x => x.id === p.id);
        prod.status = prod.status === "Ativo" ? "Bloqueado" : "Ativo";
      });
      openMenuId = null;
      renderProductsPage();
    });
    document.getElementById(`delete-${p.id}`)?.addEventListener("click", () => {
      if (confirm(`Remover "${p.name}"?`)) {
        Store.update(state => {
          state.products = state.products.filter(x => x.id !== p.id);
        });
      }
      openMenuId = null;
      renderProductsPage();
    });
  });

  if (openMenuId) {
    document.addEventListener("click", function closeMenu() {
      openMenuId = null;
      renderProductsPage();
      document.removeEventListener("click", closeMenu);
    }, { once: true });
  }
}

function rowHtml(p) {
  const statusClass = p.status === "Ativo" ? "ativo" : p.status === "Bloqueado" ? "bloqueado" : "rascunho";
  return `
    <tr>
      <td>${escapeHtml(p.name)}</td>
      <td>${formatBRL(p.price)}</td>
      <td><span class="status-pill ${statusClass}">${p.status}</span></td>
      <td class="row-actions">
        <button class="icon-btn" id="menu-btn-${p.id}">${ICONS.dots}</button>
        <div class="row-menu ${openMenuId === p.id ? "open" : ""}">
          <button type="button" id="edit-${p.id}">✎ Editar</button>
          <button type="button" id="toggle-${p.id}">⇄ ${p.status === "Ativo" ? "Bloquear" : "Ativar"}</button>
          <button type="button" id="delete-${p.id}" style="color:#d1453b;">🗑 Remover</button>
        </div>
      </td>
    </tr>
  `;
}

function wireProductModal() {
  const overlay = document.getElementById("product-modal");
  const form = document.getElementById("product-form");
  const title = document.getElementById("product-modal-title");

  overlay.querySelectorAll("[data-close-product]").forEach(btn =>
    btn.addEventListener("click", () => overlay.classList.remove("open"))
  );
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const id = fd.get("id");
    const data = {
      name: fd.get("name"),
      price: Number(fd.get("price")) || 0,
      status: fd.get("status"),
    };

    Store.update(state => {
      if (id) {
        const prod = state.products.find(p => p.id === id);
        Object.assign(prod, data);
      } else {
        state.products.unshift({ id: Math.random().toString(36).slice(2, 10), ...data });
      }
    });

    overlay.classList.remove("open");
    renderProductsPage();
  });

  window.openProductModal = (product) => {
    title.textContent = product ? "Editar produto" : "Novo produto";
    form.id.value = product ? product.id : "";
    form.name.value = product ? product.name : "";
    form.price.value = product ? product.price : "";
    form.status.value = product ? product.status : "Ativo";
    overlay.classList.add("open");
  };
}

function openProductModal(product) {
  window.openProductModal(product);
}
