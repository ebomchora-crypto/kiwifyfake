// Mockup de estudo de UI: todos os dados ficam só no localStorage deste navegador.

const STORAGE_KEY = "kiwifyfake_state_v2";
const OLD_DEFAULT_NAME = "Minha Loja Demo";

const PERIODS = ["Hoje", "Ontem", "Últimos 7 dias", "Últimos 30 dias", "Este mês", "Mês passado", "Máximo"];

const METRIC_KEYS = [
  "valorLiquido", "vendas", "aprovacaoCartao", "vendas1Click", "vendas1ClickPct",
  "reembolso", "conversaoBoleto", "chargeback", "boletosGerados",
];

const EMPTY_METRICS = {
  valorLiquido: 0,
  vendas: 0,
  aprovacaoCartao: 0,
  vendas1Click: 0,
  vendas1ClickPct: 0,
  reembolso: 0,
  conversaoBoleto: 0,
  chargeback: 0,
  boletosGerados: 0,
  chartPoints: [],
};

const DEFAULT_STATE = {
  account: {
    name: "Arthur Filipe Farias Costa Aquino",
    email: "demo@exemplo.com",
    goal: 10000,
    goalCurrent: 100,
  },
  dashboard: {
    period: "Hoje",
    product: "Todos os produtos",
    currency: "Todas as moedas",
    byPeriod: {},
  },
  products: [
    { id: "p1", name: "AprovaAI — Método de Preparação para Concursos", price: 37.9, status: "Ativo" },
    { id: "p2", name: "Code Sellers", price: 99.9, status: "Ativo" },
    { id: "p3", name: "GERADOR IA", price: 119.99, status: "Bloqueado" },
    { id: "p4", name: "1000 CRÉDITOS", price: 99.0, status: "Bloqueado" },
  ],
};

function migrate(parsed) {
  const account = { ...DEFAULT_STATE.account, ...(parsed.account || {}) };
  if (account.name === OLD_DEFAULT_NAME) account.name = DEFAULT_STATE.account.name;

  const d = parsed.dashboard || {};
  const dashboard = {
    period: PERIODS.includes(d.period) ? d.period : "Hoje",
    product: d.product || DEFAULT_STATE.dashboard.product,
    currency: d.currency || DEFAULT_STATE.dashboard.currency,
    byPeriod: d.byPeriod && typeof d.byPeriod === "object" ? d.byPeriod : {},
  };

  // Versão anterior guardava um único conjunto de métricas, sem separar por período.
  if (!d.byPeriod && METRIC_KEYS.some((k) => k in d)) {
    const flat = { chartPoints: Array.isArray(d.chartPoints) ? d.chartPoints : [] };
    METRIC_KEYS.forEach((k) => { flat[k] = Number(d[k]) || 0; });
    dashboard.byPeriod[dashboard.period] = flat;
  }

  return {
    account,
    dashboard,
    products: Array.isArray(parsed.products) ? parsed.products : structuredClone(DEFAULT_STATE.products),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? migrate(JSON.parse(raw)) : structuredClone(DEFAULT_STATE);
  } catch (e) {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

const Store = {
  get: loadState,
  update(mutator) {
    const state = loadState();
    mutator(state);
    saveState(state);
    return state;
  },
  reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    return loadState();
  },
};

function metricsFor(dashboard, period = dashboard.period) {
  return { ...EMPTY_METRICS, ...(dashboard.byPeriod[period] || {}) };
}

function formatBRL(value) {
  return (Number(value) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatPct(value) {
  return `${(Number(value) || 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} %`;
}

// Formato do topo: "R$ 0.1K / R$ 10K"
function formatGoal(value) {
  const k = (Number(value) || 0) / 1000;
  if (k >= 1000) return `${+(k / 1000).toFixed(1)}M`;
  return `${+k.toFixed(1)}K`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
