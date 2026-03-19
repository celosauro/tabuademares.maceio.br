---
description: "Documenta alterações de código com changelog e decisões de design. Use para registrar modificações, justificativas e impacto."
agent: "agent"
argument-hint: "Descreva brevemente a alteração feita..."
tools: ["editFiles"]
---

Siga as convenções do projeto em [copilot-instructions.md](./.github/copilot-instructions.md).

Documente a alteração no código selecionado seguindo este formato:

## Contexto
Analise o código selecionado e identifique:
- O que o código faz (funcionalidade)
- Qual componente/módulo afetado

## Changelog

Gere uma entrada de changelog no formato:

```markdown
### [Tipo] Descrição breve

**Componente:** Nome do componente/arquivo
**Data:** {{data atual}}

#### O que mudou
- Descreva as alterações específicas

#### Por que mudou
- Justificativa técnica ou de negócio

#### Impacto
- Efeitos em outras partes do código
- Breaking changes (se houver)
```

**Tipos válidos:**
- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `refactor` - Refatoração sem mudança de comportamento
- `style` - Formatação, CSS, UI
- `perf` - Melhoria de performance
- `docs` - Documentação
- `chore` - Manutenção

## Integração com CHANGELOG.md

Após gerar a entrada, adicione-a ao arquivo `CHANGELOG.md` na raiz do projeto:
- Se o arquivo não existir, crie-o com cabeçalho `# Changelog`
- Insira a nova entrada no topo, abaixo do cabeçalho
- Mantenha as entradas anteriores intactas

## Diretrizes

1. Use português (pt-BR)
2. Seja conciso mas completo
3. Mencione arquivos relacionados quando relevante
4. Se o argumento do usuário fornecer contexto adicional, incorpore na documentação
5. Sempre atualize o CHANGELOG.md com a nova entrada
