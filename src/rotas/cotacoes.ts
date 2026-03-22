/**
 * @module cotacoesRotas
 * Rotas relacionadas a consulta de cotacoes em fonte externa.
 */
import { Router } from 'express';
import { consultarCotacoes, listarConsultasRealizadas } from '../controladores/cotacoes';

const roteadorCotacoes = Router();

/**
 * GET /
 *
 * Consulta cotacoes em uma fonte externa e retorna dados padronizados.
 *
 * @returns `{ mensagem: string, dados: unknown }` — mensagem de sucesso e dados retornados pela API externa.
 */
roteadorCotacoes.get('/', consultarCotacoes);

/**
 * GET /consultas
 *
 * Lista as consultas de cotacoes registradas no banco SQLite local.
 *
 * @returns `{ mensagem: string, dados: RegistroConsulta[] }` — mensagem de sucesso e lista de consultas registradas.
 */
roteadorCotacoes.get('/consultas', listarConsultasRealizadas);

export default roteadorCotacoes;