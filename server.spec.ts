import request from 'supertest';
import { app } from './server';

describe('GET /', () => {
    it('deve retornar status 200', async () => {
        const resposta = await request(app).get('/');
        expect(resposta.status).toBe(200);
    });

    it('deve retornar mensagem de boas-vindas', async () => {
        const resposta = await request(app).get('/');
        expect(resposta.body).toEqual({ mensagem: 'Bem-vindo ao servidor!' });
    });
});
