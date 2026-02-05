# Alexa Skill - Tábua de Marés Maceió

Skill para consulta de horários e alturas das marés em Maceió, Alagoas.

## Estrutura do Projeto

```
alexa-skill/
├── lambda.zip                # Pacote pronto para deploy na AWS Lambda
├── icons/
│   ├── icon.svg              # Ícone fonte (SVG)
│   ├── icon-108x108.png      # Ícone pequeno (obrigatório)
│   └── icon-512x512.png      # Ícone grande (obrigatório)
├── lambda/
│   ├── index.js              # Handler principal da skill
│   ├── package.json          # Dependências Node.js
│   └── data/2026/            # Dados de marés (JSON)
└── skill-package/
    ├── skill.json            # Manifesto da skill
    └── interactionModels/
        └── custom/
            └── pt-BR.json    # Modelo de interação (português)
```

## Comandos de Voz Disponíveis

### Marés do dia (GetTodayTidesIntent)

| Comando | Exemplo |
|---------|---------|
| Comando simples | "Alexa, maré" |
| Pergunta direta | "Alexa, qual a maré de hoje?" |
| Coloquial | "Alexa, como tá a maré?" |
| Com local | "Alexa, maré maceió" |
| Tábua | "Alexa, tábua de marés" |

### Marés por data (GetTidesByDateIntent)

| Comando | Exemplo |
|---------|---------|
| Amanhã | "Alexa, maré amanhã" |
| Data específica | "Alexa, maré para sexta-feira" |
| Pergunta | "Alexa, qual a maré de sábado?" |

### Maré Alta (GetHighTideIntent)

| Comando | Exemplo |
|---------|---------|
| Simples | "Alexa, maré alta" |
| Sinônimo | "Alexa, maré cheia" |
| Termo náutico | "Alexa, preamar" |
| Pergunta | "Alexa, quando é a maré alta?" |
| Com verbo | "Alexa, quando enche a maré?" |
| Horário | "Alexa, que horas a maré alta?" |

### Maré Baixa (GetLowTideIntent)

| Comando | Exemplo |
|---------|---------|
| Simples | "Alexa, maré baixa" |
| Sinônimo | "Alexa, maré seca" |
| Termo náutico | "Alexa, baixamar" |
| Pergunta | "Alexa, quando é a maré baixa?" |
| Com verbo | "Alexa, quando seca a maré?" |
| Horário | "Alexa, que horas a maré baixa hoje?" |

---

## Funcionalidades

- ✅ **Name-Free Interaction (NFI)**: Perguntas diretas sem precisar abrir a skill
- ✅ **CanFulfillIntentRequest**: Alexa identifica automaticamente a skill para perguntas sobre maré
- ✅ **Termos náuticos**: Suporte a "preamar", "baixamar", "maré cheia", "maré seca"
- ✅ **Variações coloquiais**: "como tá a maré", "quando enche", "quando seca"
- ✅ **Datas flexíveis**: Amanhã, próxima semana, dias da semana, datas específicas

---

## Publicação da Skill

### Pré-requisitos

- [Conta Amazon Developer](https://developer.amazon.com) (gratuita)
- [Conta AWS](https://aws.amazon.com) (gratuita)
- Node.js 18+ instalado

---

### Passo 1: Criar a Função Lambda na AWS

1. Acesse o [AWS Console](https://console.aws.amazon.com) → **Lambda**
2. Clique em **Create function**
3. Configure:
   - **Function name**: `alexa-tabua-mares-maceio`
   - **Runtime**: `Node.js 20.x`
   - **Architecture**: `x86_64`
4. Clique em **Create function**

#### 1.1 Enviar o Código

5. Na função Lambda, vá em **Code** → **Upload from** → **.zip file**
6. Faça upload do arquivo `lambda.zip` (já incluído no repositório)

> **Nota**: O `lambda.zip` já vem pronto com código e dependências. Para regenerar:
> ```bash
> cd alexa-skill/lambda
> npm install
> zip -r ../lambda.zip . -x "*.DS_Store" -x "test-events/*"
> ```

#### 1.2 Configurar Timeout

7. Vá em **Configuration** → **General configuration** → **Edit**
8. Defina **Timeout**: `10 segundos`
9. Salve

#### 1.3 Adicionar Trigger da Alexa

10. Clique em **Add trigger**
11. Selecione **Alexa Skills Kit**
12. **Skill ID verification**: selecione `Disable` (temporário)
13. Clique em **Add**
14. **Copie o ARN da função** (canto superior direito)
    ```
    arn:aws:lambda:us-east-1:123456789:function:alexa-tabua-mares-maceio
    ```

---

### Passo 2: Criar a Skill no Alexa Developer Console

1. Acesse [developer.amazon.com/alexa/console/ask](https://developer.amazon.com/alexa/console/ask)
2. Clique em **Create Skill**
3. Configure:
   - **Skill name**: `Tábua de Marés Maceió`
   - **Primary locale**: `Portuguese (BR)`
   - **Model**: `Custom`
   - **Hosting**: `Provision your own`
4. Clique em **Create skill**
5. Escolha **Start from Scratch** → **Continue with template**

---

### Passo 3: Configurar o Modelo de Interação

1. No menu lateral, vá em **Interaction Model** → **JSON Editor**
2. Cole o conteúdo do arquivo:
   ```
   skill-package/interactionModels/custom/pt-BR.json
   ```
3. Clique em **Save Model**
4. Clique em **Build Model** (aguarde ~1-2 minutos)

---

### Passo 4: Configurar o Endpoint

1. No menu lateral, vá em **Endpoint**
2. Selecione **AWS Lambda ARN**
3. Em **Default Region**, cole o ARN da Lambda:
   ```
   arn:aws:lambda:us-east-1:SEU_ID:function:alexa-tabua-mares-maceio
   ```
4. Clique em **Save Endpoints**

---

### Passo 5: Habilitar Verificação de Skill ID

1. Copie o **Skill ID** do console Alexa:
   ```
   amzn1.ask.skill.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
2. Volte à função Lambda na AWS
3. Clique no trigger **Alexa Skills Kit**
4. Configure:
   - **Skill ID verification**: `Enable`
   - **Skill ID**: cole o ID copiado
5. Salve

---

### Passo 6: Testar a Skill

1. No Alexa Developer Console, vá em **Test**
2. Habilite o teste: **Development**
3. Digite ou fale:
   ```
   abrir tábua de marés
   maré
   qual a maré de hoje
   maré baixa
   quando enche a maré
   preamar
   ```

---

### Passo 7: Configurar Informações de Publicação

1. Vá em **Distribution** → **Skill Preview**
2. Preencha:

| Campo | Valor |
|-------|-------|
| **Public Name** | Tábua de Marés Maceió |
| **One Sentence Description** | Consulte os horários e alturas das marés em Maceió, Alagoas. |
| **Detailed Description** | A skill Tábua de Marés Maceió fornece informações sobre os horários e alturas das marés na cidade de Maceió, Alagoas, Brasil. Você pode perguntar sobre as marés de hoje, de amanhã, ou de qualquer data específica em 2026. A skill informa tanto marés altas quanto marés baixas, facilitando o planejamento de atividades na praia, pesca e esportes náuticos. Suporta termos como "maré cheia", "maré seca", "preamar" e "baixamar". |
| **Example Phrases** | "Alexa, maré", "Alexa, qual a maré de hoje", "Alexa, quando é a maré baixa" |
| **Category** | Weather |
| **Keywords** | maré, marés, tábua, maceió, alagoas, praia, pesca, surf, preamar, baixamar |

3. **Ícones** (obrigatório):
   - Small Icon: 108x108 PNG → upload `icons/icon-108x108.png`
   - Large Icon: 512x512 PNG → upload `icons/icon-512x512.png`

**Nota:** Os ícones já estão prontos na pasta `icons/` com fundo branco e ondas azuis na paleta do site (tide-500 e tide-200).

---

### Passo 8: Privacy & Compliance

1. Vá em **Distribution** → **Privacy & Compliance**
2. Responda as perguntas:

| Pergunta | Resposta |
|----------|----------|
| Does this skill allow users to make purchases? | **No** |
| Does this skill collect personal information? | **No** |
| Is this skill directed to children under 13? | **No** |
| Does this skill contain advertising? | **No** |
| Does this skill export anything? | **No** |

3. **Privacy Policy URL**: deixe em branco (opcional para skills gratuitas)

---

### Passo 9: Habilitar Name-Free Interaction (Opcional)

Para que a Alexa responda a perguntas diretas como "Alexa, maré" sem precisar invocar a skill:

1. Vá em **Build** → **Interfaces**
2. Habilite **Can Fulfill Intent Request**
3. Reconstrua o modelo (**Build Model**)

> **Nota:** O código Lambda já inclui o `CanFulfillIntentRequestHandler`. A Amazon pode precisar aprovar sua skill para NFI.

---

### Passo 10: Validação e Submissão

1. Vá em **Certification** → **Validation**
2. Clique em **Run** para validar
3. Corrija erros se houver
4. Vá em **Submission**
5. Clique em **Submit for review**

---

### Passo 11: Aguardar Aprovação

- A Amazon revisa em **1-5 dias úteis**
- Você receberá email com aprovação ou feedback
- Se rejeitado, corrija os problemas apontados e resubmeta
- Após aprovado, a skill estará disponível na **Alexa Skills Store**

---

## Atualização da Skill

### Atualizar código Lambda

```bash
cd alexa-skill/lambda
npm install
zip -r ../lambda.zip . -x "*.DS_Store" -x "test-events/*"
```

Faça upload do `lambda.zip` na AWS Lambda.

### Atualizar modelo de interação

1. Edite `skill-package/interactionModels/custom/pt-BR.json`
2. Cole o JSON no Alexa Developer Console → **Interaction Model** → **JSON Editor**
3. Clique em **Save Model** e **Build Model**

### Atualizar ícones

Os ícones fonte estão em `icons/icon.svg`. Para regenerar os PNGs:

```bash
cd alexa-skill/icons
magick -background none -density 300 icon.svg -resize 512x512 icon-512x512.png
magick -background none -density 300 icon.svg -resize 108x108 icon-108x108.png
```

**Requisitos:** ImageMagick instalado (`brew install imagemagick` no macOS).

---

## Intents e Samples

| Intent | Samples | Descrição |
|--------|---------|-----------|
| `GetTodayTidesIntent` | 49 | Marés do dia atual |
| `GetTidesByDateIntent` | 25 | Marés de uma data específica |
| `GetHighTideIntent` | 32 | Maré alta / cheia / preamar |
| `GetLowTideIntent` | 37 | Maré baixa / seca / baixamar |

**Total: 143 samples de voz**

---

## Custos

| Serviço | Custo |
|---------|-------|
| AWS Lambda | Grátis até 1M requisições/mês |
| Alexa Developer | Grátis |
| Publicação | Grátis |

Para uso pessoal e baixo volume, o custo será **zero**.

---

## Suporte

- [Documentação ASK SDK](https://developer.amazon.com/docs/alexa-skills-kit-sdk-for-nodejs/overview.html)
- [Alexa Developer Forums](https://developer.amazon.com/support)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)

---

## Troubleshooting

### Erro "Cannot find module"

Certifique-se de que o `node_modules` está incluído no ZIP:

```bash
cd alexa-skill/lambda
rm -rf node_modules
npm install
zip -r ../lambda.zip . -x "*.DS_Store" -x "test-events/*"
```

### Skill não responde

1. Verifique se o Skill ID está configurado corretamente no trigger da Lambda
2. Teste a Lambda diretamente com os eventos de teste em `lambda/test-events/`
3. Verifique os logs no CloudWatch

### Dados não encontrados

Os dados de marés devem estar em `lambda/data/2026/` com nomenclatura em inglês:
- `january_2026.json`, `february_2026.json`, etc.

Os campos JSON internos estão em português: `dias`, `dia`, `diaSemana`, `mares`, `hora`, `altura`.

### Perguntas diretas não funcionam

Se comandos como "Alexa, maré" não ativam a skill:

1. Verifique se `CAN_FULFILL_INTENT_REQUEST` está habilitado em **Build** → **Interfaces**
2. Reconstrua o modelo de interação
3. A Amazon pode precisar aprovar a skill para Name-Free Interaction
4. Certifique-se de que o `CanFulfillIntentRequestHandler` está no código Lambda
