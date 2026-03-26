# Implementação de Pré-Renderização com vite-prerender-plugin

## Resumo

Este documento detalha todas as alterações necessárias para implementar a pré-renderização do site usando o plugin `vite-prerender-plugin`.

**Plugin escolhido:** [vite-prerender-plugin](https://github.com/preactjs/vite-prerender-plugin)  
**Motivo:** Mais popular (~950K downloads/semana), mantido ativamente pelo Preact Team, compatível com Vite 8, framework-agnóstico.

---

## 1. Alterações no package.json

### Remover dependência quebrada
```diff
"devDependencies": {
-   "vite-plugin-prerender": "^1.0.8"
}
```

### Adicionar nova dependência
```bash
npm uninstall vite-plugin-prerender
npm install -D vite-prerender-plugin
```

### Resultado esperado
```json
{
  "devDependencies": {
    "vite-prerender-plugin": "^0.5.13"
  }
}
```

---

## 2. Criar script de pré-renderização

### Novo arquivo: `src/prerender.tsx`

```tsx
import { renderToString } from 'react-dom/server';
import { StrictMode } from 'react';
import App from './App';

// Dados dos meses para pré-renderizar conteúdo inicial
import januaryData from './data/2026/january_2026.json';

interface PrerenderData {
  url: string;
}

interface PrerenderResult {
  html: string;
  head?: {
    lang?: string;
    title?: string;
    elements?: Set<{ type: string; props: Record<string, string> }>;
  };
}

export async function prerender(data: PrerenderData): Promise<PrerenderResult> {
  // Renderiza o componente App com dados iniciais de janeiro
  // (o mês será determinado pelo usuário no cliente)
  const html = renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );

  // Retorna o HTML pré-renderizado com meta tags SEO
  return {
    html,
    head: {
      lang: 'pt-BR',
      title: 'Tábua de Marés Maceió 2026 - Horários de Maré Alagoas',
      elements: new Set([
        { 
          type: 'meta', 
          props: { 
            name: 'description', 
            content: 'Consulte a tábua de marés de Maceió 2026. Horários de preamar e baixa-mar atualizados para praias de Alagoas. Dados oficiais da Marinha do Brasil.' 
          } 
        },
        {
          type: 'meta',
          props: {
            property: 'og:title',
            content: 'Tábua de Marés Maceió 2026'
          }
        },
        {
          type: 'meta',
          props: {
            property: 'og:description',
            content: 'Consulte os horários de preamar e baixa-mar para as praias de Maceió e Alagoas.'
          }
        }
      ])
    }
  };
}
```

---

## 3. Alterações no vite.config.ts

### De:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
})
```

### Para:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    vitePrerenderPlugin({
      // Seletor do elemento onde o React renderiza
      renderTarget: '#root',
      // Caminho absoluto para o script de prerender
      prerenderScript: path.resolve(__dirname, 'src/prerender.tsx'),
      // Rotas adicionais para pré-renderizar (além da raiz)
      additionalPrerenderRoutes: ['/'],
    }),
  ],
  base: '/',
})
```

---

## 4. Alterações no index.html

### Opção A: Usar atributo `prerender` no script (recomendado)

```html
<!-- Antes -->
<script type="module" src="/src/main.tsx"></script>

<!-- Depois -->
<script type="module" src="/src/main.tsx"></script>
<script prerender type="module" src="/src/prerender.tsx"></script>
```

### Opção B: Usar `prerenderScript` no config (já configurado acima)

Se usar a configuração `prerenderScript` no `vite.config.ts`, não é necessário adicionar o atributo no HTML.

---

## 5. Ajustes no App.tsx para SSR

### Problema: Uso de localStorage/window no servidor

O componente atual usa `localStorage` no início, o que causa erro no servidor:

```typescript
// ❌ Erro no SSR - localStorage não existe no servidor
function getStoredViewMode(): 'cards' | 'table' {
  const stored = localStorage.getItem('viewMode');
  return stored === 'table' ? 'table' : 'cards';
}
```

### Solução: Verificar se está no cliente

```typescript
// ✅ Compatível com SSR
function getStoredViewMode(): 'cards' | 'table' {
  if (typeof window === 'undefined') return 'cards'; // SSR fallback
  const stored = localStorage.getItem('viewMode');
  return stored === 'table' ? 'table' : 'cards';
}
```

### Verificar também em getCurrentMonthKey

```typescript
function getCurrentMonthKey(): MonthKey {
  // Funciona tanto no servidor quanto no cliente
  const currentMonth = new Date().getMonth();
  return MONTHS[currentMonth].key;
}
```

---

## 6. Ajustes no hook useTideData

### Verificar se há uso de APIs de browser

Se o hook usa `fetch` ou outras APIs que podem não existir no servidor durante o build, usar verificação:

```typescript
if (typeof window !== 'undefined') {
  // Código que roda apenas no cliente
}
```

---

## 7. Estrutura Final de Arquivos

```
src/
├── main.tsx          # Entry point do cliente (hydrate)
├── prerender.tsx     # NEW: Script de pré-renderização (SSR)
├── App.tsx           # Componente principal (ajustado para SSR)
├── components/
├── hooks/
├── types/
└── utils/
```

---

## 8. Comandos de Build

```bash
# Desenvolvimento (sem prerender)
npm run dev

# Build de produção (com prerender)
npm run build

# Preview do build
npm run preview
```

---

## 9. Validação

### Verificar HTML gerado

Após `npm run build`, verificar se `dist/index.html` contém:

1. ✅ Conteúdo dentro de `<div id="root">` (não vazio)
2. ✅ Meta tags preservados
3. ✅ Structured data (JSON-LD) preservado
4. ✅ Script AdSense presente

### Teste com curl

```bash
curl -s file://$(pwd)/dist/index.html | grep -A5 '<div id="root">'
```

### Lighthouse

```bash
npx lighthouse https://localhost:4173 --view
```

---

## 10. Checklist de Implementação

- [ ] Executar `npm uninstall vite-plugin-prerender`
- [ ] Executar `npm install -D vite-prerender-plugin`
- [ ] Criar arquivo `src/prerender.tsx`
- [ ] Atualizar `vite.config.ts` com o novo plugin
- [ ] Ajustar `src/App.tsx` para compatibilidade SSR
- [ ] Verificar `src/hooks/useTideData.ts` para APIs de browser
- [ ] Executar `npm run build`
- [ ] Verificar `dist/index.html` tem conteúdo pré-renderizado
- [ ] Testar com `npm run preview`
- [ ] Validar com Lighthouse

---

## 11. Possíveis Problemas e Soluções

### Erro: "localStorage is not defined"
**Solução:** Adicionar verificação `typeof window !== 'undefined'`

### Erro: "document is not defined"
**Solução:** Usar import dinâmico para código client-only

### CSS não aplicado no prerender
**Solução:** O plugin injeta CSS automaticamente, verificar se Tailwind está configurado corretamente

### Hydration mismatch
**Solução:** Garantir que o estado inicial no servidor seja o mesmo do cliente

---

## 12. Resultado Esperado

### Antes (SPA puro)
```html
<div id="root"></div>
```

### Depois (Pré-renderizado)
```html
<div id="root">
  <div class="min-h-screen bg-gradient-to-b from-tide-50 to-tide-100 flex flex-col">
    <div class="sticky top-0 z-10">
      <header class="bg-white">
        <div class="max-w-7xl mx-auto px-4 py-4 md:py-5">
          <div class="flex items-center gap-3">
            <svg>...</svg>
            <h1 class="text-fluid-xl font-bold text-tide-800">
              Tábua de Marés - Maceió
            </h1>
          </div>
        </div>
      </header>
      <!-- ... resto do conteúdo ... -->
    </div>
  </div>
</div>
```

---

## Referências

- [vite-prerender-plugin GitHub](https://github.com/preactjs/vite-prerender-plugin)
- [vite-prerender-plugin Examples](https://github.com/preactjs/vite-prerender-plugin/tree/master/examples)
- [React renderToString](https://react.dev/reference/react-dom/server/renderToString)
- [Vite SSR Guide](https://vitejs.dev/guide/ssr.html)
