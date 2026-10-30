// Mockup de estudo de UI: todos os dados ficam só no localStorage deste navegador.

const STORAGE_KEY = "kiwifyfake_state_v2";

const DEFAULT_STATE = {
  account: {
    name: "Minha Loja Demo",
    email: "demo@exemplo.com",
    goal: 10000,
    goalCurrent: 100,
  },
  dashboard: {
    period: "Hoje",
    product: "Todos os produtos",
    currency: "Todas as moedas",
    valorLiquido: 0,
    vendas: 0,
    aprovacaoCartao: 0,
    vendas1Click: 0,
    vendas1ClickPct: 0,
    reembolso: 0,
    conversaoBoleto: 0,
    chargeback: 0,
    boletosGerados: 0,
    chartPoints: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  products: [
    { id: "p1", name: "AprovaAI — Método de Preparação para Concursos", price: 37.9, status: "Ativo" },
    { id: "p2", name: "Code Sellers", price: 99.9, status: "Ativo" },
    { id: "p3", name: "GERADOR IA", price: 119.99, status: "Bloqueado" },
    { id: "p4", name: "1000 CRÉDITOS", price: 99.0, status: "Bloqueado" },
  ],
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      account: { ...DEFAULT_STATE.account, ...(parsed.account || {}) },
      dashboard: { ...DEFAULT_STATE.dashboard, ...(parsed.dashboard || {}) },
      products: Array.isArray(parsed.products) ? parsed.products : structuredClone(DEFAULT_STATE.products),
    };
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
