/**
 * @module rotas
 * Ponto de entrada para todas as rotas da aplicacao.
 * Cada dominio deve ter seu proprio arquivo de rotas nesta pasta
 * e ser registrado aqui via `router.use()`.
 */
import { Router } from 'express';
import roteadorCotacoes from './cotacoes';

/**
 * Roteador principal da API.
 * Agrega todos os sub-roteadores de dominio registrados em `/api`.
 */
const roteador = Router();

roteador.use('/cotacoes', roteadorCotacoes);

export default roteador;
