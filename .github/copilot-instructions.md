# Copilot Instructions - Tábua de Marés

## Projeto

Aplicação React SPA para exibição de tábua de marés de Maceió/AL - 2026.

## Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (estilização)
- Phosphor Icons (ícones)

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
  "days": [
    {
      "day": 1,
      "weekDay": "Domingo",
      "tides": [
        { "time": "04:07", "height": 2.23 }
      ]
    }
  ]
}
```

### Lazy Loading

Dados carregados por mês via dynamic import:
```typescript
const data = await import(`../data/2026/${month}_2026.json`);
```

## Regras de Negócio

- Maré alta: altura ≥ 1.2m
- Maré baixa: altura < 1.2m
- Dia formatado com 2 dígitos: `01`, `02`, etc.
- Dia da semana: completo + "-feira" (exceto Sábado/Domingo)

## Acessibilidade

- Select nativo para seletores
- Labels associados a inputs
- `font-size: 16px` mínimo em inputs (evita zoom iOS)
- `aria-label` em ícones
- Contraste adequado de cores

## Idioma

- Interface 100% em Português (pt-BR)
- Nomes de meses em português
- Dias da semana em português
