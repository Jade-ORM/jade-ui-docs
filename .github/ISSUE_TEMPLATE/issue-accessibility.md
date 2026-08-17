## Descrição

O site de documentação Jade-Docs precisa de melhorias de acessibilidade (a11y) para atender pessoas com deficiências visuais, motoras ou cognitivas. Atualmente, o site pode ter problemas de contraste, navegação por teclado, e suporte a screen readers.

## Problemas Comuns em Sites React + Tailwind

### 1. Contraste de cores
- Texto claro em fundo claro
- Links sem contraste suficiente
- Code blocks com contraste insuficiente

### 2. Navegação por teclado
- Links e botões devem ser focáveis
- Skip to content link
- Focus visible indicators
- Tab order lógico

### 3. Screen readers
- Imagens sem `alt` text
- Ícones sem `aria-label`
- Landmarks semânticos (`<nav>`, `<main>`, `<aside>`)
- Headings hierarchy (h1 → h2 → h3)

### 4. Formulários
- Labels associados a inputs
- Error messages associadas a campos
- Required fields indicados

## Solução Proposta

### 1. Adicionar skip link
```tsx
function Layout({ children }) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only ...">
        Skip to content
      </a>
      <nav>...</nav>
      <main id="main-content">{children}</main>
    </>
  );
}
```

### 2. Melhorar contraste
```tsx
// Verificar WCAG 2.1 AA (4.5:1 para texto normal)
// Usar ferramentas como axe DevTools ou Lighthouse
```

### 3. Adicionar landmarks semânticos
```tsx
<header>...</header>
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<aside aria-label="Sidebar">...</aside>
<footer>...</footer>
```

### 4. Code blocks acessíveis
```tsx
<pre role="region" aria-label="Code example" tabIndex={0}>
  <code>...</code>
</pre>
```

### 5. Testes de acessibilidade
```bash
npm install -D @axe-core/react jest-axe
```

## Critérios de Aceite

- [ ] Lighthouse accessibility score ≥ 90
- [ ] Skip to content link funcionando
- [ ] Navegação por teclado completa
- [ ] Contraste WCAG 2.1 AA (4.5:1)
- [ ] Screen reader testado (NVDA/VoiceOver)
- [ ] Landmarks semânticos em todas as páginas
- [ ] Imagens e ícones com alt/aria-label
