import request from 'supertest';
import { app } from './server';
import * as servicoBancoDados from './src/servicos/bancoDados';

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

describe('GET /api/cotacoes', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('deve retornar dados de cotacoes com status 200', async () => {
        const cotacoesMock = [
            {
                moeda: 'USD',
                nome: 'Dolar Americano',
                compra: 5.12,
                venda: 5.13,
            },
        ];

        const respostaMock = {
            ok: true,
            json: async () => cotacoesMock,
        } as unknown as Response;

        jest.spyOn(global, 'fetch').mockResolvedValue(respostaMock);

        const resposta = await request(app).get('/api/cotacoes');

        expect(resposta.status).toBe(200);
        expect(resposta.body).toEqual({
            mensagem: 'Cotacoes consultadas com sucesso.',
            dados: cotacoesMock,
        });
    });

    it('deve retornar status 500 quando nao conseguir registrar consulta no banco', async () => {
        jest.spyOn(servicoBancoDados, 'registrarConsulta').mockRejectedValue(new Error('Falha no banco'));

        const resposta = await request(app).get('/api/cotacoes');

        expect(resposta.status).toBe(500);
        expect(resposta.body).toEqual({ mensagem: 'Nao foi possivel registrar a consulta no banco local.' });
    });

    it('deve retornar status 502 quando a fonte de cotacoes responder com erro', async () => {
        const respostaMock = {
            ok: false,
            json: async () => ({}),
        } as unknown as Response;

        jest.spyOn(global, 'fetch').mockResolvedValue(respostaMock);

        const resposta = await request(app).get('/api/cotacoes');

        expect(resposta.status).toBe(502);
        expect(resposta.body).toEqual({ mensagem: 'A fonte de cotacoes retornou erro.' });
    });

    it('deve retornar status 502 quando ocorrer falha de rede', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Falha de rede'));

        const resposta = await request(app).get('/api/cotacoes');

        expect(resposta.status).toBe(502);
        expect(resposta.body).toEqual({ mensagem: 'Nao foi possivel consultar a fonte de cotacoes.' });
    });
});

describe('GET /api/cotacoes/consultas', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('deve listar as consultas registradas com status 200', async () => {
        const respostaMock = {
            ok: true,
            json: async () => ([{ moeda: 'USD', compra: 5.12, venda: 5.13 }]),
        } as unknown as Response;

        jest.spyOn(global, 'fetch').mockResolvedValue(respostaMock);

        await request(app).get('/api/cotacoes');

        const resposta = await request(app).get('/api/cotacoes/consultas');

        expect(resposta.status).toBe(200);
        expect(resposta.body.mensagem).toBe('Consultas listadas com sucesso.');
        expect(Array.isArray(resposta.body.dados)).toBe(true);
        expect(resposta.body.dados.length).toBeGreaterThan(0);
        expect(typeof resposta.body.dados[0].id).toBe('number');
        expect(typeof resposta.body.dados[0].dataHoraConsulta).toBe('string');
        expect(resposta.body.dados[0].resultadoConsulta).toEqual([{ moeda: 'USD', compra: 5.12, venda: 5.13 }]);
    });

    it('deve retornar status 500 quando nao conseguir listar consultas', async () => {
        jest.spyOn(servicoBancoDados, 'listarConsultas').mockRejectedValue(new Error('Falha ao listar'));

        const resposta = await request(app).get('/api/cotacoes/consultas');

        expect(resposta.status).toBe(500);
        expect(resposta.body).toEqual({ mensagem: 'Nao foi possivel listar as consultas registradas.' });
    });
});
