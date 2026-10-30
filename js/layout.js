// Monta sidebar + topbar reutilizáveis em todas as páginas.

const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.82Z"/><circle cx="7.5" cy="7.5" r="1.3"/></svg>`,
  members: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 4v5"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/><path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.6L21 7H5.3"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.3"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16.5 4.8a3.3 3.3 0 0 1 0 6.4"/><path d="M19 20a6.2 6.2 0 0 0-3.4-5.5"/></svg>`,
  trend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 16 6-6 4 4 8-9"/><path d="M15 5h6v6"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/></svg>`,
  wallet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="16.5" cy="14.2" r="1"/></svg>`,
  bars: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M12 20V4"/><path d="M20 20v-6"/></svg>`,
  team: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0"/><path d="M14.5 20a4.3 4.3 0 0 1 7.5-2.8"/></svg>`,
  apps: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></svg>`,
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.3 9a2.7 2.7 0 1 1 3.8 2.5c-.9.4-1.4 1-1.4 2"/><path d="M12 17h.01"/></svg>`,
  card: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z"/></svg>`,
  percent: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="2.3"/><circle cx="17" cy="17" r="2.3"/><path d="M18 6 6 18"/></svg>`,
  ban: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m5.5 5.5 13 13"/></svg>`,
  hash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9h14"/><path d="M5 15h14"/><path d="M10 4 7 20"/><path d="M17 4l-3 16"/></svg>`,
  dots: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>`,
};

const NAV_ITEMS = [
  { href: "index.html", label: "Dashboard", icon: "home" },
  { href: "produtos.html", label: "Produtos", icon: "tag" },
  { href: "#", label: "Área de Membros", icon: "members" },
  { href: "#", label: "Marketplace", icon: "cart" },
  { href: "#", label: "Meus Afiliados", icon: "users" },
  { href: "#", label: "Vendas", icon: "trend" },
  { href: "#", label: "Assinaturas", icon: "refresh" },
  { href: "#", label: "Financeiro", icon: "wallet" },
  { href: "#", label: "Relatórios", icon: "bars" },
  { href: "#", label: "Colaboradores", icon: "team" },
  { href: "#", label: "Apps", icon: "apps" },
  { href: "#", label: "Ajuda", icon: "help" },
];

function renderShell(activeHref) {
  const state = Store.get();
  const pct = Math.min(100, Math.round((state.account.goalCurrent / state.account.goal) * 100) || 0);

  document.body.insertAdjacentHTML("afterbegin", `
    <div class="app">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="logo-dot">K</div>
          <div class="brand-name">${escapeHtml(state.account.name)}</div>
          <span class="chev">▾</span>
        </div>
        <nav>
          ${NAV_ITEMS.map(item => `
            <a class="nav-item ${item.href === activeHref ? "active" : ""}" href="${item.href}">
              ${ICONS[item.icon]}<span>${item.label}</span>
            </a>
          `).join("")}
        </nav>
      </aside>

      <div class="content">
        <div class="topbar">
          <div class="account">${escapeHtml(state.account.name)} <span class="chev">▾</span></div>
          <div class="topbar-spacer"></div>
          <div class="balance">
            <span id="goal-label">R$ ${compactBRL(state.account.goalCurrent)} / R$ ${compactBRL(state.account.goal)}</span>
            <div class="balance-track"><div class="balance-fill" style="width:${pct}%"></div></div>
          </div>
          <div class="avatar-btn">
            <button class="avatar" id="avatar-btn">👤</button>
            <div class="user-menu" id="user-menu">
              <div class="email">${escapeHtml(state.account.email)}</div>
              <button type="button" id="menu-edit-account">⚙️ Editar conta / meta</button>
              <button type="button" id="menu-reset">🗑️ Resetar dados demo</button>
            </div>
          </div>
        </div>
        <main class="page" id="page-root"></main>
      </div>
    </div>
    <div class="demo-badge">MOCKUP DE ESTUDO — dados fictícios, salvos só neste navegador</div>
  `);

  const avatarBtn = document.getElementById("avatar-btn");
  const userMenu = document.getElementById("user-menu");
  avatarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("open");
  });
  document.addEventListener("click", () => userMenu.classList.remove("open"));

  document.getElementById("menu-reset").addEventListener("click", () => {
    if (confirm("Isso vai apagar todos os valores e produtos que você editou e voltar ao estado inicial de exemplo. Continuar?")) {
      Store.reset();
      location.reload();
    }
  });

  document.getElementById("menu-edit-account").addEventListener("click", () => {
    if (typeof openAccountModal === "function") openAccountModal();
  });
}

function compactBRL(n) {
  const num = Number(n) || 0;
  if (num >= 1000) return (num / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "K";
  return num.toLocaleString("pt-BR");
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
