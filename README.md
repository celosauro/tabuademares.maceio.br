# Tábua de Marés - Maceió 2026

Aplicação web para consulta de tábua de marés de Maceió, Alagoas, referente ao ano de 2026.

🌐 **Acesse:** [tabuademares.maceio.br](https://tabuademares.maceio.br)

## 🌊 Visão Geral

Uma Single Page Application (SPA) desenvolvida com React e TypeScript que exibe informações de marés de forma clara e acessível, com design responsivo e mobile-first.

### Funcionalidades

- **Visualização por cards ou lista** - Alterne entre modos de visualização com persistência em localStorage
- **Filtro de maré baixa** - Exibe apenas dias com maré muito baixa (altura < 0.2m)
- **Destaque do dia atual** - O dia de hoje é destacado automaticamente
- **Navegação por mês** - Seletor de mês acessível
- **Design responsivo** - Mobile-first com breakpoints para tablet e desktop
- **Skill Alexa** - Consulte as marés por comando de voz

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
│   ├── TideTable.tsx      # Visualização em lista/tabela
│   ├── TideReading.tsx    # Leitura individual de maré
│   ├── MonthSelector.tsx  # Select de mês + toggles de filtro
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
alexa-skill/               # Skill Alexa (ver README próprio)
```

## 🧩 Componentes

### DayCard

Exibe informações de um dia com suas marés em formato de card.

**Props:**
- `day: DayData` - Dados do dia
- `year: number` - Ano
- `month: number` - Mês
- `isHighlighted?: boolean` - Destaque visual (dia atual)

### TideTable

Exibe as marés em formato de lista/tabela responsiva.

**Props:**
- `days: DayData[]` - Array de dias
- `year: number` - Ano
- `month: number` - Mês

**Características:**
- Linha do dia atual destacada com borda azul
- Hover em toda a linha
- Abreviações de dia da semana no mobile

### TideReading

Exibe uma leitura de maré (hora e altura).

**Props:**
- `tide: TideReading` - Dados da maré
- `compact?: boolean` - Modo compacto
- `index?: number` - Índice para cores zebradas

### MonthSelector

Select nativo acessível para escolha do mês com toggles de filtro.

**Props:**
- `selectedMonth: MonthKey` - Mês selecionado
- `onMonthChange: (month: MonthKey) => void` - Callback de mudança
- `filterLowTide?: boolean` - Estado do filtro de maré baixa
- `onFilterChange?: (value: boolean) => void` - Callback do filtro
- `viewMode?: 'cards' | 'table'` - Modo de visualização
- `onViewModeChange?: (mode: 'cards' | 'table') => void` - Callback de modo

**Características:**
- Toggle para filtrar marés muito baixas (< 0.2m)
- Toggle para alternar entre visualização cards/lista
- Info block exibido quando filtro está ativo
- Layout responsivo (vertical no mobile, horizontal no desktop)

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
- Threshold para maré muito baixa: < 0.2m

### Estrutura do JSON

```json
{
  "year": 2026,
  "month": 1,
  "monthName": "Janeiro",
  "dias": [
    {
      "dia": 1,
      "diaSemana": "Quinta-feira",
      "mares": [
        { "hora": "04:07", "altura": 2.23 },
        { "hora": "10:15", "altura": 0.45 }
      ]
    }
  ]
}
```

## 💾 Persistência

- **Modo de visualização**: salvo em `localStorage` com chave `tideViewMode`
- Valor padrão: `cards`

## 🔧 Scripts

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Linting
```

## � Integração com Alexa

Este projeto inclui uma skill Alexa para consulta de marés por voz. Veja [alexa-skill/README.md](alexa-skill/README.md) para instruções de publicação.

**Comandos de exemplo:**
- "Alexa, abrir tábua de marés"
- "Qual a maré de hoje?"
- "Quando é a maré alta?"

## �📄 Licença

MIT © 2026
