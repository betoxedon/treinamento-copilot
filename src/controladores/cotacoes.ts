/**
 * @module cotacoesController
 * Controller responsavel por consultar cotacoes em fonte externa e retornar os dados
 * em formato padronizado para a API.
 */
import type { Request, Response } from 'express';
import { listarConsultas, registrarConsulta } from '../servicos/bancoDados';

const URL_BASE_COTACOES = 'https://br.dolarapi.com/v1/cotacoes';

/**
 * Consulta uma API externa publica para buscar cotacoes.
 *
 * @param _requisicao - Requisicao HTTP (nao utilizada no momento).
 * @param resposta - Resposta HTTP do Express.
 * @returns `Promise<void>` — envia resposta JSON com `{ mensagem, dados }` em caso de sucesso,
 *   ou `{ mensagem }` com status 502 em falha na API externa, ou 500 em falha ao persistir.
 */
const consultarCotacoes = async (_requisicao: Request, resposta: Response): Promise<void> => {
    try {
        const respostaExterna = await fetch(URL_BASE_COTACOES);

        if (!respostaExterna.ok) {
            resposta.status(502).json({ mensagem: 'A fonte de cotacoes retornou erro.' });
            return;
        }

        const dados = (await respostaExterna.json()) as unknown;

        try {
            await registrarConsulta(dados);
        } catch {
            resposta.status(500).json({ mensagem: 'Nao foi possivel registrar a consulta no banco local.' });
            return;
        }

        resposta.json({
            mensagem: 'Cotacoes consultadas com sucesso.',
            dados,
        });
    } catch {
        resposta.status(502).json({ mensagem: 'Nao foi possivel consultar a fonte de cotacoes.' });
    }
};

/**
 * Lista as consultas realizadas na API de cotacoes.
 *
 * @param _requisicao - Requisicao HTTP (nao utilizada no momento).
 * @param resposta - Resposta HTTP do Express.
 * @returns `Promise<void>` — envia resposta JSON com `{ mensagem, dados }` em caso de sucesso,
 *   ou `{ mensagem }` com status 500 em caso de erro ao consultar o banco.
 */
const listarConsultasRealizadas = async (_requisicao: Request, resposta: Response): Promise<void> => {
    try {
        const consultas = await listarConsultas();

        resposta.json({
            mensagem: 'Consultas listadas com sucesso.',
            dados: consultas,
        });
    } catch {
        resposta.status(500).json({ mensagem: 'Nao foi possivel listar as consultas registradas.' });
    }
};

export { consultarCotacoes, listarConsultasRealizadas };