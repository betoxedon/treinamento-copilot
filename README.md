# treinamento_copilot

## Descrição

**Projeto de treinamento sobre agentes de codificação customizados com GitHub Copilot.**

Este repositório demonstra como criar e configurar **agentes de IA especializados** para automação e padronização de fluxos de trabalho de desenvolvimento. Implementa um servidor HTTP minimalista com **Node.js**, **TypeScript** e **Express 5**, servindo como base prática para explorar:

- ✅ Agentes customizados para diferentes domínios (documentação, QA, testes, Git)
- ✅ Convenções de código em português do Brasil
- ✅ Testes automatizados com cobertura de 100%
- ✅ Boas práticas de desenvolvimento com GitHub Copilot

O projeto é voltado para **desenvolvedores** que desejam entender como implementar agentes de IA para melhorar produtividade e qualidade do código.

---

## Pré-requisitos

| Ferramenta | Versão mínima recomendada |
|---|---|
| Node.js | 18.x ou superior |
| npm | 9.x ou superior |

Não há dependência de banco de dados ou serviços externos.

---

## Instalação

```bash
npm install
```

---

## Como executar

```bash
npm run dev
```

O servidor inicia na porta **3000**. Acesse em: `http://localhost:3000`

> O script `dev` utiliza `tsx` para executar o TypeScript diretamente, sem etapa de compilação.

---

## Como testar

```bash
npm test
```

O comando executa o Jest com coleta de cobertura (`--coverage`). Ao final, um relatório é exibido no terminal e salvo em `coverage/lcov-report/index.html`.

### Interpretando o relatório de cobertura

| Coluna | Significado |
|---|---|
| `Stmts` | Porcentagem de instruções executadas |
| `Branch` | Porcentagem de ramificações (`if`/`else`, ternários) cobertas |
| `Funcs` | Porcentagem de funções chamadas |
| `Lines` | Porcentagem de linhas executadas |

O threshold global mínimo configurado é **80%** em todas as métricas. O projeto atinge **100%** em todas elas.

---

## Estrutura do projeto

```
treinamento_copilot/
├── src/
│   ├── rotas/           # Definição das rotas Express por domínio
│   ├── controladores/   # Recebem requisições HTTP e delegam aos serviços
│   ├── servicos/        # Lógica de negócio (independente do Express)
│   ├── middlewares/     # Middlewares reutilizáveis (auth, validação, erros)
│   └── tipos/           # Interfaces e tipos TypeScript compartilhados
├── server.ts            # Ponto de entrada: configura e sobe o servidor Express
├── server.spec.ts       # Testes automatizados do servidor (supertest + Jest)
├── jest.config.ts       # Configuração do Jest (ts-jest, cobertura, thresholds)
├── tsconfig.json        # Configuração do compilador TypeScript
├── package.json         # Dependências e scripts do projeto
└── coverage/            # Relatórios de cobertura gerados pelo Jest (automático)
```

---

## Rotas HTTP

| Método | Caminho | Descrição | Exemplo de resposta |
|---|---|---|---|
| `GET` | `/` | Retorna mensagem de boas-vindas | `{ "mensagem": "Bem-vindo ao servidor!" }` |

---

## Convenções

As convenções completas estão em [`.github/instructions/typescript.instructions.md`](.github/instructions/typescript.instructions.md). Resumo:

- **Idioma:** todo código, variáveis, funções, tipos e mensagens em **português do Brasil**.
- **Nomenclatura:**
  - `camelCase` em português para variáveis e funções (ex: `nomeDoUsuario`).
  - `PascalCase` em português para tipos, interfaces e classes (ex: `ConfiguracoesServidor`).
  - `MAIUSCULAS_COM_UNDERSCORE` para constantes de nível de módulo (ex: `PORTA`).
- **Módulos:** use `import`/`export` ESM. `require()` é proibido.
- **Tipagem:** nunca use `any`. Prefira `unknown` com narrowing explícito.
- **Estilo:** `const` sobre `let`; `var` é proibido. Funções pequenas e com responsabilidade única.
- **Express:** retorne sempre JSON com chaves em camelCase e em português.

---

## Agentes de Codificação

Este projeto inclui **agentes de IA customizados** (em `.github/agents/`) que automatizam e padronizam fluxos de trabalho específicos. Cada agente é especializado em um domínio e pode ser invocado via GitHub Copilot.

### 1. **Documentation** — Documentação e JSDoc

**Arquivo:** [`.github/agents/documentation.agent.md`](.github/agents/documentation.agent.md)

**Propósito:** Criar e manter documentação clara, consistente e sincronizada (README.md, JSDoc, comentários de módulo).

**Quando usar:**
- Escrever ou atualizar documentação do projeto
- Adicionar JSDoc em funções, rotas ou interfaces
- Sincronizar README com mudanças de código
- Garantir que toda função exportada tenha descrição

**Exemplo de uso:** 
> "Documentation: Atualize o README.md para documentar a nova rota de autenticação e adicione JSDoc nas funções de autenticação do módulo."

---

### 2. **Ensure QA** — Auditoria de Qualidade

**Arquivo:** [`.github/agents/ensure-qa.agent.md`](.github/agents/ensure-qa.agent.md)

**Propósito:** Auditar código em três dimensões — convenções TypeScript, qualidade de testes e cobertura — reportando ou corrigindo desvios.

**Quando usar:**
- Revisar conformidade com convenções de código
- Verificar se testes cobrem todas as rotas
- Validar que `npm test` passa com threshold de 80%
- Auditar qualidade antes de merge

**Exemplo de uso:**
> "Ensure QA: Audite o módulo `src/controladores/` para garantir que todas as funções seguem convenções pt-BR e têm testes correspondentes."

---

### 3. **Repository** — Gerenciamento Git

**Arquivo:** [`.github/agents/repository.agent.md`](.github/agents/repository.agent.md)

**Propósito:** Gerenciar repositório Git — inicializar, configurar remoto, comitar e publicar mudanças seguindo Conventional Commits.

**Quando usar:**
- Inicializar um novo repositório
- Configurar remoto Git (origin)
- Comitar grupos de mudanças com mensagens descritivas
- Fazer push para repositório remoto
- Verificar status do repositório

**Exemplo de uso:**
> "Repository: Comite as mudanças em src/ com mensagem 'feat: add authentication module' e faça push para origin/main."

---

### 4. **Test Repository Coverage** — Cobertura de Testes

**Arquivo:** [`.github/agents/test-repository-coverage.agent.md`](.github/agents/test-repository-coverage.agent.md)

**Propósito:** Avaliar cobertura de testes automatizados, identificar lacunas e implementar testes para melhorar métricas.

**Quando usar:**
- Verificar cobertura atual de testes (linhas, funções, branches)
- Identificar arquivos sem teste correspondente
- Aumentar cobertura para atingir threshold mínimo
- Gerar ou interpretar relatório de cobertura

**Exemplo de uso:**
> "Test Repository Coverage: Analise a cobertura do projeto e crie testes para garantir 100% em todas as métricas."

---

## Como invocar um agente

1. Abra a **Paleta de Comandos** (Ctrl+Shift+P / Cmd+Shift+P)
2. Digite **"Copilot: Ask About Your Code"** (ou equivalente em sua versão do VS Code)
3. No chat, comece com o nome do agente, seguido do seu pedido:
   ```
   Documentation: Adicione JSDoc em todas as funções de src/servicos/

   Ensure QA: Verifique se a cobertura de testes está em 100%

   Repository: Comite todas as mudanças com mensagem "docs: update README"

   Test Repository Coverage: Gere um relatório de cobertura
   ```

> **Nota:** A invocação de agentes depende de configuração do GitHub Copilot no VS Code. Certifique-se de ter a extensão instalada e autenticada.

---
