/**
 * @module bancoDados
 * Servico de persistencia SQLite para historico de consultas da API.
 */
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import sqlite3 from 'sqlite3';

type RegistroConsultaLinha = {
    id: number;
    data_hora_consulta: string;
    resultado_json: string;
};

type RegistroConsulta = {
    id: number;
    dataHoraConsulta: string;
    resultadoConsulta: unknown;
};

const CAMINHO_BANCO_DADOS = resolve(process.cwd(), 'data', 'consultas.db');

mkdirSync(dirname(CAMINHO_BANCO_DADOS), { recursive: true });

const conexaoBancoDados = new sqlite3.Database(CAMINHO_BANCO_DADOS);

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

const registrarConsulta = async (resultadoConsulta: unknown): Promise<void> => {
    await inicializarBancoDados();

    await executarComando('INSERT INTO consultas (data_hora_consulta, resultado_json) VALUES (?, ?)', [
        new Date().toISOString(),
        JSON.stringify(resultadoConsulta),
    ]);
};

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