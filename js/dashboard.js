const PERIODS = ["Hoje", "Ontem", "Últimos 7 dias", "Últimos 30 dias", "Este mês", "Mês passado", "Máximo"];
const CURRENCIES = ["Todas as moedas", "BRL", "USD", "EUR"];

function renderDashboard() {
  const { dashboard: d, products } = Store.get();
  const root = document.getElementById("page-root");
  const productOptions = ["Todos os produtos", ...products.map((p) => p.name)];

  root.innerHTML = `
    <div class="page-head">
      <h1>Dashboard</h1>
      ${selectHtml("f-period", "w-sm", PERIODS, d.period)}
      ${selectHtml("f-product", "w-md", productOptions, d.product)}
      ${selectHtml("f-currency", "w-sm", CURRENCIES, d.currency)}
    </div>

    <div class="dash">
      <div class="dash-col">
        <div class="card chart-card">${chartHtml(d)}</div>
        ${stat(ICONS.card, "Aprovação cartão", formatPct(d.aprovacaoCartao))}
        ${stat(ICONS.refund, "Reembolso", formatPct(d.reembolso))}
        ${stat(ICONS.ban, "Chargeback", formatPct(d.chargeback))}
      </div>
      <div class="dash-col">
        ${stat(ICONS.dollar, "Valor líquido", formatBRL(d.valorLiquido))}
        ${stat(ICONS.trendOutline, "Vendas", (Number(d.vendas) || 0).toLocaleString("pt-BR"))}
        ${stat(ICONS.globe, `Vendas 1-click da rede Kiwify <span class="help" title="Vendas feitas com 1 clique por compradores que já têm dados salvos na rede.">${ICONS.question}</span>`,
          formatBRL(d.vendas1Click), formatPct(d.vendas1ClickPct), true)}
        ${stat(ICONS.tax, "Conversão boleto", formatPct(d.conversaoBoleto))}
        ${stat(ICONS.hash, "Boletos gerados", (Number(d.boletosGerados) || 0).toLocaleString("pt-BR"))}
      </div>
    </div>
  `;

  bindFilter("f-period", "period");
  bindFilter("f-product", "product");
  bindFilter("f-currency", "currency");
}

function selectHtml(id, width, options, current) {
  return `<select class="select ${width}" id="${id}">
    ${options.map((o) => `<option ${o === current ? "selected" : ""}>${escapeHtml(o)}</option>`).join("")}
  </select>`;
}

function bindFilter(id, key) {
  document.getElementById(id).addEventListener("change", (e) => {
    Store.update((s) => { s.dashboard[key] = e.target.value; });
    renderDashboard();
  });
}

function stat(icon, label, value, sub, tall) {
  return `
    <div class="card stat ${tall ? "tall" : ""}">
      <span class="stat-icon">${icon}</span>
      <div>
        <div class="stat-label">${label}</div>
        <div class="stat-value">${value}${sub !== undefined ? `<span class="stat-sub">${sub}</span>` : ""}</div>
      </div>
    </div>`;
}

// ---------- Gráfico ----------

function chartHtml(d) {
  const pts = (d.chartPoints || []).map((v) => Number(v) || 0);
  const series = pts.length >= 2 ? pts : [pts[0] || 0, pts[0] || 0];
  const max = Math.max(0, ...series);
  const [startLabel, endLabel] = axisLabels(d.period);

  // "Hoje" só desenha até a hora atual, como no original.
  const now = new Date();
  const elapsed = d.period === "Hoje" ? Math.max(0.05, (now.getHours() * 60 + now.getMinutes()) / 1440) : 1;

  const W = 1000, H = 100;
  const span = W * elapsed;
  const y = (v) => (max > 0 ? H - (v / max) * H : H);
  const coords = series.map((v, i) => [(i / (series.length - 1)) * span, y(v)]);
  const line = coords.map(([cx, cy], i) => `${i ? "L" : "M"}${cx.toFixed(1)},${cy.toFixed(1)}`).join(" ");
  const [lx, ly] = coords[coords.length - 1];

  const tail = elapsed < 1 ? `
    <path d="M${lx},${ly} L${Math.min(W, lx + 30)},${ly}" stroke="#5850ec" stroke-width="2.5" stroke-dasharray="2 5" fill="none" vector-effect="non-scaling-stroke"/>
    <path d="M${Math.min(W, lx + 34)},${H} L${W},${H}" stroke="#eef0f3" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/>` : "";

  return `
    <div class="chart-body">
      <div class="chart-plot">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
          <path d="${line}" stroke="#5850ec" stroke-width="2.5" fill="none" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          ${tail}
        </svg>
      </div>
      <div class="chart-y">
        <span>R$ ${max.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</span>
        <span>R$ 0</span>
      </div>
    </div>
    <div class="chart-x"><span>${startLabel}</span><span>${endLabel}</span></div>
  `;
}

function axisLabels(period) {
  const today = new Date();
  const fmt = (dt) => dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  const addDays = (n) => { const x = new Date(today); x.setDate(x.getDate() + n); return x; };

  switch (period) {
    case "Hoje": return ["Hoje, 0:00", "Hoje, 23:59"];
    case "Ontem": return ["Ontem, 0:00", "Ontem, 23:59"];
    case "Últimos 7 dias": return [fmt(addDays(-6)), fmt(today)];
    case "Últimos 30 dias": return [fmt(addDays(-29)), fmt(today)];
    case "Este mês": return [fmt(new Date(today.getFullYear(), today.getMonth(), 1)), fmt(today)];
    case "Mês passado": return [
      fmt(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
      fmt(new Date(today.getFullYear(), today.getMonth(), 0)),
    ];
    default: return ["Início", fmt(today)];
  }
}

// ---------- Modal de edição dos valores ----------

const VALUE_FIELDS = [
  ["valorLiquido", "Valor líquido (R$)", "0.01"],
  ["vendas", "Vendas (quantidade)", "1"],
  ["aprovacaoCartao", "Aprovação cartão (%)", "0.01"],
  ["reembolso", "Reembolso (%)", "0.01"],
  ["chargeback", "Chargeback (%)", "0.01"],
  ["vendas1Click", "Vendas 1-click (R$)", "0.01"],
  ["vendas1ClickPct", "Vendas 1-click (%)", "0.01"],
  ["conversaoBoleto", "Conversão boleto (%)", "0.01"],
  ["boletosGerados", "Boletos gerados", "1"],
];

function injectValuesModal() {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-overlay" id="values-modal">
      <div class="modal sm">
        <div class="modal-head">
          <h2>Editar valores</h2>
          <button class="modal-x" data-close>${ICONS.x}</button>
        </div>
        <form id="values-form">
          <div class="form-grid">
            ${VALUE_FIELDS.map(([name, label, step]) => `
              <div class="field"><label>${label}</label><input type="number" step="${step}" name="${name}" /></div>
            `).join("")}
            <div class="field span2">
              <label>Pontos do gráfico</label>
              <input type="text" name="chartPoints" placeholder="0, 120, 80, 300, 450" />
              <small>Valores separados por vírgula, da esquerda para a direita.</small>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-white" data-close>Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `);

  wireModal("values-modal");

  const form = document.getElementById("values-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    Store.update((s) => {
      VALUE_FIELDS.forEach(([name]) => { s.dashboard[name] = Number(fd.get(name)) || 0; });
      const pts = String(fd.get("chartPoints"))
        .split(/[,;\s]+/)
        .filter(Boolean)
        .map((v) => Number(v.replace(",", ".")) || 0);
      s.dashboard.chartPoints = pts.length ? pts : [0, 0];
    });
    closeModal("values-modal");
    renderDashboard();
  });
}

function openValuesModal() {
  const d = Store.get().dashboard;
  const form = document.getElementById("values-form");
  VALUE_FIELDS.forEach(([name]) => { form[name].value = d[name]; });
  form.chartPoints.value = d.chartPoints.join(", ");
  openModal("values-modal");
}

renderShell("index.html");
injectValuesModal();
renderDashboard();

if (location.hash === "#editar") {
  history.replaceState(null, "", location.pathname);
  openValuesModal();
}
