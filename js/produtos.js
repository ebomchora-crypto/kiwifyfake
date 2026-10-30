let searchTerm = "";
let statusFilter = "Todos";
let openMenuId = null;

function renderProducts() {
  const products = Store.get().products;
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "Todos" || p.status === statusFilter)
  );

  document.getElementById("page-root").innerHTML = `
    <div class="page-head" style="max-width:944px">
      <h1>Produtos</h1>
      <span class="spacer"></span>
      <button class="btn btn-primary" id="btn-new">Criar produto</button>
    </div>

    <div class="panel" style="max-width:944px">
      <div class="panel-top">
        <div class="tabs">
          <div class="tab active">Meus produtos</div>
          <div class="tab">Minhas coproduções</div>
          <div class="tab">Minhas afiliações</div>
        </div>
        <div class="search-row">
          <div class="search-box">
            <input type="text" id="search" placeholder="Buscar...." value="${escapeHtml(searchTerm)}" />
            ${ICONS.search}
          </div>
          <select class="select" id="status-filter" style="width:120px; padding-left:12px">
            ${["Todos", "Ativo", "Bloqueado", "Rascunho"].map((s) =>
              `<option ${s === statusFilter ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </div>
      </div>

      <table class="products">
        <thead><tr><th>Nome</th><th>Preço</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${filtered.length ? filtered.map(rowHtml).join("") :
            `<tr><td colspan="4" style="text-align:center;color:#9ca3af">Nenhum produto encontrado.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("btn-new").addEventListener("click", () => openProductModal(null));

  const search = document.getElementById("search");
  search.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderProducts();
    const again = document.getElementById("search");
    again.focus();
    again.setSelectionRange(searchTerm.length, searchTerm.length);
  });

  document.getElementById("status-filter").addEventListener("change", (e) => {
    statusFilter = e.target.value;
    renderProducts();
  });

  filtered.forEach((p) => {
    document.getElementById(`kebab-${p.id}`).addEventListener("click", (e) => {
      e.stopPropagation();
      openMenuId = openMenuId === p.id ? null : p.id;
      renderProducts();
    });
    document.getElementById(`edit-${p.id}`).addEventListener("click", () => {
      openMenuId = null;
      renderProducts();
      openProductModal(p);
    });
    document.getElementById(`toggle-${p.id}`).addEventListener("click", () => {
      Store.update((s) => {
        const prod = s.products.find((x) => x.id === p.id);
        prod.status = prod.status === "Ativo" ? "Bloqueado" : "Ativo";
      });
      openMenuId = null;
      renderProducts();
    });
    document.getElementById(`delete-${p.id}`).addEventListener("click", () => {
      openMenuId = null;
      if (confirm(`Remover "${p.name}"?`)) {
        Store.update((s) => { s.products = s.products.filter((x) => x.id !== p.id); });
      }
      renderProducts();
    });
  });
}

function rowHtml(p) {
  const pill = p.status === "Ativo" ? "green" : "gray";
  return `
    <tr>
      <td class="name" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</td>
      <td class="price">${formatBRL(p.price)}</td>
      <td><span class="pill ${pill}">${escapeHtml(p.status)}</span></td>
      <td class="row-actions">
        <button class="kebab" id="kebab-${p.id}" aria-label="Ações">${ICONS.dotsV}</button>
        <div class="row-menu ${openMenuId === p.id ? "open" : ""}">
          <button type="button" id="edit-${p.id}">Editar</button>
          <button type="button" id="toggle-${p.id}">${p.status === "Ativo" ? "Bloquear" : "Ativar"}</button>
          <button type="button" id="delete-${p.id}" class="danger">Remover</button>
        </div>
      </td>
    </tr>`;
}

function injectProductModal() {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-overlay" id="product-modal">
      <div class="modal sm">
        <div class="modal-head">
          <h2 id="product-title">Novo produto</h2>
          <button class="modal-x" data-close>${ICONS.x}</button>
        </div>
        <form id="product-form">
          <input type="hidden" name="id" />
          <div class="form-grid one">
            <div class="field"><label>Nome do produto</label><input type="text" name="name" required /></div>
            <div class="field"><label>Preço (R$)</label><input type="number" step="0.01" name="price" required /></div>
            <div class="field"><label>Status</label>
              <select name="status"><option>Ativo</option><option>Bloqueado</option><option>Rascunho</option></select>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-white" data-close>Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar produto</button>
          </div>
        </form>
      </div>
    </div>
  `);

  wireModal("product-modal");

  const form = document.getElementById("product-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const id = fd.get("id");
    const data = { name: fd.get("name"), price: Number(fd.get("price")) || 0, status: fd.get("status") };
    Store.update((s) => {
      if (id) Object.assign(s.products.find((p) => p.id === id), data);
      else s.products.unshift({ id: Math.random().toString(36).slice(2, 10), ...data });
    });
    closeModal("product-modal");
    renderProducts();
  });
}

function openProductModal(product) {
  const f = document.getElementById("product-form").elements;
  document.getElementById("product-title").textContent = product ? "Editar produto" : "Novo produto";
  f.id.value = product ? product.id : "";
  f.name.value = product ? product.name : "";
  f.price.value = product ? product.price : "";
  f.status.value = product ? product.status : "Ativo";
  openModal("product-modal");
}

renderShell("produtos.html");
injectProductModal();
renderProducts();

document.addEventListener("click", () => {
  if (openMenuId) {
    openMenuId = null;
    renderProducts();
  }
});
