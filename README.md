# Tábua de Marés - Maceió 2026

Aplicação web para consulta de tábua de marés de Maceió, Alagoas, referente ao ano de 2026.

## 🌊 Visão Geral

Uma Single Page Application (SPA) desenvolvida com React e TypeScript que exibe informações de marés de forma clara e acessível, com design responsivo e mobile-first.

## 🚀 Tecnologias

- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilização utility-first
- **Phosphor Icons** - Biblioteca de ícones

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🎨 Design

### Paleta de Cores

Utiliza tons pastel de azul (paleta `tide` baseada em `sky`):

- `tide-50` a `tide-900` - Escala completa de azuis
- Gradiente de fundo: `from-tide-50 to-tide-100`

### Tipografia Fluida

Sistema de tipografia responsiva usando `clamp()`:

| Classe | Tamanho |
|--------|---------|
| `text-fluid-xs` | 10-12px |
| `text-fluid-sm` | 12-14px |
| `text-fluid-base` | 14-16px |
| `text-fluid-lg` | 16-18px |
| `text-fluid-xl` | 18-20px |
| `text-fluid-2xl` | 20-24px |

### Layout

- **Mobile-first**: Design otimizado para dispositivos móveis
- **Grid responsivo**: 2 → 3 → 4 → 5 colunas conforme tamanho da tela
- **Largura máxima**: `max-w-7xl` (1280px)

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── DayCard.tsx        # Card de dia com marés
│   ├── TideReading.tsx    # Leitura individual de maré
│   ├── MonthSelector.tsx  # Select de mês acessível
│   ├── LoadingSpinner.tsx # Estado de carregamento
│   ├── ErrorMessage.tsx   # Mensagem de erro
│   └── index.ts           # Barrel export
├── hooks/
│   └── useTideData.ts     # Hook para lazy loading dos dados
├── types/
│   └── tide.ts            # Interfaces TypeScript
├── utils/
│   └── tideHelpers.ts     # Funções utilitárias
├── data/
│   └── 2026/              # JSONs de marés por mês
├── App.tsx                # Componente principal
├── main.tsx               # Entry point
└── index.css              # Estilos globais e tipografia fluida
```

## 🧩 Componentes

### DayCard

Exibe informações de um dia com suas marés.

**Props:**
- `day: DayData` - Dados do dia
- `year: number` - Ano
- `month: number` - Mês
- `isHighlighted?: boolean` - Destaque visual
- `compact?: boolean` - Modo compacto (não utilizado atualmente)

### TideReading

Exibe uma leitura de maré (hora e altura).

**Props:**
- `tide: TideReading` - Dados da maré
- `compact?: boolean` - Modo compacto
- `index?: number` - Índice para cores zebradas

### MonthSelector

Select nativo acessível para escolha do mês.

**Props:**
- `selectedMonth: MonthKey` - Mês selecionado
- `onMonthChange: (month: MonthKey) => void` - Callback de mudança

## ♿ Acessibilidade

- Select nativo com label associado
- Contraste de cores adequado
- Fonte mínima de 16px em inputs (evita zoom no iOS)
- Ícones com `aria-label`
- Estrutura semântica com headings

## 📊 Dados

Os dados de marés são carregados via lazy loading (code splitting) por mês:

- Arquivos JSON em `src/data/2026/`
- Nomenclatura: `january_2026.json`, `february_2026.json`, etc.
- Threshold para maré alta: ≥ 1.2m

## 🔧 Scripts

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Linting
```

## 📄 Licença

MIT © 2026
