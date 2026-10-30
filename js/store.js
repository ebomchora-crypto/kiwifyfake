// Camada de dados local (tudo fica salvo no localStorage do seu navegador).
// Projeto de estudo/mockup de UI — nenhum dado é real nem enviado a qualquer servidor.

const STORAGE_KEY = "kiwifyfake_state_v1";

const DEFAULT_STATE = {
  account: {
    name: "Minha Conta Demo",
    email: "demo@exemplo.com",
    goal: 10000,
    goalCurrent: 100,
  },
  dashboard: {
    period: "Hoje",
    valorLiquido: 0,
    vendas: 0,
    aprovacaoCartao: 0,
    vendas1Click: 0,
    reembolso: 0,
    conversaoBoleto: 0,
    chargeback: 0,
    boletosGerados: 0,
    chartPoints: [0, 0, 0, 0, 0, 0, 0],
  },
  products: [
    { id: cryptoRandomId(), name: "AprovaAI — Método de Preparação", price: 37.9, status: "Ativo" },
    { id: cryptoRandomId(), name: "Code Sellers", price: 99.9, status: "Ativo" },
    { id: cryptoRandomId(), name: "GERADOR IA", price: 119.99, status: "Bloqueado" },
    { id: cryptoRandomId(), name: "1000 CRÉDITOS", price: 99.0, status: "Bloqueado" },
  ],
};

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(DEFAULT_STATE), ...parsed,
      account: { ...DEFAULT_STATE.account, ...(parsed.account || {}) },
      dashboard: { ...DEFAULT_STATE.dashboard, ...(parsed.dashboard || {}) },
      products: Array.isArray(parsed.products) ? parsed.products : DEFAULT_STATE.products,
    };
  } catch (e) {
    console.warn("Falha ao carregar estado, usando padrão.", e);
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const Store = {
  get() {
    return loadState();
  },
  update(mutator) {
    const state = loadState();
    mutator(state);
    saveState(state);
    return state;
  },
  reset() {
    localStorage.removeItem(STORAGE_KEY);
    return loadState();
  },
};

function formatBRL(value) {
  const n = Number(value) || 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatPct(value) {
  const n = Number(value) || 0;
  return `${n}%`.replace(".", ",");
}
