import { TestBed } from '@angular/core/testing';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { PassCommand } from './pass-command';

fdescribe('PassCommand', () => {
    let pass: PassCommand;
    let gameStateService: GameStateService;
    let gameModSpy: GameModeService;
    let sockSpy: SocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [GameStateService] });
        gameStateService = new GameStateService(sockSpy, gameModSpy);
        pass = new PassCommand(gameStateService);
    });

    it('should create an instance', () => {
        expect(pass).toBeTruthy();
    });

    it('if player"s turn, he can pass his turn', () => {
        gameStateService.isPlaying = true;
        const spy = spyOn(pass.gameStateService, 'emitReset');
        const returnValue = pass.executeCommand('test');
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual('Vous avez passé votre tour');
    });
});
