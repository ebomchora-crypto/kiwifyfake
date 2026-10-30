const CURRENCIES = ["Todas as moedas", "BRL", "USD", "EUR"];

const ONE_CLICK_TIP = "Valor vendido com 1 clique para compradores que já tinham dados salvos na rede, e o percentual que isso representa das suas vendas.";

function renderDashboard() {
  const { dashboard, products } = Store.get();
  const m = metricsFor(dashboard);
  const productOptions = ["Todos os produtos", ...products.map((p) => p.name)];

  document.getElementById("page-root").innerHTML = `
    <div class="page-head">
      <h1>Dashboard</h1>
      ${selectHtml("f-period", "w-sm", PERIODS, dashboard.period)}
      ${selectHtml("f-product", "w-md", productOptions, dashboard.product)}
      ${selectHtml("f-currency", "w-sm", CURRENCIES, dashboard.currency)}
    </div>

    <div class="dash">
      <div class="dash-col">
        <div class="card chart-card">${chartHtml(dashboard.period, m.chartPoints)}</div>
        ${stat(ICONS.card, "Aprovação cartão", formatPct(m.aprovacaoCartao))}
        ${stat(ICONS.refund, "Reembolso", formatPct(m.reembolso))}
        ${stat(ICONS.ban, "Chargeback", formatPct(m.chargeback))}
      </div>
      <div class="dash-col">
        ${stat(ICONS.dollar, "Valor líquido", formatBRL(m.valorLiquido))}
        ${stat(ICONS.trendOutline, "Vendas", (Number(m.vendas) || 0).toLocaleString("pt-BR"))}
        ${stat(ICONS.globe, `Vendas 1-click da rede Kiwify <span class="help" data-tip="${escapeHtml(ONE_CLICK_TIP)}">${ICONS.question}</span>`,
          formatBRL(m.vendas1Click), formatPct(m.vendas1ClickPct), true)}
        ${stat(ICONS.tax, "Conversão boleto", formatPct(m.conversaoBoleto))}
        ${stat(ICONS.hash, "Boletos gerados", (Number(m.boletosGerados) || 0).toLocaleString("pt-BR"))}
      </div>
    </div>
  `;

  bindFilter("f-period", "period");
  bindFilter("f-product", "product");
  bindFilter("f-currency", "currency");
  bindChartHover(dashboard.period, m.chartPoints);
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
    if (key === "period" && document.body.classList.contains("config-open")) fillConfig();
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

const CHART_W = 1000;
const CHART_H = 100;

function normalizePoints(points) {
  const pts = (points || []).map((v) => Number(v) || 0);
  if (pts.length >= 2) return pts;
  return [pts[0] || 0, pts[0] || 0];
}

// Fração do eixo X já "decorrida": em "Hoje" a linha para na hora atual, como no original.
function elapsedFraction(period) {
  if (period !== "Hoje") return 1;
  const now = new Date();
  return Math.max(0.05, (now.getHours() * 60 + now.getMinutes()) / 1440);
}

function chartGeometry(period, points) {
  const series = normalizePoints(points);
  const max = Math.max(0, ...series);
  const span = CHART_W * elapsedFraction(period);
  const coords = series.map((v, i) => [
    (i / (series.length - 1)) * span,
    max > 0 ? CHART_H - (v / max) * CHART_H : CHART_H,
  ]);
  return { series, max, coords };
}

function chartHtml(period, points) {
  const { max, coords } = chartGeometry(period, points);
  const [startLabel, endLabel] = axisLabels(period);
  const line = coords.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lx, ly] = coords[coords.length - 1];

  const tail = lx < CHART_W ? `
    <path d="M${lx},${ly} L${Math.min(CHART_W, lx + 30)},${ly}" stroke="#5850ec" stroke-width="2.5" stroke-dasharray="2 5" fill="none" vector-effect="non-scaling-stroke"/>
    <path d="M${Math.min(CHART_W, lx + 34)},${CHART_H} L${CHART_W},${CHART_H}" stroke="#eef0f3" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/>` : "";

  return `
    <div class="chart-body">
      <div class="chart-plot">
        <svg viewBox="0 0 ${CHART_W} ${CHART_H}" preserveAspectRatio="none">
          <path d="${line}" stroke="#5850ec" stroke-width="2.5" fill="none" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          ${tail}
        </svg>
        <div class="chart-hover" id="chart-hover">
          <div class="chart-guide"></div>
          <div class="chart-dot"></div>
          <div class="chart-tip"></div>
        </div>
      </div>
      <div class="chart-y">
        <span>R$ ${max.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</span>
        <span>R$ 0</span>
      </div>
    </div>
    <div class="chart-x"><span>${startLabel}</span><span>${endLabel}</span></div>
  `;
}

function bindChartHover(period, points) {
  const hover = document.getElementById("chart-hover");
  const { series, coords } = chartGeometry(period, points);
  const guide = hover.querySelector(".chart-guide");
  const dot = hover.querySelector(".chart-dot");
  const tip = hover.querySelector(".chart-tip");
  const lastX = coords[coords.length - 1][0];

  const show = (clientX) => {
    const rect = hover.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * CHART_W;
    if (x > lastX + 15) { hover.classList.remove("active"); return; }
    const i = Math.max(0, Math.min(series.length - 1, Math.round((x / lastX) * (series.length - 1)) || 0));
    const [px, py] = coords[i];
    const left = `${(px / CHART_W) * 100}%`;
    guide.style.left = left;
    dot.style.left = left;
    dot.style.top = `${(py / CHART_H) * 100}%`;
    tip.style.left = left;
    tip.classList.toggle("flip", px / CHART_W > 0.6);
    tip.innerHTML = `<span>${pointLabel(period, i, series.length)}</span><strong>${formatBRL(series[i])}</strong>`;
    hover.classList.add("active");
  };

  hover.addEventListener("mousemove", (e) => show(e.clientX));
  hover.addEventListener("touchstart", (e) => show(e.touches[0].clientX), { passive: true });
  hover.addEventListener("mouseleave", () => hover.classList.remove("active"));
}

function periodRange(period) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = (n) => { const x = new Date(today); x.setDate(x.getDate() + n); return x; };
  switch (period) {
    case "Últimos 7 dias": return [day(-6), today];
    case "Últimos 30 dias": return [day(-29), today];
    case "Este mês": return [new Date(today.getFullYear(), today.getMonth(), 1), today];
    case "Mês passado": return [new Date(today.getFullYear(), today.getMonth() - 1, 1), new Date(today.getFullYear(), today.getMonth(), 0)];
    case "Tempo todo": return [new Date(today.getFullYear() - 1, 0, 1), today];
    default: return [today, today];
  }
}

const fmtDay = (dt) => dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const fmtMonth = (dt) => `${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;

function axisLabels(period) {
  if (period === "Hoje" || period === "Ontem") return [`${period}, 0:00`, `${period}, 23:59`];
  const [start, end] = periodRange(period);
  const fmt = period === "Tempo todo" ? fmtMonth : fmtDay;
  return [fmt(start), fmt(end)];
}

function pointLabel(period, i, n) {
  const t = i / (n - 1);
  if (period === "Hoje" || period === "Ontem") {
    const minutes = Math.round(t * elapsedFraction(period) * 1439);
    return `${period}, ${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
  }
  const [start, end] = periodRange(period);
  const fmt = period === "Tempo todo" ? fmtMonth : fmtDay;
  return fmt(new Date(start.getTime() + t * (end - start)));
}

// ---------- Painel "Configurar valores" (Ctrl+Shift+8) ----------

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

function injectConfigPanel() {
  document.body.insertAdjacentHTML("beforeend", `
    <aside class="drawer config" id="config-panel" aria-label="Configurar valores">
      <div class="drawer-head">
        <div>
          <h2>Configurar valores</h2>
          <small>Atalho: Ctrl + Shift + 8 · salva automaticamente</small>
        </div>
        <button class="modal-x" id="config-close" aria-label="Fechar">${ICONS.x}</button>
      </div>
      <form class="drawer-body" id="config-form" autocomplete="off">
        <section>
          <h3>Período</h3>
          <div class="field">
            <select name="period">${PERIODS.map((p) => `<option>${p}</option>`).join("")}</select>
            <small>Cada período guarda os próprios valores.</small>
          </div>
        </section>

        <section>
          <h3>Métricas</h3>
          <div class="form-grid">
            ${VALUE_FIELDS.map(([name, label, step]) => `
              <div class="field"><label>${label}</label><input type="number" step="${step}" name="${name}" inputmode="decimal" /></div>
            `).join("")}
          </div>
        </section>

        <section>
          <h3>Gráfico</h3>
          <div class="field">
            <label>Pontos (da esquerda para a direita)</label>
            <input type="text" name="chartPoints" placeholder="0, 120, 80, 300, 450" />
            <small>Separados por vírgula. Use ponto para decimais (ex.: 120.50).</small>
          </div>
        </section>

        <section>
          <h3>Meta (barra do topo)</h3>
          <div class="form-grid">
            <div class="field"><label>Faturamento atual (R$)</label><input type="number" step="0.01" name="goalCurrent" /></div>
            <div class="field"><label>Meta (R$)</label><input type="number" step="1" min="1" name="goal" /></div>
          </div>
        </section>

        <div class="drawer-actions">
          <button type="button" class="btn btn-white" id="config-clear">Zerar este período</button>
          <button type="button" class="btn btn-primary" id="config-done">Concluir</button>
        </div>
      </form>
    </aside>
  `);

  const panel = document.getElementById("config-panel");
  const form = document.getElementById("config-form");
  const f = form.elements;

  form.addEventListener("submit", (e) => e.preventDefault());
  f.period.addEventListener("change", () => {
    Store.update((s) => { s.dashboard.period = f.period.value; });
    fillConfig();
    renderDashboard();
  });

  form.addEventListener("input", (e) => {
    if (e.target.name === "period") return;
    saveConfig();
  });

  document.getElementById("config-clear").addEventListener("click", () => {
    Store.update((s) => { delete s.dashboard.byPeriod[f.period.value]; });
    fillConfig();
    renderDashboard();
  });

  document.getElementById("config-close").addEventListener("click", closeConfig);
  document.getElementById("config-done").addEventListener("click", closeConfig);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("open")) closeConfig(); });
}

function parsePoints(text) {
  return String(text).split(/[,;\s]+/).filter(Boolean).map((v) => Number(v) || 0);
}

function saveConfig() {
  const f = document.getElementById("config-form").elements;
  Store.update((s) => {
    const entry = { chartPoints: parsePoints(f.chartPoints.value) };
    VALUE_FIELDS.forEach(([name]) => { entry[name] = Number(f[name].value) || 0; });
    s.dashboard.byPeriod[f.period.value] = entry;
    s.account.goalCurrent = Number(f.goalCurrent.value) || 0;
    s.account.goal = Number(f.goal.value) > 0 ? Number(f.goal.value) : s.account.goal;
  });
  renderDashboard();
  refreshGoal();
}

function fillConfig() {
  const { dashboard, account } = Store.get();
  const f = document.getElementById("config-form").elements;
  const m = metricsFor(dashboard);
  f.period.value = dashboard.period;
  VALUE_FIELDS.forEach(([name]) => { f[name].value = m[name]; });
  f.chartPoints.value = m.chartPoints.join(", ");
  f.goalCurrent.value = account.goalCurrent;
  f.goal.value = account.goal;
}

function openConfig() {
  fillConfig();
  document.getElementById("config-panel").classList.add("open");
  document.body.classList.add("config-open");
  setTimeout(() => document.getElementById("config-form").elements.valorLiquido.focus(), 50);
}

function closeConfig() {
  document.getElementById("config-panel").classList.remove("open");
  document.body.classList.remove("config-open");
}

function toggleConfig() {
  if (document.getElementById("config-panel").classList.contains("open")) closeConfig();
  else openConfig();
}

renderShell("index.html");
injectConfigPanel();
renderDashboard();

if (location.hash === "#editar") {
  history.replaceState(null, "", location.pathname);
  openConfig();
}
