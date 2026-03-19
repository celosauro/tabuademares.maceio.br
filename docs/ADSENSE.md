# Integração Google AdSense

Documentação para configurar e manter a integração do Google AdSense no site Tábua de Marés Maceió.

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Configuração Inicial](#configuração-inicial)
- [Criando Unidades de Anúncio](#criando-unidades-de-anúncio)
- [Configuração do Código](#configuração-do-código)
- [Arquivo ads.txt](#arquivo-adstxt)
- [Ambiente de Desenvolvimento](#ambiente-de-desenvolvimento)
- [Troubleshooting](#troubleshooting)
- [Checklist de Deploy](#checklist-de-deploy)
- [Referências](#referências)

---

## Visão Geral

O site utiliza Google AdSense para exibição de anúncios display. A integração foi implementada com foco em:

- **Performance**: Lazy loading para anúncios abaixo do fold
- **UX**: Posições não-intrusivas que não interferem no conteúdo principal
- **CLS**: Altura mínima definida para evitar layout shift
- **Desenvolvimento**: Placeholders visuais em ambiente de dev

### Posições de Anúncios

| Posição | Local | Formato | Lazy |
|---------|-------|---------|------|
| #1 | Após seletor de mês | Horizontal/Auto | Não |
| #2 | Entre "Hoje" e grid (modo cards) | Horizontal/Auto | Sim |
| #3 | Antes do footer | Horizontal/Auto | Sim |

---

## Arquitetura

```
src/
├── components/
│   └── AdBanner.tsx      # Componente reutilizável de anúncio
├── types/
│   └── adsense.d.ts      # Tipos TypeScript para window.adsbygoogle
├── App.tsx               # Inserção dos componentes AdBanner
public/
└── ads.txt               # Arquivo de vendedores autorizados
index.html                # Script do AdSense SDK
```

---

## Configuração Inicial

### Pré-requisitos

1. **Conta Google**: Email verificado
2. **Site publicado**: URL acessível publicamente (https://tabuademares.maceio.br)
3. **Conteúdo original**: Site deve ter conteúdo substancial e útil
4. **Política de privacidade**: Recomendado ter página de privacidade

### Criar Conta AdSense

1. Acesse [Google AdSense](https://www.google.com/adsense/)
2. Clique em "Começar"
3. Faça login com sua conta Google
4. Informe a URL do site: `https://tabuademares.maceio.br`
5. Selecione país e aceite os termos
6. Complete a verificação de identidade (pode levar alguns dias)

### Obter Publisher ID

Após aprovação da conta:

1. Acesse o painel do AdSense
2. Clique no ícone de engrenagem → "Informações da conta"
3. Copie o **Publisher ID** (formato: `pub-XXXXXXXXXXXXXXXX`)

---

## Criando Unidades de Anúncio

### Criar Unidade Display

1. No painel AdSense, vá em **Anúncios** → **Por unidade de anúncio** → **Anúncios display**
2. Configure:
   - **Nome**: Ex: "tabua-mares-header", "tabua-mares-mid-content"
   - **Formato**: Responsivo (recomendado)
   - **Tipo**: Horizontal para posições de banner
3. Clique em "Criar"
4. Copie o **data-ad-slot** (número de ~10 dígitos)

### Slots Recomendados

| Uso | Nome Sugerido | Tipo |
|-----|---------------|------|
| Após header | tabua-mares-header | Display Responsivo |
| Mid-content | tabua-mares-mid | Display Responsivo |
| Footer | tabua-mares-footer | Display Responsivo |

---

## Configuração do Código

### 1. Atualizar Publisher ID

Edite `src/components/AdBanner.tsx`:

```tsx
// Linha ~17 - substituir pelo seu Publisher ID
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX';
```

Por:

```tsx
const ADSENSE_CLIENT = 'ca-pub-1234567890123456'; // Seu ID real
```

### 2. Atualizar Slots de Anúncio

Edite `src/App.tsx` e substitua os valores de `slot` pelos IDs das suas unidades de anúncio:

```tsx
<AdBanner slot="1234567890" format="auto" />  // Seu slot real
```

### 3. Atualizar index.html (se necessário)

O script do AdSense já está incluído em `index.html`. Após obter seu Publisher ID, verifique se está correto:

```html
<script 
  async 
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossorigin="anonymous">
</script>
```

---

## Arquivo ads.txt

O arquivo `public/ads.txt` é **obrigatório** para verificação de propriedade. Após obter seu Publisher ID:

1. Edite `public/ads.txt`
2. Substitua `pub-XXXXXXXXXXXXXXXX` pelo seu ID:

```
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

3. Verifique que o arquivo está acessível em:
   - `https://tabuademares.maceio.br/ads.txt`

---

## Ambiente de Desenvolvimento

Em ambiente de desenvolvimento (`npm run dev`), os anúncios são substituídos por **placeholders visuais** que mostram:

- Slot ID do anúncio
- Formato configurado
- Borda tracejada indicando a área

Isso evita:
- Cliques acidentais em anúncios reais
- Violação de políticas do Google (cliques em ambiente de teste)
- Carregamento desnecessário do SDK

Para testar anúncios reais, use:
```bash
npm run build && npm run preview
```

---

## Troubleshooting

### Anúncios não aparecem

| Problema | Causa | Solução |
|----------|-------|---------|
| Área em branco | Conta não aprovada | Aguardar aprovação do Google |
| Área em branco | ads.txt incorreto | Verificar Publisher ID no arquivo |
| Console: "adsbygoogle.push" | Script não carregou | Verificar bloqueador de anúncios |
| Anúncio muito pequeno | Espaço insuficiente | Verificar container tem largura adequada |

### Erros comuns no console

```
adsbygoogle.push() error: No slot size for availableWidth=0
```
**Solução**: O container está com `display: none` ou largura zero. Verifique CSS.

```
adsbygoogle.push() error: adsbygoogle is not defined
```
**Solução**: Script do AdSense não carregou. Verifique se não está bloqueado.

### Verificar ads.txt

Acesse diretamente no navegador:
```
https://tabuademares.maceio.br/ads.txt
```

Deve retornar o conteúdo do arquivo sem formatação HTML.

---

## Checklist de Deploy

Antes de publicar alterações relacionadas ao AdSense:

- [ ] Publisher ID atualizado em `AdBanner.tsx`
- [ ] Publisher ID atualizado em `index.html`
- [ ] Publisher ID atualizado em `public/ads.txt`
- [ ] Slots de anúncio configurados em `App.tsx`
- [ ] Build passa sem erros: `npm run build`
- [ ] Testar em preview: `npm run preview`
- [ ] Lighthouse Performance ≥ 90 mobile
- [ ] CLS < 0.1 (Core Web Vitals)
- [ ] ads.txt acessível após deploy
- [ ] Verificar no painel AdSense se site está aprovado

---

## Referências

- [Centro de Ajuda AdSense](https://support.google.com/adsense)
- [Políticas do Programa AdSense](https://support.google.com/adsense/answer/48182)
- [Specifications ads.txt](https://iabtechlab.com/ads-txt/)
- [Web Vitals - CLS](https://web.dev/cls/)
- [AdSense Best Practices](https://support.google.com/adsense/answer/1282097)

---

## Histórico de Alterações

| Data | Alteração |
|------|-----------|
| 2026-03-19 | Integração inicial do AdSense |
