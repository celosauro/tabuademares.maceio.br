# Validação de SEO - Tábua de Marés Maceió

Guia para validar e monitorar a otimização de SEO implementada.

## 1. Pré-Deploy: Validação Local

### Lighthouse (Chrome DevTools)

1. Abra o site em http://localhost:5173/
2. Abra DevTools (F12 ou Cmd+Option+I)
3. Vá para aba **Lighthouse**
4. Selecione categoria **SEO**
5. Clique em **Analyze page load**

**Meta esperada:** Score ≥ 90

### Verificar Meta Tags

No navegador, visualize o código-fonte (Cmd+U ou Ctrl+U) e confirme:

- [ ] `<title>` contém "Tábua de Marés Maceió 2026"
- [ ] `<meta name="description">` presente e descritiva
- [ ] `<link rel="canonical">` apontando para https://tabuademares.maceio.br/
- [ ] Tags Open Graph (`og:title`, `og:description`, `og:image`)
- [ ] Tags Twitter Cards (`twitter:card`, `twitter:title`, `twitter:image`)
- [ ] JSON-LD Structured Data (WebSite e WebApplication)

### Verificar Arquivos Estáticos

Acesse diretamente no navegador:

- http://localhost:5173/robots.txt
- http://localhost:5173/sitemap.xml
- http://localhost:5173/og-image.png
- http://localhost:5173/favicon.svg

---

## 2. Pós-Deploy: Ferramentas de Validação

Após publicar em https://tabuademares.maceio.br/, use estas ferramentas:

### Open Graph Debugger

Valida como o site aparece quando compartilhado em redes sociais.

- **URL:** https://opengraph.xyz
- **Inserir:** `https://tabuademares.maceio.br/`

**Verificar:**
- Imagem de preview (og-image.png) aparece corretamente
- Título e descrição estão corretos
- Dimensões da imagem: 1200x630

### Facebook Sharing Debugger

- **URL:** https://developers.facebook.com/tools/debug/
- **Inserir:** `https://tabuademares.maceio.br/`
- Clique em **Scrape Again** para limpar cache do Facebook

### Twitter Card Validator

- **URL:** https://cards-dev.twitter.com/validator
- **Inserir:** `https://tabuademares.maceio.br/`

### Rich Results Test (Structured Data)

Valida se o Google reconhece os dados estruturados JSON-LD.

- **URL:** https://search.google.com/test/rich-results
- **Inserir:** `https://tabuademares.maceio.br/`

**Esperado:**
- Schema `WebSite` detectado
- Schema `WebApplication` detectado
- Sem erros críticos

### Schema Markup Validator

Validação detalhada do Schema.org:

- **URL:** https://validator.schema.org/
- **Inserir:** `https://tabuademares.maceio.br/`

---

## 3. Google Search Console

### Configuração Inicial

1. Acesse https://search.google.com/search-console
2. Clique em **Adicionar propriedade**
3. Escolha **Domínio** e insira: `tabuademares.maceio.br`
4. Verifique via registro DNS (recomendado) ou arquivo HTML

### Submeter Sitemap

1. No Search Console, vá para **Sitemaps** no menu lateral
2. Insira: `sitemap.xml`
3. Clique em **Enviar**

### Solicitar Indexação

1. Vá para **Inspeção de URL**
2. Insira: `https://tabuademares.maceio.br/`
3. Clique em **Solicitar indexação**

### Métricas para Monitorar

| Métrica | Onde encontrar | Meta |
|---------|----------------|------|
| Páginas indexadas | Cobertura > Válidas | 1+ |
| Erros de cobertura | Cobertura > Erros | 0 |
| Impressões | Desempenho | Crescimento |
| Cliques | Desempenho | Crescimento |
| CTR | Desempenho | > 5% |
| Posição média | Desempenho | < 10 |

---

## 4. Monitoramento Contínuo

### Verificar Indexação (1-2 semanas após deploy)

Busque no Google:
```
site:tabuademares.maceio.br
```

**Esperado:** A página principal deve aparecer nos resultados.

### Buscar por Keywords Alvo

Teste as buscas principais (modo anônimo/privado):

1. `tábua de marés maceió`
2. `maré maceió 2026`
3. `horário maré alagoas`
4. `preamar baixa-mar maceió`

**Anotar posição inicial** para comparar evolução.

### Google Alerts (Opcional)

Configure alertas para monitorar menções:

- **URL:** https://www.google.com/alerts
- **Termo:** `tabuademares.maceio.br`

---

## 5. Otimizações Futuras (Backlog)

### Alta Prioridade

- [ ] **Prerendering/SSG** - Migrar para Astro ou implementar vite-ssg para HTML estático com conteúdo
- [ ] **Page Speed** - Otimizar Core Web Vitals (LCP, FID, CLS)
- [ ] **Backlinks** - Buscar links de sites de pesca, turismo e surf de Alagoas

### Média Prioridade

- [ ] **Blog/Conteúdo** - Criar páginas com dicas de pesca, melhores horários para banho
- [ ] **Dados estruturados FAQ** - Adicionar schema FAQPage com perguntas comuns
- [ ] **Múltiplas páginas** - Criar URLs por mês: `/janeiro`, `/fevereiro`, etc.

### Baixa Prioridade

- [ ] **PWA completo** - manifest.json, service worker, instalável
- [ ] **AMP** - Versão AMP para mobile (menos relevante hoje)
- [ ] **Hreflang** - Se houver versão em outros idiomas

---

## 6. Checklist Resumido

### Antes do Deploy

- [ ] Build sem erros: `npm run build`
- [ ] Lighthouse SEO ≥ 90
- [ ] Meta tags presentes no HTML
- [ ] robots.txt e sitemap.xml acessíveis
- [ ] og-image.png renderizando corretamente

### Após o Deploy

- [ ] opengraph.xyz mostra preview correto
- [ ] Rich Results Test sem erros
- [ ] Search Console configurado
- [ ] Sitemap submetido
- [ ] Indexação solicitada

### Após 2 Semanas

- [ ] `site:tabuademares.maceio.br` retorna resultados
- [ ] Impressões aparecendo no Search Console
- [ ] Posição média registrada para keywords alvo

---

## Recursos Úteis

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org](https://schema.org/)
- [Web.dev - SEO](https://web.dev/learn/seo/)
- [Ahrefs Free SEO Tools](https://ahrefs.com/free-seo-tools)
