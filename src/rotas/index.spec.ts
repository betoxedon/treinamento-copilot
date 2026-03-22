import roteador from './index';

describe('roteador', () => {
    it('deve exportar um roteador definido', () => {
        expect(roteador).toBeDefined();
    });

    it('deve possuir os metodos de rota HTTP do Express', () => {
        expect(typeof roteador.use).toBe('function');
        expect(typeof roteador.get).toBe('function');
        expect(typeof roteador.post).toBe('function');
    });
});
