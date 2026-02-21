# Prompt: Otimização SEO para React SPA (Vite + TypeScript)

Use este prompt em projetos React SPA com Vite para implementar otimização de SEO completa.

---

## Prompt para Assistente de IA

```
Implemente otimização de SEO completa para esta aplicação React SPA com Vite. Siga estas etapas:

## 1. Atualizar index.html com Meta Tags SEO

Adicione ao <head> do index.html:

### Meta Tags Básicas
- <title> otimizado com palavras-chave principais (máx 60 caracteres)
- <meta name="description"> descritiva (máx 160 caracteres)
- <meta name="keywords"> com 5-10 palavras-chave relevantes
- <meta name="author">
- <meta name="robots" content="index, follow">
- <link rel="canonical" href="URL_CANONICA">

### Geo Tags (se aplicável)
- <meta name="geo.region" content="BR-UF">
- <meta name="geo.placename" content="CIDADE">

### Open Graph (Facebook/LinkedIn)
- <meta property="og:type" content="website">
- <meta property="og:url" content="URL">
- <meta property="og:title" content="TITULO">
- <meta property="og:description" content="DESCRICAO">
- <meta property="og:image" content="URL/og-image.png">
- <meta property="og:image:width" content="1200">
- <meta property="og:image:height" content="630">
- <meta property="og:locale" content="pt_BR">
- <meta property="og:site_name" content="NOME_SITE">

### Twitter Cards
- <meta name="twitter:card" content="summary_large_image">
- <meta name="twitter:title" content="TITULO">
- <meta name="twitter:description" content="DESCRICAO">
- <meta name="twitter:image" content="URL/og-image.png">

### Theme Color
- <meta name="theme-color" content="COR_PRIMARIA">
- <meta name="msapplication-TileColor" content="COR_PRIMARIA">

### Favicons
- <link rel="icon" type="image/svg+xml" href="/favicon.svg">
- <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
- <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

### Structured Data (JSON-LD)

Adicione schema WebSite:
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "NOME_DO_SITE",
  "url": "URL_DO_SITE",
  "description": "DESCRICAO",
  "inLanguage": "pt-BR"
}
</script>

Adicione schema WebApplication (se for uma ferramenta/app):
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "NOME_APP",
  "url": "URL",
  "description": "DESCRICAO",
  "applicationCategory": "CATEGORIA",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "BRL"
  }
}
</script>

### Fallback para Crawlers (noscript)

Adicione ao <body> conteúdo estático para crawlers que não executam JavaScript:
<noscript>
  <div>
    <h1>TITULO_PRINCIPAL</h1>
    <p>DESCRICAO_DO_SITE</p>
    <h2>Recursos</h2>
    <ul>
      <li>RECURSO_1</li>
      <li>RECURSO_2</li>
    </ul>
    <p><strong>Ative o JavaScript para usar a aplicação.</strong></p>
  </div>
</noscript>

## 2. Criar Arquivos SEO em public/

### robots.txt
User-agent: *
Allow: /
Sitemap: URL_DO_SITE/sitemap.xml

### sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>URL_PRINCIPAL</loc>
    <lastmod>DATA_ATUALIZACAO</lastmod>
    <changefreq>FREQUENCIA</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>

### 404.html
Criar página de erro amigável com:
- Design consistente com a aplicação
- Mensagem clara de página não encontrada
- Link para página inicial
- Meta refresh para redirecionar após alguns segundos
- <meta name="robots" content="noindex">

## 3. Criar Imagens OG e Favicons

### og-image.svg (1200x630)
Criar SVG com:
- Gradiente de fundo usando cores do brand
- Logo/ícone centralizado
- Título principal em fonte bold
- Subtítulo/tagline
- URL do site no rodapé

Converter para PNG:
rsvg-convert -w 1200 -h 630 og-image.svg -o og-image.png

### favicon.svg (32x32)
Criar versão simplificada do logo para favicon.

Converter para PNGs:
rsvg-convert -w 32 -h 32 favicon.svg -o favicon-32x32.png
rsvg-convert -w 180 -h 180 favicon.svg -o apple-touch-icon.png

## 4. Otimizar Componentes React

### Texto Contextual
Adicionar parágrafo introdutório visível com palavras-chave:
<p className="text-sm text-gray-500 text-center mb-6 max-w-2xl mx-auto">
  DESCRICAO_COM_KEYWORDS
</p>

### Footer com Créditos
<footer>
  <p>Fonte dos dados / Créditos</p>
  <p>© ANO NOME_DO_SITE</p>
</footer>

### Estrutura de Headings
- Garantir único <h1> com keyword principal
- <h2> para seções principais
- Hierarquia correta sem pular níveis

## 5. Verificação

Após implementar, verificar:
1. npm run build sem erros
2. Lighthouse SEO score ≥ 90
3. View source mostra meta tags
4. Arquivos acessíveis: /robots.txt, /sitemap.xml, /og-image.png
```

---

## Variáveis para Substituir

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `URL_CANONICA` | URL principal do site | `https://meusite.com.br/` |
| `URL` | URL do site | `https://meusite.com.br` |
| `TITULO` | Título otimizado (máx 60 chars) | `Meu App - Descrição Curta` |
| `DESCRICAO` | Meta description (máx 160 chars) | `Descrição do que o site faz...` |
| `NOME_SITE` | Nome do site/aplicação | `Meu App` |
| `COR_PRIMARIA` | Cor hex do brand | `#0ea5e9` |
| `CATEGORIA` | Schema applicationCategory | `UtilitiesApplication` |
| `DATA_ATUALIZACAO` | Data ISO do sitemap | `2026-01-01` |
| `FREQUENCIA` | changefreq do sitemap | `yearly`, `monthly`, `daily` |

---

## Estrutura de Arquivos Resultante

```
public/
├── 404.html
├── apple-touch-icon.png    (180x180)
├── favicon.svg
├── favicon-32x32.png       (32x32)
├── og-image.svg
├── og-image.png            (1200x630)
├── robots.txt
└── sitemap.xml

index.html                   (com meta tags SEO)
src/
└── App.tsx                  (com texto contextual e footer)
```

---

## Comandos Úteis

### Converter SVG para PNG (macOS)

```bash
# Instalar librsvg
brew install librsvg

# Converter og-image
rsvg-convert -w 1200 -h 630 public/og-image.svg -o public/og-image.png

# Converter favicons
rsvg-convert -w 32 -h 32 public/favicon.svg -o public/favicon-32x32.png
rsvg-convert -w 180 -h 180 public/favicon.svg -o public/apple-touch-icon.png
```

### Validar Build

```bash
npm run build
# Verificar que dist/ contém todos os arquivos
ls -la dist/
```

---

## Ferramentas de Validação

| Ferramenta | URL | Propósito |
|------------|-----|-----------|
| Lighthouse | Chrome DevTools | Score SEO geral |
| opengraph.xyz | https://opengraph.xyz | Preview Open Graph |
| Rich Results Test | https://search.google.com/test/rich-results | Validar JSON-LD |
| Schema Validator | https://validator.schema.org | Validar Schema.org |
| Facebook Debugger | https://developers.facebook.com/tools/debug/ | Cache Facebook |
| Twitter Validator | https://cards-dev.twitter.com/validator | Preview Twitter |

---

## Checklist de Implementação

### index.html
- [ ] `<html lang="pt-BR">`
- [ ] `<title>` otimizado
- [ ] `<meta name="description">`
- [ ] `<meta name="keywords">`
- [ ] `<link rel="canonical">`
- [ ] Open Graph tags (6 tags mínimo)
- [ ] Twitter Cards tags (4 tags mínimo)
- [ ] `<meta name="theme-color">`
- [ ] Favicons (svg + png + apple-touch)
- [ ] JSON-LD WebSite
- [ ] JSON-LD WebApplication (se aplicável)
- [ ] `<noscript>` com conteúdo

### public/
- [ ] robots.txt
- [ ] sitemap.xml
- [ ] og-image.png (1200x630)
- [ ] favicon.svg
- [ ] favicon-32x32.png
- [ ] apple-touch-icon.png (180x180)
- [ ] 404.html

### Componentes
- [ ] Texto introdutório com keywords
- [ ] Footer com créditos
- [ ] Único `<h1>` com keyword principal
- [ ] Hierarquia correta de headings

### Validação
- [ ] Build sem erros
- [ ] Lighthouse SEO ≥ 90
- [ ] Meta tags visíveis no view-source
- [ ] Arquivos estáticos acessíveis
