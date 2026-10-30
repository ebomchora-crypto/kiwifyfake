const slug = new URLSearchParams(location.search).get("p");
const page = PAGES[slug];

if (!page) {
  location.replace("index.html");
} else {
  document.title = `${page.label} (mockup)`;
  renderShell(`pagina.html?p=${slug}`);

  document.getElementById("page-root").innerHTML = `
    <div class="page-head" style="max-width:944px">
      <h1>${page.label}</h1>
      <span class="spacer"></span>
      ${page.cta ? `<button class="btn btn-primary" type="button">${page.cta}</button>` : ""}
    </div>
    <div class="card" style="max-width:944px">
      <div class="empty">
        <span class="empty-icon">${ICONS[page.icon]}</span>
        <p>${page.empty}</p>
      </div>
    </div>
  `;
}
