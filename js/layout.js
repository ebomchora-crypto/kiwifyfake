const S = (d, extra = "") =>
  `<svg viewBox="0 0 20 20" fill="currentColor" ${extra}><path fill-rule="evenodd" clip-rule="evenodd" d="${d}"/></svg>`;
const O = (d) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;

const ICONS = {
  home: S("M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"),
  tag: S("M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"),
  academic: S("M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"),
  cart: S("M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"),
  user: S("M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"),
  trending: S("M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"),
  refresh: S("M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"),
  card: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/></svg>`,
  chartBar: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>`,
  userGroup: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>`,
  cube: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"/></svg>`,
  question: S("M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"),
  chevDown: S("M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"),
  dollar: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"/></svg>`,
  trendOutline: O("M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"),
  globe: O("M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"),
  refund: S("M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z"),
  tax: S("M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"),
  ban: O("M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"),
  hash: O("M7 20l4-16m2 16l4-16M6 9h14M4 15h14"),
  bell: O("M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"),
  switch: O("M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"),
  userOutline: O("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"),
  logout: O("M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"),
  pencil: O("M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"),
  cog: O("M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"),
  trash: O("M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"),
  x: O("M6 18L18 6M6 6l12 12"),
  gift: O("M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"),
  search: S("M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"),
  dotsV: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/></svg>`,
  check: S("M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"),
  plus: O("M12 4v16m8-8H4"),
  menu: O("M4 6h16M4 12h16M4 18h16"),
  inbox: O("M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"),
  chat: `<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.3 1.1 4.4 2.9 5.9-.2 1.4-.9 2.7-1.9 3.6 2 .1 3.9-.6 5.3-1.8 1.2.4 2.4.6 3.7.6 5.5 0 10-3.8 10-8.5S17.5 3 12 3z"/></svg>`,
};

// Marca genérica (não é o logo da Kiwify).
const BRAND_MARK = `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M8.5 12.5l2.3 2.3 4.7-5"/></svg>`;

const GEM = (fill, light) =>
  `<svg viewBox="0 0 18 28"><path d="M9 0l9 5.5v17L9 28l-9-5.5v-17z" fill="${fill}"/><path d="M9 4l5 3v14l-5 3-5-3V7z" fill="${light}"/></svg>`;
const MEDAL = (fill) =>
  `<svg viewBox="0 0 22 28"><path d="M5 0h4l2 6 2-6h4l-4 10H9z" fill="#dc2626"/><circle cx="11" cy="18" r="9" fill="${fill}"/><circle cx="11" cy="18" r="5.5" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/></svg>`;

const AWARDS = [
  { label: "R$ 10K", value: 10000, icon: MEDAL("#cd7f32") },
  { label: "R$ 100K", value: 100000, icon: MEDAL("#b8bec6") },
  { label: "R$ 1M", value: 1000000, icon: MEDAL("#e6b422") },
  { label: "R$ 5M", value: 5000000, icon: GEM("#16a34a", "#4ade80") },
  { label: "R$ 10M", value: 10000000, icon: GEM("#16a34a", "#86efac") },
  { label: "R$ 25M", value: 25000000, icon: GEM("#111827", "#374151") },
];

// Páginas secundárias, renderizadas por pagina.html?p=<slug>.
const PAGES = {
  "area-de-membros": { label: "Área de Membros", icon: "academic", empty: "Você ainda não criou nenhuma área de membros.", cta: "Criar área de membros" },
  "marketplace": { label: "Marketplace", icon: "cart", empty: "Nenhum produto disponível para afiliação no momento." },
  "afiliados": { label: "Meus Afiliados", icon: "user", empty: "Você ainda não tem afiliados." },
  "vendas": { label: "Vendas", icon: "trending", empty: "Nenhuma venda encontrada para o período selecionado.", chevron: true },
  "assinaturas": { label: "Assinaturas", icon: "refresh", empty: "Nenhuma assinatura ativa." },
  "financeiro": { label: "Financeiro", icon: "card", empty: "Nenhuma movimentação financeira." },
  "relatorios": { label: "Relatórios", icon: "chartBar", empty: "Nenhum relatório gerado ainda.", cta: "Gerar relatório" },
  "colaboradores": { label: "Colaboradores", icon: "userGroup", empty: "Você ainda não adicionou colaboradores.", cta: "Adicionar colaborador" },
  "apps": { label: "Apps", icon: "cube", empty: "Nenhuma integração conectada.", cta: "Explorar apps" },
  "ajuda": { label: "Ajuda", icon: "question", empty: "Precisa de ajuda? Use o chat no canto da tela." },
};

const NAV_ITEMS = [
  { href: "index.html", label: "Dashboard", icon: "home" },
  { href: "produtos.html", label: "Produtos", icon: "tag" },
  ...Object.entries(PAGES).map(([slug, p]) => ({ href: `pagina.html?p=${slug}`, label: p.label, icon: p.icon, chevron: p.chevron })),
];

const AVATAR_SVG = `<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#e5e7eb"/><circle cx="20" cy="15" r="7" fill="#c4c9d0"/><path d="M5 38c2-8 8-12 15-12s13 4 15 12z" fill="#c4c9d0"/></svg>`;

function renderShell(activeHref) {
  const { account } = Store.get();
  const pct = Math.min(100, (account.goalCurrent / account.goal) * 100 || 0);

  document.body.insertAdjacentHTML("afterbegin", `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand" id="brand-btn" title="${escapeHtml(account.name)}">
        <div class="brand-logo">${BRAND_MARK}</div>
        <div class="brand-name">${escapeHtml(account.name)}</div>
        <span class="brand-chev">${ICONS.chevDown}</span>
      </div>
      <div class="account-menu" id="account-menu">
        <div class="menu-section">Suas contas</div>
        <button type="button" class="account-row current">
          <span class="account-logo">${BRAND_MARK}</span>
          <span class="account-text"><strong>${escapeHtml(account.name)}</strong><small>Produtor</small></span>
          <span class="account-check">${ICONS.check}</span>
        </button>
        <div class="menu-sep"></div>
        <button type="button" class="account-add">${ICONS.plus}Criar nova conta</button>
      </div>
      <nav>
        ${NAV_ITEMS.map((item) => `
          <a class="nav-item ${item.href === activeHref ? "active" : ""}" href="${item.href}">
            <span class="nav-icon-wrap">${ICONS[item.icon].replace("<svg", '<svg class="nav-icon"')}</span>
            <span>${item.label}</span>
            ${item.chevron ? ICONS.chevDown.replace("<svg", '<svg class="nav-chev"') : ""}
          </a>`).join("")}
      </nav>
    </aside>

    <div class="main">
      <header class="topbar">
        <button class="menu-toggle" id="menu-toggle" aria-label="Abrir menu">${ICONS.menu}</button>
        <span class="topbar-name">${escapeHtml(account.name)}</span>
        <div class="topbar-spacer"></div>
        <div class="goal" id="goal-btn" title="Premiações">
          <span class="goal-gem">${GEM("#16a34a", "#4ade80")}</span>
          <div class="goal-info">
            <span class="goal-label">R$ ${formatGoal(account.goalCurrent)} / R$ ${formatGoal(account.goal)}</span>
            <div class="goal-track"><div class="goal-fill" style="width:${pct}%"></div></div>
          </div>
        </div>
        <div class="avatar-wrap">
          <button class="avatar" id="avatar-btn" aria-label="Menu do usuário">${AVATAR_SVG}</button>
          <div class="user-menu" id="user-menu">
            <div class="menu-email">${escapeHtml(account.email)}</div>
            <button type="button" id="menu-notifications">${ICONS.bell}Notificações</button>
            <button type="button">${ICONS.switch}Mudar para painel do aluno</button>
            <button type="button">${ICONS.userOutline}Meu perfil</button>
            <button type="button">${ICONS.logout}Sair</button>
            <div class="menu-sep"></div>
            <div class="menu-section">Mockup</div>
            <button type="button" id="menu-edit-values">${ICONS.pencil}Configurar valores<kbd>Ctrl ⇧ 8</kbd></button>
            <button type="button" id="menu-edit-account">${ICONS.cog}Editar conta / meta</button>
            <button type="button" id="menu-reset">${ICONS.trash}Resetar dados</button>
          </div>
        </div>
      </header>
      <main class="page" id="page-root"></main>
    </div>

    <button class="chat-fab" aria-label="Chat">${ICONS.chat}</button>
    <div class="demo-badge">mockup de estudo · dados fictícios</div>
    <div class="scrim" id="scrim"></div>

    <aside class="drawer" id="notifications">
      <div class="drawer-head">
        <h2>Notificações</h2>
        <button class="modal-x" id="notifications-close" aria-label="Fechar">${ICONS.x}</button>
      </div>
      <div class="empty">
        <span class="empty-icon">${ICONS.bell}</span>
        <p>Você não tem notificações.</p>
      </div>
    </aside>

    <div class="modal-overlay" id="awards-modal">
      <div class="modal">
        <div class="modal-head">
          <div class="modal-ic">${ICONS.gift}</div>
          <h2>Premiações</h2>
          <button class="modal-x" data-close>${ICONS.x}</button>
        </div>
        <p class="lead">Você recebe prêmios ao atingir metas de faturamento líquido, tanto como
          produtor quanto como co-produtor e afiliado. <a href="#">Leia mais sobre as premiações.</a></p>
        <h3>Suas premiações</h3>
        <table class="awards">
          <thead><tr><th>Data</th><th>Premiação</th><th>Status</th><th>Rastreio</th></tr></thead>
          <tbody id="awards-body"></tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" id="account-modal">
      <div class="modal sm">
        <div class="modal-head">
          <h2>Editar conta / meta</h2>
          <button class="modal-x" data-close>${ICONS.x}</button>
        </div>
        <form id="account-form">
          <div class="form-grid">
            <div class="field"><label>Nome da conta</label><input type="text" name="name" /></div>
            <div class="field"><label>E-mail (menu)</label><input type="text" name="email" /></div>
            <div class="field"><label>Meta (R$)</label><input type="number" step="1" name="goal" /></div>
            <div class="field"><label>Faturamento atual (R$)</label><input type="number" step="1" name="goalCurrent" /></div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-white" data-close>Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `);

  wireModal("awards-modal");
  wireModal("account-modal");

  const userMenu = document.getElementById("user-menu");
  const accountMenu = document.getElementById("account-menu");
  bindDropdown(document.getElementById("avatar-btn"), userMenu);
  bindDropdown(document.getElementById("brand-btn"), accountMenu);

  const sidebar = document.getElementById("sidebar");
  const drawer = document.getElementById("notifications");
  const scrim = document.getElementById("scrim");
  const closeOverlays = () => {
    sidebar.classList.remove("open");
    drawer.classList.remove("open");
    scrim.classList.remove("open");
  };
  document.getElementById("menu-toggle").addEventListener("click", () => {
    sidebar.classList.add("open");
    scrim.classList.add("open");
  });
  document.getElementById("menu-notifications").addEventListener("click", () => {
    userMenu.classList.remove("open");
    drawer.classList.add("open");
    scrim.classList.add("open");
  });
  document.getElementById("notifications-close").addEventListener("click", closeOverlays);
  scrim.addEventListener("click", closeOverlays);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeOverlays(); });

  document.getElementById("goal-btn").addEventListener("click", () => {
    const { goalCurrent } = Store.get().account;
    document.getElementById("awards-body").innerHTML = AWARDS.map((a) => {
      const won = goalCurrent >= a.value;
      return `<tr>
        <td>---</td>
        <td><span class="award">${a.icon}${a.label}</span></td>
        <td><span class="pill ${won ? "green" : "gray"}">${won ? "Conquistado" : "Não conquistado"}</span></td>
        <td>---</td>
      </tr>`;
    }).join("");
    openModal("awards-modal");
  });

  document.getElementById("menu-edit-values").addEventListener("click", () => {
    userMenu.classList.remove("open");
    if (typeof openConfig === "function") openConfig();
    else location.href = "index.html#editar";
  });

  document.getElementById("menu-reset").addEventListener("click", () => {
    if (confirm("Apagar todos os valores e produtos editados e voltar ao exemplo inicial?")) {
      Store.reset();
      location.reload();
    }
  });

  const accountForm = document.getElementById("account-form");
  document.getElementById("menu-edit-account").addEventListener("click", () => {
    userMenu.classList.remove("open");
    const a = Store.get().account;
    const f = accountForm.elements;
    f.name.value = a.name;
    f.email.value = a.email;
    f.goal.value = a.goal;
    f.goalCurrent.value = a.goalCurrent;
    openModal("account-modal");
  });
  accountForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(accountForm);
    Store.update((s) => {
      s.account.name = fd.get("name") || s.account.name;
      s.account.email = fd.get("email") || s.account.email;
      s.account.goal = Number(fd.get("goal")) || s.account.goal;
      s.account.goalCurrent = Number(fd.get("goalCurrent")) || 0;
    });
    location.reload();
  });
}

const dropdowns = [];

function bindDropdown(trigger, menu) {
  dropdowns.push(menu);
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !menu.classList.contains("open");
    dropdowns.forEach((m) => m.classList.remove("open"));
    menu.classList.toggle("open", willOpen);
  });
  menu.addEventListener("click", (e) => e.stopPropagation());
}

document.addEventListener("click", () => dropdowns.forEach((m) => m.classList.remove("open")));

function openModal(id) {
  document.getElementById(id).classList.add("open");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

function wireModal(id) {
  const overlay = document.getElementById(id);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest("[data-close]")) closeModal(id);
  });
}

function refreshGoal() {
  const { goal, goalCurrent } = Store.get().account;
  document.querySelector(".goal-label").textContent = `R$ ${formatGoal(goalCurrent)} / R$ ${formatGoal(goal)}`;
  document.querySelector(".goal-fill").style.width = `${Math.min(100, (goalCurrent / goal) * 100 || 0)}%`;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") document.querySelectorAll(".modal-overlay.open").forEach((m) => m.classList.remove("open"));

  // Ctrl+8 sozinho costuma ser capturado pelo Chrome (troca para a 8ª aba); Ctrl+Shift+8 chega à página.
  if ((e.ctrlKey || e.metaKey) && (e.code === "Digit8" || e.code === "Numpad8")) {
    e.preventDefault();
    if (typeof toggleConfig === "function") toggleConfig();
    else location.href = "index.html#editar";
  }
});
