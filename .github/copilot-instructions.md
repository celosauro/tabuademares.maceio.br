# Copilot Instructions - Tábua de Marés

## Projeto

Aplicação React SPA para exibição de tábua de marés de Maceió/AL - 2026.

🌐 **Site:** [tabuademares.maceio.br](https://tabuademares.maceio.br)

## Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (estilização)
- Phosphor Icons (ícones: Waves, CalendarBlank, ListBullets, Info)

## Funcionalidades

- **Visualização cards/lista** - Toggle para alternar modos (persistido em localStorage)
- **Filtro de maré baixa** - Exibe apenas dias com maré muito baixa (< 0.2m)
- **Destaque do dia atual** - Card/linha destacado com borda azul
- **Navegação por mês** - Seletor de mês acessível
- **Skill Alexa** - Consulta por voz (pasta `alexa-skill/`)

## Convenções de Código

### TypeScript

- Interfaces para props e dados
- Tipos exportados em `src/types/tide.ts`
- Nomenclatura PascalCase para tipos/interfaces

### Componentes

- Functional components com arrow functions
- Props destructuring com valores default
- Componentes em arquivos separados em `src/components/`
- Barrel export via `index.ts`

**Principais componentes:**
- `DayCard` - Card de dia com marés
- `TideTable` - Visualização em lista/tabela responsiva
- `TideReading` - Leitura individual (hora + altura)
- `MonthSelector` - Select de mês + toggles de filtro/modo
- `LoadingSpinner` / `ErrorMessage` - Estados de UI

### Estilização

- Tailwind CSS utility-first
- Mobile-first (estilos base = mobile, breakpoints para desktop)
- Breakpoints: `sm:`, `md:`, `lg:`
- Paleta customizada `tide` (azul pastel baseada em `sky`)

### Tipografia Fluida

Classes CSS customizadas usando `clamp()`:
- `text-fluid-xs` → `text-fluid-2xl`
- Escala suave entre 320px e 1280px

### Cores

```
tide-50  → backgrounds claros
tide-100 → bordas sutis
tide-200 → bordas/hovers
tide-500 → cor principal (botões, badges)
tide-600 → texto médio
tide-700 → texto destaque
tide-800 → texto escuro
```

## Padrões de Layout

### Grid Responsivo

```jsx
grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4
```

### Container

```jsx
max-w-7xl mx-auto px-4
```

### Cards

- `rounded-xl` para cards grandes
- `rounded-lg` para cards menores
- `shadow-sm hover:shadow-md` para elevação
- `ring-2 ring-tide-500` para destaque

## Dados

### Estrutura JSON

```json
{
  "year": 2026,
  "month": 2,
  "monthName": "Fevereiro",
  "dias": [
    {
      "dia": 1,
      "diaSemana": "Domingo",
      "mares": [
        { "hora": "04:07", "altura": 2.23 }
      ]
    }
  ]
}
```

**Nota:** Campos em português: `dias`, `dia`, `diaSemana`, `mares`, `hora`, `altura`

### Lazy Loading

Dados carregados por mês via dynamic import:
```typescript
const data = await import(`../data/2026/${month}_2026.json`);
```

### Persistência

- `localStorage.getItem('tideViewMode')` - Modo de visualização ('cards' | 'table')

## Regras de Negócio

- Maré alta: altura ≥ 1.2m
- Maré baixa: altura < 1.2m
- Maré muito baixa: altura < 0.2m (usado no filtro)
- Dia formatado com 2 dígitos: `01`, `02`, etc.
- Dia da semana: completo + "-feira" (exceto Sábado/Domingo)
- Abreviações mobile: Seg, Ter, Qua, Qui, Sex, Sáb, Dom

## Acessibilidade

- Select nativo para seletores
- Labels associados a inputs
- `font-size: 16px` mínimo em inputs (evita zoom iOS)
- `aria-label` em ícones
- `role="switch"` e `aria-checked` em toggles
- Contraste adequado de cores

## Idioma

- Interface 100% em Português (pt-BR)
- Nomes de meses em português
- Dias da semana em português

## Alexa Skill

A pasta `alexa-skill/` contém:
- `lambda/` - Código Node.js para AWS Lambda
- `skill-package/` - Modelo de interação pt-BR
- `icons/` - Ícones para publicação (SVG fonte + PNGs)

Dados da Alexa também usam campos em português nos JSONs.
