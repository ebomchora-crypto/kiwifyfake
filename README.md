# kiwifyfake

Mockup de estudo inspirado no layout do dashboard da Kiwify, feito em HTML/CSS/JS puro
(sem build step). Todos os números e produtos são editáveis pela própria interface e
ficam salvos apenas no `localStorage` do seu navegador — nada é enviado a nenhum servidor.

## Rodando localmente

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000/index.html`.

## Páginas

- `index.html` — Dashboard, com botão "Editar valores" para definir valor líquido, vendas,
  taxas, pontos do gráfico etc.
- `produtos.html` — Lista de produtos com criar/editar/ativar/bloquear/remover.

Use o menu do avatar (canto superior direito) para editar o nome da conta e a meta,
ou resetar os dados para o estado inicial de exemplo.
