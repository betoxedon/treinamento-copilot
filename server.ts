/**
 * @module server
 * Ponto de entrada da aplicação. Configura o servidor Express com middleware
 * e rotas principais. O servidor escuta na porta 3000 e responde com JSON
 * em português do Brasil.
 */
import express from 'express';

const app = express();
const PORTA = 3000;

app.use(express.json());

/**
 * GET /
 * 
 * Rota de raiz que retorna uma mensagem de boas-vindas.
 * 
 * @returns `{ mensagem: string }` — mensagem de boas-vindas ao servidor.
 */
app.get('/', (_req, res) => {
    res.json({ mensagem: 'Bem-vindo ao servidor!' });
});

/**
 * Instância configurada do Express.
 * @type {import('express').Express}
 */
export { app, PORTA };

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORTA, () => {
        console.log(`Servidor rodando em http://localhost:${PORTA}`);
    });
}