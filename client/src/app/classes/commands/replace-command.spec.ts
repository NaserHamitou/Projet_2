/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Letter } from '@app/letter';
import { AudioManagerService } from '@app/services/audio/audio-manager.service';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { LetterBankService } from '@app/services/letter-bank/letter-bank.service';
import { RackService } from '@app/services/rack/rack.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { WriteToBoxService } from '@app/services/write-to-box.service';
import { ReplaceCommand } from './replace-command';

fdescribe('ReplaceCommand', () => {
    let replace: ReplaceCommand;
    let letterBankSpy: LetterBankService;
    let gameModSpy: GameModeService;
    let gameStateService: GameStateService;
    let sockSpy: SocketService;
    let rackServiceSpy: RackService;
    let writeService: WriteToBoxService;
    let audioService: AudioManagerService;

    beforeEach(() => {
        letterBankSpy = new LetterBankService();
        writeService = new WriteToBoxService();
        gameModSpy = new GameModeService();
        sockSpy = new SocketService(gameModSpy);
        rackServiceSpy = new RackService(writeService, letterBankSpy, sockSpy, gameStateService, gameModSpy, audioService);
        replace = new ReplaceCommand(rackServiceSpy);
    });

    it('should create an instance', () => {
        expect(replace).toBeTruthy();
    });

    it('executeCommand not let player change letters if rack has less than 7 letters', () => {
        replace.rackService.letterRack = [new Letter('q', 10), new Letter('a', 1)];
        const returnText = replace.executeCommand('!echanger qa');
        expect(returnText).toBe('Chevalet contient moins de 7 lettres');
    });

    it('executeCommand not let player exchange if array is longer than 7 letters ', () => {
        replace.rackService.letterRack = [
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
        ];
        const returnText = replace.executeCommand('!echanger aaaaaaaa');
        expect(returnText).toBe("Impossible d'échanger plus de 7 lettres");
    });

    it('executeCommand not let player exchange if letter is not in rack', () => {
        replace.rackService.letterRack = [
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
        ];
        const returnText = replace.executeCommand('!');
        expect(returnText).toBe('La lettre "' + '!' + '" ne se trouve pas dans le chevalet');
    });

    it('executeCommand should not change any letters if the value is empty', () => {
        replace.rackService.letterRack = [
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('a', 1),
        ];
        const returnText = replace.executeCommand('');
        expect(returnText).toBe('Aucune lettre à échanger');
    });

    it('executeCommand should trade the letter that the player has sent', () => {
        rackServiceSpy.letterBank.initializeAllLetters();
        rackServiceSpy.letterRack = [
            new Letter('q', 10),
            new Letter('a', 1),
            new Letter('g', 2),
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('e', 1),
            new Letter('s', 1),
        ];
        const putBackLetterSpy = spyOn(rackServiceSpy.letterBank, 'putBackLetter').and.callThrough();
        const envoyer = 'q';
        const returnV = replace.executeCommand(envoyer);
        expect(putBackLetterSpy).toHaveBeenCalled();
        expect(returnV).toEqual('Lettres "' + 'q' + '" échangées');
    });
});
