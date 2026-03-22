import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: ['**/*.ts', '!**/*.spec.ts', '!jest.config.ts'],
    coverageThreshold: {
        global: {
            statements: 80,
            lines: 80,
            functions: 80,
            branches: 80,
        },
    },
};

export default config;
