## Descrição

O site de documentação Jade-Docs não possui meta tags SEO, Open Graph, ou Twitter Cards configurados. Isso afeta a visibilidade nos mecanismos de busca e a aparência quando links são compartilhados em redes sociais.

## Arquivos Afetados

- `index.html` — Falta meta tags básicas
- `src/App.tsx` — Falta Helmet ou similar para meta tags dinâmicas
- Falta: `public/sitemap.xml`
- Falta: `public/robots.txt`

## Problema Atual

O `index.html` provavelmente tem apenas:

```html
<title>Jade Docs</title>
```

Sem:

- Meta description
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Canonical URL
- Structured data (JSON-LD)

## Solução Proposta

### 1. Meta tags básicas no index.html

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta
  name="description"
  content="Jade - A modern ORM for Lua and Lapis. Schema-driven, migrations, query builder, and more."
/>
<meta
  name="keywords"
  content="lua, orm, lapis, database, migrations, query builder, postgresql, mysql, sqlite"
/>
<meta name="author" content="AlehandroSV" />

<!-- Open Graph -->
<meta property="og:title" content="Jade ORM - Modern ORM for Lua" />
<meta
  property="og:description"
  content="A modern ORM for Lua and Lapis. Schema-driven development with automatic migrations."
/>
<meta property="og:type" content="website" />
<meta property="og:url" content="https://jade-orm.dev" />
<meta property="og:image" content="https://jade-orm.dev/og-image.png" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Jade ORM - Modern ORM for Lua" />
<meta
  name="twitter:description"
  content="A modern ORM for Lua and Lapis."
/>
<meta name="twitter:image" content="https://jade-orm.dev/og-image.png" />
```

### 2. React Helmet para meta tags dinâmicas

```tsx
import { Helmet } from "react-helmet-async";

function DocsPage({ section }: { section: string }) {
  return (
    <>
      <Helmet>
        <title>{section} | Jade ORM Docs</title>
        <meta
          name="description"
          content={`Learn about ${section} in Jade ORM`}
        />
      </Helmet>
      {/* ... */}
    </>
  );
}
```

### 3. Sitemap e robots.txt

```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://jade-orm.dev/</loc></url>
  <url><loc>https://jade-orm.dev/docs</loc></url>
  <url><loc>https://jade-orm.dev/api</loc></url>
  <url><loc>https://jade-orm.dev/examples</loc></url>
</urlset>
```

```
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://jade-orm.dev/sitemap.xml
```

## Critérios de Aceite

- [ ] Meta tags básicas (description, keywords) no index.html
- [ ] Open Graph tags para compartilhamento em redes sociais
- [ ] Twitter Card tags
- [ ] Meta tags dinâmicas por página (React Helmet)
- [ ] Sitemap.xml gerado
- [ ] Robots.txt configurado
- [ ] Imagem OG criada (1200x630px)
