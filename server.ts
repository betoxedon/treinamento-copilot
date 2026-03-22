import express from 'express';

const app = express();
const PORTA = 3000;

app.use(express.json());

app.get('/', (_req, res) => {
    res.json({ mensagem: 'Bem-vindo ao servidor!' });
});

export { app, PORTA };

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORTA, () => {
        console.log(`Servidor rodando em http://localhost:${PORTA}`);
    });
}