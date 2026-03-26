# Vite SSR Nativo - Análise para Tábua de Marés

## 📋 O Que é o Vite SSR?

O Vite possui suporte **nativo** para Server-Side Rendering (SSR), permitindo renderizar aplicações React no servidor antes de enviá-las ao navegador.

**Importante:** O SSR do Vite é uma **API de baixo nível** destinada a autores de bibliotecas/frameworks. Para aplicações, a documentação oficial recomenda usar ferramentas de alto nível ou plugins.

---

## 🔄 SSR vs SSG (Pré-Renderização)

| Aspecto | SSR (Server-Side Rendering) | SSG (Static Site Generation) |
|---------|----------------------------|------------------------------|
| **Quando renderiza** | A cada requisição | No build (uma vez) |
| **Servidor necessário** | ✅ Sim (Node.js + Express) | ❌ Não (arquivos estáticos) |
| **GitHub Pages** | ❌ Não suportado | ✅ Suportado |
| **Dados dinâmicos** | ✅ Em tempo real | ❌ Apenas no build |
| **Latência** | Maior (renderiza por request) | Menor (HTML pronto) |
| **Custo de hospedagem** | $$ (servidor Node.js) | $ (CDN/estático) |

### Para o Projeto Tábua de Marés

O projeto **NÃO precisa de SSR dinâmico** porque:
- Os dados de maré são **estáticos** (tabela do ano inteiro conhecida)
- Não há autenticação ou personalização por usuário
- Deploy atual é no **GitHub Pages** (não suporta servidor Node.js)

**SSG (pré-renderização estática) é a melhor opção.**

---

## 🏗️ Estrutura do Vite SSR

### Arquivos Necessários

```
tabuademares.maceio.br/
├── index.html              # Template com placeholders
├── server.js               # Servidor Express
├── prerender.js            # Script de pré-renderização (SSG)
├── vite.config.ts          # Configuração Vite
└── src/
    ├── App.tsx             # Componente principal (já existe)
    ├── main.tsx            # Entrada atual (será substituída)
    ├── entry-client.tsx    # 🆕 Entrada do cliente (hydration)
    └── entry-server.tsx    # 🆕 Entrada do servidor (renderização)
```

---

## 📁 Arquivos que Seriam Criados/Alterados

### 1. `src/entry-client.tsx` (NOVO)

```tsx
import './index.css'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App'

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### 2. `src/entry-server.tsx` (NOVO)

```tsx
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export function render(_url: string) {
  const html = renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  return { html }
}
```

### 3. `index.html` (ALTERADO)

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <!-- ... meta tags existentes ... -->
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/entry-client.tsx"></script>
  </body>
</html>
```

**Mudanças:**
- Placeholder `<!--app-html-->` onde o HTML será injetado
- Script aponta para `entry-client.tsx` em vez de `main.tsx`

### 4. `server.js` (NOVO - apenas para desenvolvimento/SSR dinâmico)

```javascript
import fs from 'node:fs/promises'
import express from 'express'

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173

const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

const app = express()

let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use('/', sirv('./dist/client', { extensions: [] }))
}

app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl

    let template
    let render
    
    if (!isProduction) {
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url)
    const html = template.replace('<!--app-html-->', rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
```

### 5. `prerender.js` (NOVO - para SSG estático)

```javascript
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

// Rotas para pré-renderizar
const routesToPrerender = ['/']

const template = fs.readFileSync(toAbsolute('dist/client/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

for (const url of routesToPrerender) {
  const { html: appHtml } = render(url)

  const html = template.replace('<!--app-html-->', appHtml)

  const filePath = `dist/client${url === '/' ? '/index' : url}.html`
  fs.writeFileSync(toAbsolute(filePath), html)
  console.log('pre-rendered:', filePath)
}
```

### 6. `package.json` (ALTERADO)

```json
{
  "scripts": {
    "dev": "node server",
    "build": "npm run build:client && npm run build:server && npm run prerender",
    "build:client": "tsc -b && vite build --outDir dist/client",
    "build:server": "vite build --ssr src/entry-server.tsx --outDir dist/server",
    "prerender": "node prerender.js",
    "preview": "vite preview --outDir dist/client"
  },
  "dependencies": {
    "compression": "^1.8.1",
    "express": "^5.2.1",
    "sirv": "^3.0.2"
  }
}
```

---

## ⚠️ Desafios Específicos do Projeto

### 1. Lazy Loading de Dados

O `App.tsx` atual usa `useTideData()` que faz lazy loading dos JSONs de maré. No SSR:

```tsx
// Problema: useEffect não executa no servidor!
const { data, isLoading, error } = useTideData(selectedMonth);
```

**Solução necessária:** Pré-carregar dados no servidor:

```tsx
// entry-server.tsx
import { renderToString } from 'react-dom/server'
import App from './App'

// Carregar dados ANTES de renderizar
import marchData from './data/2026/march_2026.json'

export async function render(url: string) {
  // Passar dados iniciais via props ou contexto
  const html = renderToString(<App initialData={marchData} />)
  return { html }
}
```

### 2. localStorage não existe no servidor

```tsx
// Problema: localStorage is not defined
const [viewMode, setViewMode] = useState<'cards' | 'table'>(getStoredViewMode);
```

**Solução:**
```tsx
function getStoredViewMode(): 'cards' | 'table' {
  if (typeof window === 'undefined') return 'cards' // SSR fallback
  const stored = localStorage.getItem('viewMode')
  return stored === 'table' ? 'table' : 'cards'
}
```

### 3. Date() retorna data do servidor

```tsx
// Problema: pode renderizar mês errado no build
const currentMonth = new Date().getMonth();
```

O mês atual no build pode ser diferente do mês do usuário.

---

## 📊 Comparativo: SSR Nativo vs Plugins

| Aspecto | Vite SSR Nativo | @prerenderer/rollup-plugin |
|---------|-----------------|---------------------------|
| **Complexidade** | 🔴 Alta (5+ arquivos novos) | 🟢 Baixa (1 config) |
| **Dependências** | Express, Compression, Sirv | Puppeteer |
| **Manutenção** | Manual (você mantém) | Plugin mantido |
| **Flexibilidade** | 🟢 Total controle | 🟡 Configurável |
| **Deploy GitHub Pages** | ❌ Não (precisa servidor) | ✅ Sim |
| **Adaptações no código** | 🔴 Várias (hooks, localStorage) | 🟢 Mínimas |

---

## ✅ Vantagens do Vite SSR Nativo

1. **Zero dependências extras de prerender** - usa apenas React DOM Server
2. **Controle total** - você define exatamente como renderiza
3. **Performance em dev** - HMR funciona tanto no cliente quanto no servidor
4. **Suportado oficialmente** - documentação do Vite
5. **Futuro-proof** - Environment API em desenvolvimento

---

## ❌ Desvantagens para Este Projeto

1. **Overhead desnecessário** - projeto é 100% estático
2. **GitHub Pages** - não suporta servidor Node.js
3. **Adaptações no código** - localStorage, useEffect, Date()
4. **Migração complexa** - vários arquivos novos
5. **Manutenção manual** - script de prerender precisa ser mantido
6. **Dados assíncronos** - lazy loading de JSONs complica SSR

---

## 📈 Matriz de Decisão Atualizada

| Critério (peso) | Vite SSR | @prerenderer | react-snap |
|-----------------|----------|--------------|------------|
| Esforço migração (25%) | 🔴 Alto | 🟢 Baixo | 🟡 Médio |
| GitHub Pages (20%) | 🔴 N/A | 🟢 Sim | 🟢 Sim |
| Manutenção (20%) | 🟡 Manual | 🟡 Plugin | 🔴 7 anos |
| Adaptações código (20%) | 🔴 Várias | 🟢 Mínimas | 🟡 Moderadas |
| Documentação (15%) | 🟢 Oficial | 🟡 Comunidade | 🟡 Comunidade |
| **Score Total** | **50/100** | **85/100** | **60/100** |

---

## 🎯 Recomendação Final

### Para Tábua de Marés: **NÃO usar Vite SSR nativo**

**Razões:**
1. O projeto já está hospedado no GitHub Pages (estático)
2. Os dados são pré-conhecidos (tabela de marés 2026)
3. O esforço de adaptação é desproporcional ao benefício
4. `@prerenderer/rollup-plugin` resolve o problema com menos mudanças

### Quando USAR Vite SSR nativo:

- Aplicações com dados dinâmicos em tempo real
- Quando você tem controle do servidor (Vercel, Railway, etc.)
- Projetos que precisam de personalização por usuário
- Quando plugins de prerender não atendem requisitos específicos

---

## 📚 Referências

- [Vite SSR Guide](https://vite.dev/guide/ssr.html)
- [Template SSR React](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Awesome Vite SSR](https://github.com/vitejs/awesome-vite#ssr)
- [Vite Environment API (futuro)](https://github.com/vitejs/vite/discussions/16358)

---

## 🆕 Análise: `@vitejs/plugin-rsc` (Exemplo SSG)

O exemplo em `vite-plugin-react/packages/plugin-rsc/examples/ssg` usa **React Server Components (RSC)**, uma tecnologia diferente do SSR tradicional.

### O que é RSC?

RSC permite dividir componentes entre servidor e cliente:
- **Server Components**: Renderizam no servidor, sem JavaScript no cliente
- **Client Components**: Têm interatividade (hooks, eventos)

### Requisitos do Exemplo SSG

| Dependência | Versão | Necessária? |
|-------------|--------|-------------|
| `vite` | ^8.0.1 | 🔴 Projeto usa v6 |
| `react` | ^19.2.4 | 🔴 Projeto usa v18 |
| `react-dom` | ^19.2.4 | 🔴 Projeto usa v18 |
| `@vitejs/plugin-rsc` | latest | 🆕 Nova dependência |
| `@mdx-js/rollup` | ^3.1.1 | 🆕 Para MDX |
| `rsc-html-stream` | ^0.0.7 | 🆕 Streaming HTML |

### Estrutura do Exemplo

```
ssg/
├── vite.config.ts          # Plugin RSC + SSG customizado
├── src/
│   ├── root.tsx            # Componente raiz + getStaticPaths()
│   └── framework/
│       ├── entry.browser.tsx   # Hydration no cliente
│       ├── entry.ssr.tsx       # SSR tradicional
│       ├── entry.rsc.tsx       # React Server Components
│       ├── request.ts          # Helpers de request
│       └── shared.ts           # Tipos compartilhados
```

### Como Funciona o SSG neste Exemplo

1. **Build cria 3 ambientes**: `rsc`, `ssr`, `client`
2. **entry.rsc.tsx** exporta `getStaticPaths()` com rotas estáticas
3. **Plugin customizado** `rscSsgPlugin()` itera as rotas e gera HTML
4. **Cada rota** gera 2 arquivos: `.html` e `.rsc` (payload serializado)

### Código do Plugin SSG (simplificado)

```typescript
function rscSsgPlugin(): Plugin[] {
  return [{
    name: 'rsc-ssg',
    buildApp: {
      async handler(builder) {
        const entry = await import('./dist/server/index.js')
        const staticPaths = await entry.getStaticPaths()
        
        for (const path of staticPaths) {
          const { html, rsc } = await entry.handleSsg(
            new Request(new URL(path, 'http://ssg.local'))
          )
          // Escreve index.html e _.rsc para cada rota
        }
      },
    },
  }]
}
```

---

## ❌ Por Que NÃO Usar para Tábua de Marés

### 1. Incompatibilidade de Versões

| Requisito | Exemplo SSG | Projeto Atual |
|-----------|-------------|---------------|
| Vite | 8.x | 6.x |
| React | 19.x | 18.x |
| React DOM | 19.x | 18.x |

**React 19 tem breaking changes** significativos e requer migração cuidadosa.

### 2. Complexidade Desproporcional

| Aspecto | Exemplo RSC SSG | Projeto Atual |
|---------|-----------------|---------------|
| Arquivos novos | ~8 | 0 |
| Conceitos novos | RSC, Streaming, Environments | Nenhum |
| Curva de aprendizado | Alta | - |
| Benefício | Server Components | Apenas HTML estático |

### 3. Tecnologia Experimental

- `@vitejs/plugin-rsc` ainda está em versão `0.5.x`
- Documentação avisa: *"Low-level API meant for library and framework authors"*
- A API ainda está em evolução

### 4. GitHub Pages

O exemplo gera arquivos `.rsc` que são payloads binários de RSC. GitHub Pages funcionaria, mas:
- Overhead desnecessário para site estático simples
- Arquivos `.rsc` não são úteis sem a infraestrutura RSC completa

---

## 📊 Comparativo Final Completo

| Critério | @prerenderer | Vite SSR | RSC SSG |
|----------|--------------|----------|---------|
| **Versão React** | 18+ ✅ | 18+ ✅ | 19+ ❌ |
| **Versão Vite** | 6+ ✅ | 6+ ✅ | 8+ ❌ |
| **Complexidade** | Baixa | Alta | Muito Alta |
| **Arquivos novos** | 0 | 5+ | 8+ |
| **GitHub Pages** | ✅ | ❌ | Parcial |
| **Maturidade** | Estável | Estável | Experimental |
| **Esforço migração** | ~30min | ~4h | ~8h+ |
| **Score** | **85/100** | 50/100 | 30/100 |

---

## ✅ Recomendação Mantida

### Para Tábua de Marés: **`@prerenderer/rollup-plugin`**

O exemplo RSC SSG do Vite é **muito avançado** para o caso de uso:
- Requer upgrade para React 19 e Vite 8
- RSC não traz benefícios para um site de dados estáticos
- Complexidade de implementação não justificada

**RSC faz sentido quando:**
- Você tem componentes pesados que não precisam de JS no cliente
- Dados são buscados no servidor em tempo real
- Quer streaming progressivo de UI

**Nenhum desses se aplica à Tábua de Marés.**

---

*Documento atualizado em: 24/03/2026*
