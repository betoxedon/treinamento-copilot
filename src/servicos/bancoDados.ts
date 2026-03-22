/**
 * @module bancoDados
 * Servico de persistencia SQLite para historico de consultas da API.
 */
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import sqlite3 from 'sqlite3';

/**
 * Representa uma linha da tabela `consultas` retornada diretamente pelo SQLite,
 * com nomes de colunas no formato snake_case do banco de dados.
 */
type RegistroConsultaLinha = {
    /** Identificador unico da consulta. */
    id: number;
    /** Data e hora da consulta no formato ISO 8601. */
    data_hora_consulta: string;
    /** Resultado da consulta serializado como JSON. */
    resultado_json: string;
};

/**
 * Representa um registro de consulta normalizado para uso na aplicacao,
 * com nomes de campos em camelCase e o resultado desserializado.
 */
type RegistroConsulta = {
    /** Identificador unico da consulta. */
    id: number;
    /** Data e hora da consulta no formato ISO 8601. */
    dataHoraConsulta: string;
    /** Resultado da consulta retornado pela API externa. */
    resultadoConsulta: unknown;
};

const CAMINHO_BANCO_DADOS = resolve(process.cwd(), 'data', 'consultas.db');

mkdirSync(dirname(CAMINHO_BANCO_DADOS), { recursive: true });

const conexaoBancoDados = new sqlite3.Database(CAMINHO_BANCO_DADOS);

/**
 * Executa um comando SQL de escrita no banco de dados (INSERT, UPDATE, DELETE, CREATE).
 *
 * @param sql - Instrucao SQL a ser executada.
 * @param parametros - Valores a serem substituidos nos placeholders `?` da instrucao.
 * @returns `Promise<void>` — resolvida apos a execucao bem-sucedida do comando.
 */
const executarComando = (sql: string, parametros: Array<string | number> = []): Promise<void> => {
    return new Promise((resolver, rejeitar) => {
        conexaoBancoDados.run(sql, parametros, (erro) => {
            /* istanbul ignore next */
            if (erro) {
                rejeitar(erro);
                return;
            }

            resolver();
        });
    });
};

/**
 * Executa uma consulta SQL de leitura e retorna todas as linhas resultantes.
 *
 * @template TRetorno - Tipo de cada linha retornada.
 * @param sql - Instrucao SQL SELECT a ser executada.
 * @param parametros - Valores a serem substituidos nos placeholders `?` da consulta.
 * @returns `Promise<TRetorno[]>` — array com as linhas retornadas pela consulta.
 */
const consultarTodos = <TRetorno>(
    sql: string,
    parametros: Array<string | number> = [],
): Promise<TRetorno[]> => {
    return new Promise((resolver, rejeitar) => {
        conexaoBancoDados.all(sql, parametros, (erro, linhas) => {
            /* istanbul ignore next */
            if (erro) {
                rejeitar(erro);
                return;
            }

            resolver(linhas as TRetorno[]);
        });
    });
};

let inicializacaoBancoDados: Promise<void> | null = null;

/**
 * Inicializa o banco de dados criando a tabela `consultas` se ainda nao existir.
 * A inicializacao e realizada apenas uma vez, mesmo que a funcao seja chamada multiplas vezes.
 *
 * @returns `Promise<void>` — resolvida apos a inicializacao bem-sucedida.
 */
const inicializarBancoDados = (): Promise<void> => {
    if (!inicializacaoBancoDados) {
        inicializacaoBancoDados = (async (): Promise<void> => {
            await executarComando(`
                CREATE TABLE IF NOT EXISTS consultas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    data_hora_consulta TEXT NOT NULL,
                    resultado_json TEXT NOT NULL DEFAULT '{}'
                )
            `);

            try {
                await executarComando("ALTER TABLE consultas ADD COLUMN resultado_json TEXT NOT NULL DEFAULT '{}' ");
            } catch {
                /* istanbul ignore next */
                // Coluna ja existe em bancos criados com schema novo.
            }
        })();
    }

    return inicializacaoBancoDados;
};

/**
 * Registra uma nova consulta no banco de dados, armazenando o resultado da API e a data/hora atual.
 *
 * @param resultadoConsulta - Dados retornados pela API externa a serem armazenados.
 * @returns `Promise<void>` — resolvida apos a insercao bem-sucedida no banco.
 */
const registrarConsulta = async (resultadoConsulta: unknown): Promise<void> => {
    await inicializarBancoDados();

    await executarComando('INSERT INTO consultas (data_hora_consulta, resultado_json) VALUES (?, ?)', [
        new Date().toISOString(),
        JSON.stringify(resultadoConsulta),
    ]);
};

/**
 * Lista todas as consultas registradas no banco de dados, ordenadas da mais recente para a mais antiga.
 *
 * @returns `Promise<RegistroConsulta[]>` — array com os registros de consultas normalizados.
 */
const listarConsultas = async (): Promise<RegistroConsulta[]> => {
    await inicializarBancoDados();

    const linhas = await consultarTodos<RegistroConsultaLinha>(
        'SELECT id, data_hora_consulta, resultado_json FROM consultas ORDER BY id DESC',
    );

    return linhas.map((linha) => ({
        id: linha.id,
        dataHoraConsulta: linha.data_hora_consulta,
        resultadoConsulta: JSON.parse(linha.resultado_json),
    }));
};

export { listarConsultas, registrarConsulta };
export type { RegistroConsulta };