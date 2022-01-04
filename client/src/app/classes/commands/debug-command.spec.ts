import { DebugCommand } from './debug-command';

fdescribe('DebugCommand', () => {
    let debug: DebugCommand;

    beforeEach(() => {
        debug = new DebugCommand();
    });

    it('should create an instance', () => {
        expect(new DebugCommand()).toBeTruthy();
    });

    it('executeCommand should set Param to the parameter an instance', () => {
        debug.parameter = 'x';
        const returnValue = debug.executeCommand('test');
        expect(returnValue).toBe('Mode debug désactivé');
    });

    it('executeCommand should set Param to "Mode debug activé" ', () => {
        debug.parameter = 'x';
        const returnValue = debug.executeCommand('true');
        expect(returnValue).toBe('Mode debug activé');
    });
});
