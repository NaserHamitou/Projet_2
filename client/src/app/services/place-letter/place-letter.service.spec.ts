/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as CONSTANTS from '@app/constants';
import { UserInput } from '@app/interfaces/user-input';
import { Letter } from '@app/letter';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
// eslint-disable-next-line no-restricted-imports
import { WordValidatorService } from '../word-validator/word-validator.service';
import { PlaceLetterService } from './place-letter.service';

export class MockGameModeService {
    isPlayingSolo = true;
}

fdescribe('PlaceLetterService', () => {
    let service: PlaceLetterService;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([{ path: 'game', component: GamePageComponent }])],
            providers: [WordValidatorService],
        });
        service = TestBed.inject(PlaceLetterService);
        ctxStub = CanvasTestHelper.createCanvas(CONSTANTS.DEFAULT_WIDTH_BOARD, CONSTANTS.DEFAULT_WIDTH_BOARD).getContext(
            '2d',
        ) as CanvasRenderingContext2D;
        service.canvasContext = ctxStub;
        service.tempCanvasContext = ctxStub;
        spyOn(service.wordValidatorService, 'formWord').and.callFake(() => {
            return [new Letter('a', 1), new Letter('b', 1), new Letter('c', 1)];
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('displayPlayer2 should display the letter by calling the proper methods', () => {
        service.socketService.isHost = false;
        const spy = spyOn(service, 'keepLetterOnBoard').and.callFake(() => {
            return;
        });
        const rack: Letter[] = [new Letter('d', 1), new Letter('e', 1), new Letter('f', 1)];
        service.displayPlayer2(rack, 1);
        expect(spy).toHaveBeenCalled();
    });

    it('displayPlayer1 should display the letter by calling the proper methods', () => {
        service.socketService.isHost = false;
        const spy = spyOn(service, 'keepLetterOnBoard').and.callFake(() => {
            return;
        });
        const mockUserInput = {
            row: 'h',
            col: 8,
            direction: 'h',
            word: 'a',
        } as UserInput;
        service.displayPlayer1(1, mockUserInput);
        expect(spy).toHaveBeenCalled();
    });

    it('cancel should cancel the play by calling the proper methods', () => {
        service.socketService.isHost = false;
        const spy = spyOn(service, 'waitAndCancel').and.callFake(() => {
            return;
        });
        const rack: Letter[] = [new Letter('d', 1), new Letter('e', 1), new Letter('f', 1)];
        const rack2: Letter[] = [new Letter('d', 1), new Letter('e', 1), new Letter('f', 1)];
        service.cancelPlayer2(rack, rack2);
        expect(spy).toHaveBeenCalled();
    });

    it('player2Validation should verify the input if is host', () => {
        service.socketService.isHost = true;
        spyOn(service.wordValidatorService, 'copyGrid').and.callFake(() => {
            return;
        });
        spyOn(service.placementService, 'validatePlacementV2').and.returnValue(true);
        spyOn(service.wordValidatorService, 'validateWord').and.returnValue(true);
        spyOn(service, 'hasRequiredLetters').and.returnValue(true);
        spyOn(service, 'serverValidation').and.callFake(() => {});
        spyOn(service.pointsCalculatorService, 'calculatePoints').and.returnValue(3);
        service.serverValidate = true;
        const earnedSpy = spyOn(service.pointsCalculatorService, 'changePoints').and.callFake(() => {
            return;
        });
        const mockUserInput = {
            row: 'h',
            col: 8,
            direction: 'h',
            word: 'a',
        } as UserInput;
        const rack: Letter[] = [new Letter('d', 1), new Letter('e', 1), new Letter('f', 1)];
        service.player2Validation(mockUserInput, rack);
        expect(earnedSpy).toHaveBeenCalled();
    });

    it('player2Validation should verify the input if is host', () => {
        service.socketService.isHost = true;
        spyOn(service.wordValidatorService, 'copyGrid').and.callFake(() => {
            return;
        });
        spyOn(service.placementService, 'validatePlacementV2').and.returnValue(true);
        spyOn(service.wordValidatorService, 'validateWord').and.returnValue(true);
        spyOn(service, 'hasRequiredLetters').and.returnValue(true);
        spyOn(service, 'serverValidation').and.callFake(() => {});
        service.serverValidate = true;
        const earnedSpy = spyOn(service.pointsCalculatorService, 'calculatePoints').and.callFake(() => {
            return 3;
        });
        const mockUserInput = {
            row: 'h',
            col: 8,
            direction: 'h',
            word: 'a',
        } as UserInput;
        const rack: Letter[] = [new Letter('d', 1), new Letter('e', 1), new Letter('f', 1)];
        service.player2Validation(mockUserInput, rack);
        expect(earnedSpy).toHaveBeenCalled();
    });

    it('player2Validation should verify the input if is host', () => {
        service.socketService.isHost = true;
        const spy = spyOn(service.wordValidatorService, 'copyGrid').and.callFake(() => {
            return;
        });
        spyOn(service, 'serverValidation').and.callFake(() => {});
        const mockUserInput = {
            row: 'h',
            col: 8,
            direction: 'h',
            word: 'a',
        } as UserInput;
        const rack: Letter[] = [new Letter('d', 1), new Letter('e', 1), new Letter('f', 1)];
        service.player2Validation(mockUserInput, rack);
        expect(spy).toHaveBeenCalled();
    });

    it('player2Validation should verify the input if is host', () => {
        service.socketService.isHost = true;
        const spyRequire = spyOn(service, 'hasRequiredLetters');
        spyOn(service, 'serverValidation').and.callFake(() => {});
        const mockUserInput = {
            row: 'h',
            col: 8,
            direction: 'h',
            word: 'a',
        } as UserInput;
        const rack: Letter[] = [new Letter('d', 1), new Letter('e', 1), new Letter('f', 1)];
        service.player2Validation(mockUserInput, rack);
        expect(spyRequire).toHaveBeenCalled();
    });

    it('player2Validation should reconstruct the array', () => {
        const spy = spyOn(service.rackService, 'reconstructLetterArray');
        const mockUserInput = {
            row: 'h',
            col: 8,
            direction: 'h',
            word: 'a',
        } as UserInput;
        const rack: Letter[] = [new Letter('d', 1), new Letter('e', 1), new Letter('f', 1)];
        service.player2Validation(mockUserInput, rack);
        expect(spy).toHaveBeenCalled();
    });

    it('playTheWord when is host  or playing solo 1', () => {
        service.socketService.isHost = true;
        const spy = spyOn(service.wordValidatorService, 'copyGrid').and.callFake(() => {
            return;
        });
        spyOn(service, 'serverValidation').and.callFake(() => {});
        service.playTheWord();
        expect(spy).toHaveBeenCalled();
    });

    it('playTheWord when is host  and playing solo 2', () => {
        service.socketService.isHost = true;
        service.gameModeService.isPlayingSolo = true;
        spyOn(service.wordValidatorService, 'copyGrid').and.callFake(() => {
            return;
        });
        spyOn(service.placementService, 'validatePlacementV2').and.returnValue(true);
        spyOn(service.wordValidatorService, 'validateWord').and.returnValue(true);
        spyOn(service, 'hasRequiredLetters').and.returnValue(true);
        spyOn(service, 'serverValidation').and.callFake(() => {});
        spyOn(service.pointsCalculatorService, 'calculatePoints').and.callFake(() => {
            return 1;
        });
        service.playTheWord();
    });

    it('playTheWord when validation dont pass', () => {
        service.socketService.isHost = true;
        service.gameModeService.isPlayingSolo = true;
        spyOn(service.wordValidatorService, 'copyGrid').and.callFake(() => {
            return;
        });
        spyOn(service.placementService, 'validatePlacementV2').and.returnValue(false);
        spyOn(service.wordValidatorService, 'validateWord').and.returnValue(false);
        spyOn(service, 'hasRequiredLetters').and.returnValue(false);
        spyOn(service, 'serverValidation').and.callFake(() => {});
        spyOn(service, 'waitAndCancel').and.callFake(() => {
            return;
        });
        service.playTheWord();
    });

    it('hasRequiredLetters should find the required letters', () => {
        const rack: Letter[] = [new Letter('d', 1), new Letter('e', 1), new Letter('f', 1)];
        const rack2: Letter[] = [new Letter('d', 1), new Letter('e', 1), new Letter('f', 1)];
        const val = service.hasRequiredLetters(rack, rack2);
        expect(val).toBeTrue();
    });

    it('hasRequiredLetters should not find the required letters', () => {
        const rack: Letter[] = [new Letter('d', 1), new Letter('e', 1), new Letter('f', 1)];
        const rack2: Letter[] = [new Letter('x', 1), new Letter('x', 1), new Letter('x', 1)];
        const val = service.hasRequiredLetters(rack, rack2);
        expect(val).toBeFalse();
    });

    it('eraseTile set to horizontal', () => {
        service.tempCanvasContext = ctxStub;
        const spy = spyOn(service.tempCanvasContext, 'clearRect');
        service.eraseTile(0, 0, 'h');
        expect(spy).toHaveBeenCalled();
    });

    it('eraseTile set to vertical', () => {
        service.tempCanvasContext = ctxStub;
        const spy = spyOn(service.tempCanvasContext, 'clearRect');
        service.eraseTile(0, 0, 'v');
        expect(spy).toHaveBeenCalled();
    });

    it('highLightCase set to vertical', () => {
        service.tempCanvasContext = ctxStub;
        const spy = spyOn(service.tempCanvasContext, 'beginPath');
        service.highLightCase({ x: 0, y: 0 }, 'v');
        expect(spy).toHaveBeenCalled();
    });

    it('highLightCase set to vertical', () => {
        service.tempCanvasContext = ctxStub;
        const spy = spyOn(service.tempCanvasContext, 'beginPath');
        service.highLightCase({ x: 0, y: 0 }, 'h');
        expect(spy).toHaveBeenCalled();
    });

    it('should set orientation to vert', () => {
        service.orientation = 'v';
        service.word = 'a';
        const spy = spyOn(service, 'drawOnTempCanvas');
        service.placeLettersOnBoard();
        expect(spy).toHaveBeenCalled();
    });

    it('drawLettersOnGrid should call functions', () => {
        service.drawLettersOnGrid(0, 0, 'a');
        expect(service.canvasContext.font).toBe('20px Arial');
    });

    it('waitAndCancel should be call removeLetter and putBackInRack', () => {
        jasmine.clock().install();
        const spyRemove = spyOn(service, 'removeLetterOnGrid');
        const spyRack = spyOn(service.rackService, 'putBackInRack').and.callFake(() => {});
        const time = 3050;
        service.waitAndCancel([new Letter('a', 1)]);
        jasmine.clock().tick(time);
        expect(spyRemove).toHaveBeenCalled();
        expect(spyRack).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('waitAndCancelVirtual should wait 3seconds and call removeLetter', () => {
        jasmine.clock().install();
        const spy = spyOn(service, 'removeLetterOnGrid');
        const time = 3050;
        service.waitAndCancelVirtual();
        jasmine.clock().tick(time);
        expect(spy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('playTheWord should not call the wait and cancel function if is not playing', () => {
        spyOn(service.placementService, 'validatePlacementV2').and.returnValue(false);
        spyOn(service.wordValidatorService, 'validateWord').and.returnValue(false);
        service.gameState.isPlaying = false;
        const spy = spyOn(service, 'waitAndCancel');
        service.playTheWord();
        expect(spy).not.toHaveBeenCalled();
    });

    it('virtualPlayer should call functions to play', () => {
        const mockUserInput = {
            row: 'h',
            col: 8,
            direction: 'h',
            word: 'a',
        } as UserInput;
        spyOn(service, 'placeLettersOnBoard');
        spyOn(service, 'waitAndCancelVirtual');
        service.virtualPlay(mockUserInput);
    });

    it('keepLetterOnBoard should call all the necessary functions', () => {
        service.word = 'a';
        service.orientation = 'v';
        const findPosSpy = spyOn(service.gridCoordService, 'findPosition').and.returnValue({ x: 200, y: 200 });
        const drawSpy = spyOn(service, 'drawLettersOnGrid');
        const removeSpy = spyOn(service, 'removeLetterOnGrid');
        service.keepLetterOnBoard();
        expect(findPosSpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();
    });

    it('keepLetterOnBoard should call all the necessary functions', () => {
        service.word = 'a';
        service.orientation = 'h';
        const findPosSpy = spyOn(service.gridCoordService, 'findPosition').and.returnValue({ x: 200, y: 200 });
        const drawSpy = spyOn(service, 'drawLettersOnGrid');
        const removeSpy = spyOn(service, 'removeLetterOnGrid');
        service.keepLetterOnBoard();
        expect(findPosSpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();
    });
});
