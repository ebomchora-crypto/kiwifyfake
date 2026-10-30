renderShell("index.html");
renderDashboardPage();
wireDashboardModal();
wireAccountModal();

function renderDashboardPage() {
  const s = Store.get().dashboard;
  const root = document.getElementById("page-root");

  root.innerHTML = `
    <div class="page-head">
      <h1>Dashboard</h1>
      <select id="period-select">
        <option>Hoje</option>
        <option>Ontem</option>
        <option>7 dias</option>
        <option>30 dias</option>
        <option>Este mês</option>
      </select>
      <select><option>Todos os produtos</option></select>
      <select><option>Todas as moedas</option></select>
    </div>

    <div class="grid">
      <div class="card chart-card">
        <div class="chart-top-value">R$ ${maxChartLabel(s.chartPoints)}</div>
        <div class="chart-wrap">${renderChartSvg(s.chartPoints)}</div>
        <div class="chart-axis">
          <span>${escapeHtml(s.period)}, 0:00</span>
          <span>${escapeHtml(s.period)}, 23:59</span>
        </div>
      </div>

      ${metricCard("wallet", "Valor líquido", formatBRL(s.valorLiquido))}
      ${metricCard("card", "Aprovação cartão", formatPct(s.aprovacaoCartao))}
      ${metricCard("refresh", "Reembolso", formatPct(s.reembolso))}
      ${metricCard("ban", "Chargeback", formatPct(s.chargeback))}

      ${metricCard("trend", "Vendas", String(s.vendas))}
      ${metricCard("globe", "Vendas 1-click da rede Kiwify", formatBRL(s.vendas1Click), "0 %")}
      ${metricCard("percent", "Conversão boleto", formatPct(s.conversaoBoleto))}
      ${metricCard("hash", "Boletos gerados", String(s.boletosGerados))}
    </div>
  `;

  document.getElementById("period-select").value = s.period;
  document.getElementById("period-select").addEventListener("change", (e) => {
    Store.update((state) => { state.dashboard.period = e.target.value; });
    renderDashboardPage();
  });
}

function metricCard(icon, label, value, sub) {
  return `
    <div class="card metric-card">
      <div class="metric-icon">${ICONS[icon]}</div>
      <div>
        <div class="metric-label">${label}</div>
        <div class="metric-value">${value}${sub ? `<span class="metric-sub">${sub}</span>` : ""}</div>
      </div>
    </div>
  `;
}

function maxChartLabel(points) {
  const max = Math.max(0, ...points.map(Number));
  return max.toLocaleString("pt-BR");
}

function renderChartSvg(points) {
  const nums = points.map(Number);
  const w = 560, h = 180, pad = 8;
  const max = Math.max(1, ...nums);
  const min = Math.min(0, ...nums);
  const range = max - min || 1;
  const step = (w - pad * 2) / (nums.length - 1 || 1);

  const coords = nums.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y];
  });

  const linePath = coords.map((c, i) => (i === 0 ? `M${c[0]},${c[1]}` : `L${c[0]},${c[1]}`)).join(" ");
  const areaPath = `${linePath} L${coords[coords.length - 1][0]},${h - pad} L${coords[0][0]},${h - pad} Z`;

  return `
    <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#5b3df0" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#5b3df0" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${areaPath}" fill="url(#chartFill)" stroke="none"/>
      <path d="${linePath}" fill="none" stroke="#5b3df0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function wireDashboardModal() {
  const overlay = document.getElementById("dashboard-modal");
  const form = document.getElementById("dashboard-form");
  const pointsWrap = document.getElementById("chart-points-fields");

  document.getElementById("open-edit").addEventListener("click", () => {
    const s = Store.get().dashboard;
    form.period.value = s.period;
    form.valorLiquido.value = s.valorLiquido;
    form.vendas.value = s.vendas;
    form.aprovacaoCartao.value = s.aprovacaoCartao;
    form.vendas1Click.value = s.vendas1Click;
    form.reembolso.value = s.reembolso;
    form.conversaoBoleto.value = s.conversaoBoleto;
    form.chargeback.value = s.chargeback;
    form.boletosGerados.value = s.boletosGerados;

    pointsWrap.innerHTML = s.chartPoints.map((v, i) =>
      `<input type="number" step="0.01" data-point-idx="${i}" value="${v}" />`
    ).join("");

    overlay.classList.add("open");
  });

  overlay.querySelectorAll("[data-close]").forEach(btn =>
    btn.addEventListener("click", () => overlay.classList.remove("open"))
  );
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const points = Array.from(pointsWrap.querySelectorAll("input")).map(i => Number(i.value) || 0);

    Store.update((state) => {
      state.dashboard = {
        period: fd.get("period") || "Hoje",
        valorLiquido: Number(fd.get("valorLiquido")) || 0,
        vendas: Number(fd.get("vendas")) || 0,
        aprovacaoCartao: Number(fd.get("aprovacaoCartao")) || 0,
        vendas1Click: Number(fd.get("vendas1Click")) || 0,
        reembolso: Number(fd.get("reembolso")) || 0,
        conversaoBoleto: Number(fd.get("conversaoBoleto")) || 0,
        chargeback: Number(fd.get("chargeback")) || 0,
        boletosGerados: Number(fd.get("boletosGerados")) || 0,
        chartPoints: points,
      };
    });

    overlay.classList.remove("open");
    renderDashboardPage();
  });
}

function wireAccountModal() {
  const overlay = document.getElementById("account-modal");
  const form = document.getElementById("account-form");

  overlay.querySelectorAll("[data-close-account]").forEach(btn =>
    btn.addEventListener("click", () => overlay.classList.remove("open"))
  );
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    Store.update((state) => {
      state.account.name = fd.get("name") || state.account.name;
      state.account.email = fd.get("email") || state.account.email;
      state.account.goal = Number(fd.get("goal")) || state.account.goal;
      state.account.goalCurrent = Number(fd.get("goalCurrent")) || 0;
    });
    overlay.classList.remove("open");
    location.reload();
  });

  window.openAccountModal = () => {
    const a = Store.get().account;
    form.name.value = a.name;
    form.email.value = a.email;
    form.goal.value = a.goal;
    form.goalCurrent.value = a.goalCurrent;
    document.getElementById("user-menu").classList.remove("open");
    overlay.classList.add("open");
  };
}
