# Análise de Soluções de Pré-Renderização para AdSense

## 📋 Contexto do Problema

O site **Tábua de Marés Maceió** é uma SPA React com Vite. O HTML inicial enviado ao Google contém apenas:

```html
<div id="root"></div>
```

**Problemas com AdSense:**
- Rejeição por "conteúdo insuficiente"
- Anúncios exibidos em páginas "vazias" (violação de políticas)
- Dificuldade do Google em contextualizar anúncios
- Possível impacto negativo no SEO

---

## 🔍 Situação Atual do Projeto

| Item | Valor |
|------|-------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 6 |
| Dependência Atual | `vite-plugin-prerender` v1.0.8 |
| Deploy | GitHub Pages (estático) |
| Rotas | Single Page (`/`) |

### Problema com `vite-plugin-prerender`

O plugin instalado apresenta **incompatibilidade com Vite 6 + ESM**:

```
ReferenceError: require is not defined in ES module scope
```

**Causa:** Plugin não é mantido há 4 anos e usa sintaxe CommonJS internamente.

---

## 📊 Comparativo de Soluções

### 1. `@prerenderer/rollup-plugin` ⭐ RECOMENDADO

| Métrica | Valor |
|---------|-------|
| Downloads semanais | ~5.849 |
| Última publicação | 2 anos |
| Compatível com Vite 6 | ✅ Sim |
| Mudanças no código | Mínimas |
| Dependência extra | Puppeteer ou JSDOM |

#### Instalação
```bash
npm uninstall vite-plugin-prerender
npm install -D @prerenderer/rollup-plugin @prerenderer/renderer-puppeteer
```

#### Configuração (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'

export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: ['/'],
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterDocumentEvent: 'prerender-ready',
      },
      postProcess(renderedRoute) {
        // Remove http://localhost URLs do HTML
        renderedRoute.html = renderedRoute.html.replace(
          /http:\/\/localhost:\d+/g,
          'https://tabuademares.maceio.br'
        )
        return renderedRoute
      },
    }),
  ],
})
```

#### Alterações no `App.tsx`
```typescript
// Já implementado - dispara evento quando dados carregam
useEffect(() => {
  if (data && !isLoading) {
    document.dispatchEvent(new Event('prerender-ready'));
  }
}, [data, isLoading]);
```

#### Vantagens
- ✅ Plugin mantido ativamente
- ✅ API similar ao atual (fácil migração)
- ✅ Suporte a Vite 6 + ESM
- ✅ Funciona com Puppeteer (mais confiável) ou JSDOM (mais leve)
- ✅ Minificação de HTML integrada
- ✅ Post-processing de rotas

#### Desvantagens
- ❌ Puppeteer adiciona ~300MB ao node_modules
- ❌ Build mais lento (~15-30s extra)
- ❌ Pode ter problemas em CI/CD sem Chrome instalado

---

### 2. `react-snap`

| Métrica | Valor |
|---------|-------|
| Downloads semanais | ~41.410 (mais popular!) |
| Última publicação | 7 anos |
| Compatível com Vite | ✅ Parcial |
| Mudanças no código | Moderadas |
| Dependência extra | Puppeteer |

#### Instalação
```bash
npm uninstall vite-plugin-prerender
npm install -D react-snap
```

#### Configuração (`package.json`)
```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "postbuild": "react-snap"
  },
  "reactSnap": {
    "source": "dist",
    "skipThirdPartyRequests": true,
    "puppeteerArgs": ["--no-sandbox"]
  }
}
```

#### Alterações no `main.tsx`
```typescript
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')!

if (rootElement.hasChildNodes()) {
  // Página pré-renderizada - fazer hydration
  hydrateRoot(rootElement, <App />)
} else {
  // Desenvolvimento - render normal
  createRoot(rootElement).render(<App />)
}
```

#### Vantagens
- ✅ Mais downloads (comunidade maior)
- ✅ Zero configuração no Vite
- ✅ Funciona com qualquer bundler
- ✅ Inline CSS crítico (opcional)
- ✅ Crawl automático de links

#### Desvantagens
- ❌ **Não mantido há 7 anos** (risco de segurança)
- ❌ Requer mudança no `main.tsx` (hydration)
- ❌ Problemas conhecidos com React 18 Strict Mode
- ❌ Dependência de Puppeteer antiga

---

### 3. `vite-ssg` (apenas Vue)

| Métrica | Valor |
|---------|-------|
| Downloads semanais | ~28.764 |
| Última publicação | 2 meses |
| Compatível com React | ❌ **NÃO** |

**Descartado:** Plugin exclusivo para Vue.js.

---

### 4. Migração para Next.js

| Métrica | Valor |
|---------|-------|
| Popularidade | Muito Alta |
| Mudanças no código | Extensas |
| Tempo estimado | 4-8 horas |

#### O que seria necessário

1. **Criar estrutura Next.js**
```bash
npx create-next-app@latest --typescript
```

2. **Migrar componentes** para `app/` ou `pages/`

3. **Configurar Static Export** (`next.config.js`)
```javascript
module.exports = {
  output: 'export',
  images: { unoptimized: true }
}
```

4. **Adaptar data fetching** para `getStaticProps`

#### Vantagens
- ✅ Framework mais popular para React
- ✅ SSG nativo e bem documentado
- ✅ Excelente SEO out-of-the-box
- ✅ Image/Font optimization
- ✅ Manutenção ativa (Vercel)

#### Desvantagens
- ❌ Migração completa do projeto
- ❌ Build mais lento que Vite
- ❌ Estrutura de arquivos diferente
- ❌ Overhead desnecessário para 1 página

---

## 📈 Matriz de Decisão

| Critério (peso) | @prerenderer | react-snap | Next.js |
|-----------------|--------------|------------|---------|
| Esforço de migração (25%) | 🟢 Baixo | 🟡 Médio | 🔴 Alto |
| Manutenção do pacote (25%) | 🟡 2 anos | 🔴 7 anos | 🟢 Ativo |
| Compatibilidade Vite 6 (20%) | 🟢 Sim | 🟡 Parcial | N/A |
| Performance de build (15%) | 🟡 +15-30s | 🟡 +15-30s | 🔴 +60s |
| Confiabilidade (15%) | 🟢 Alta | 🟡 Média | 🟢 Alta |
| **Score Total** | **85/100** | **60/100** | **70/100** |

---

## ✅ Recomendação Final

### Para este projeto: **`@prerenderer/rollup-plugin`**

**Razões:**
1. Menor esforço de migração (config similar ao atual)
2. Mantido mais recentemente que react-snap
3. Testado com Vite moderno
4. Não requer mudanças no React code (já temos o evento `prerender-ready`)
5. Deploy estático compatível com GitHub Pages

---

## 📁 Arquivos que Serão Alterados

### 1. `package.json`
- Remover: `vite-plugin-prerender`
- Adicionar: `@prerenderer/rollup-plugin`, `@prerenderer/renderer-puppeteer`

### 2. `vite.config.ts`
- Trocar import do plugin
- Ajustar configuração do renderer

### 3. `src/App.tsx`
- **Nenhuma alteração** (evento já implementado)

---

## ⚠️ Considerações para CI/CD

Se usar GitHub Actions, adicionar ao workflow:

```yaml
- name: Install Chrome dependencies
  run: |
    sudo apt-get update
    sudo apt-get install -y chromium-browser
```

Ou usar renderer JSDOM (mais leve, mas menos confiável):

```bash
npm install -D @prerenderer/renderer-jsdom
```

---

## 🧪 Como Validar Após Implementação

1. **Build local:**
   ```bash
   npm run build
   ```

2. **Verificar HTML gerado:**
   ```bash
   cat dist/index.html | grep -o '<main.*</main>' | head -c 500
   ```

3. **Testar com preview:**
   ```bash
   npm run preview
   ```

4. **Validar com Lighthouse:**
   - Performance
   - SEO
   - Best Practices

5. **Testar crawler do Google:**
   - Google Search Console → URL Inspection → Test Live URL

---

## 📝 Próximos Passos (após aprovação)

1. [ ] Remover `vite-plugin-prerender`
2. [ ] Instalar `@prerenderer/rollup-plugin` + renderer
3. [ ] Atualizar `vite.config.ts`
4. [ ] Executar build e validar HTML
5. [ ] Iniciar preview server
6. [ ] Executar Lighthouse
7. [ ] Commit e push

---

*Documento gerado em: 24/03/2026*
