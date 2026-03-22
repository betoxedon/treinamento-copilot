# treinamento_copilot

## Descrição

Servidor HTTP minimalista construído com **Node.js**, **TypeScript** e **Express 5**.
O projeto serve como base de treinamento para boas práticas de desenvolvimento com GitHub Copilot, cobrindo configuração de TypeScript estrito, testes automatizados com cobertura de 100% e convenções de código em português do Brasil.

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
