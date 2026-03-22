---
description: "Use when writing, editing or reviewing TypeScript files. Covers naming conventions, module style, project idioms and patterns observed in this codebase."
applyTo: "**/*.ts"
---
# Convenções TypeScript

## Módulos
- Use `import`/`export` ESM. Proibido `require()`.
- Prefira imports nomeados. Use `import type` quando importar apenas tipos.

## Nomenclatura
- Variáveis e funções: `camelCase` **em português** (ex: `porta`, `nomeDoUsuario`).
- Tipos, interfaces e classes: `PascalCase` em português (ex: `ConfiguracoesServidor`).
- Constantes de nível de módulo: `MAIUSCULAS_COM_UNDERSCORE`.

## Tipagem
- Nunca use `any`. Prefira `unknown` com narrowing explícito.
- Sempre anote os tipos de retorno de funções públicas.
- Evite asserções de tipo (`as Foo`) — resolva com narrowing ou overloads.

## Express / HTTP
- Separe rotas em arquivos por domínio quando o router crescer.
- Trate erros com um middleware centralizado (`app.use((err, req, res, next) => ...)`).
- Retorne sempre JSON com chaves em português e `camelCase` (ex: `{ mensagem: '...' }`).

## Estilo geral
- Prefira `const` sobre `let`. Nunca use `var`.
- Funções pequenas e com responsabilidade única.
- Sem código morto ou imports não utilizados.
- Mensagens de log e strings voltadas ao usuário em **português do Brasil**.
