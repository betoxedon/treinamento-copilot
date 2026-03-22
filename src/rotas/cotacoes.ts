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
 */
roteadorCotacoes.get('/', consultarCotacoes);

/**
 * GET /consultas
 *
 * Lista as consultas de cotacoes registradas no banco SQLite local.
 */
roteadorCotacoes.get('/consultas', listarConsultasRealizadas);

export default roteadorCotacoes;