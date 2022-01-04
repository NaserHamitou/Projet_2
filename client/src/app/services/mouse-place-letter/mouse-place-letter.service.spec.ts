/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Letter } from '@app/letter';
import { PlaceLetterService } from '@app/services/place-letter/place-letter.service';
import { MousePlaceLetterService } from './mouse-place-letter.service';

fdescribe('MousePlaceLetterService', () => {
    let service: MousePlaceLetterService;
    let ctxStub: CanvasRenderingContext2D;
    let ctxStubTemp: CanvasRenderingContext2D;

    const mouseEvent: MouseEvent = {
        offsetX: 100,
        offsetY: 100,
    } as MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([])],
            providers: [PlaceLetterService],
        });
        service = TestBed.inject(MousePlaceLetterService);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        ctxStub = CanvasTestHelper.createCanvas(600, 600).getContext('2d') as CanvasRenderingContext2D;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        ctxStubTemp = CanvasTestHelper.createCanvas(600, 600).getContext('2d') as CanvasRenderingContext2D;
        service.placeLetterService.canvasContext = ctxStub;
        service.placeLetterService.tempCanvasContext = ctxStubTemp;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('writeOnBoard should have the right orientation', () => {
        service.isClicked = false;
        service.orientaion = 'v';
        const keyEvent: KeyboardEvent = {
            key: 'a',
        } as KeyboardEvent;
        service.writeOnBoard(keyEvent);
    });

    it('verifyInRack should return false if the rack is empty', () => {
        service.rackService.letterRack.push(new Letter('a', 1));
        spyOn(service.rackService, 'takeFromRack').and.returnValue([]);
        const result = service.verifyInRack('a');
        expect(result).toBeFalse();
    });

    it('verifyPosition should return false if the position is taken', () => {
        service.letterPlacement.lettersGrid[2].push(new Letter('x', 1));
        service.letterPlacement.lettersGrid[2].push(new Letter('b', 1));
        service.letterPlacement.lettersGrid[2].push(new Letter('c', 1));
        const result = service.verifyPosition({ x: 40, y: 40 });
        expect(result).toBeFalse();
    });

    it('mouseSelect should return if the position is bad', () => {
        const mouseEventTest: MouseEvent = {
            offsetX: 100,
            offsetY: 100,
            button: 0,
        } as MouseEvent;
        const spy = spyOn(service, 'verifyPosition').and.returnValue(false);
        service.mouseSelect(mouseEventTest);
        expect(spy).toHaveBeenCalled();
    });

    it('eraseLetterOnBoard should call backWardChecking', () => {
        const spyBackWard = spyOn(service, 'backWardChecking').and.callFake(() => {});
        const spyErase = spyOn(service.placeLetterService, 'eraseTile').and.callFake(() => {});
        const spyMouse = spyOn(service.mousePositionService, 'mouseSelectCase').and.callFake(() => {
            return '';
        });
        const spyHighLight = spyOn(service.placeLetterService, 'highLightCase').and.callFake(() => {});
        const spyRack = spyOn(service.rackService, 'putOneInRack').and.callFake(() => {});
        service.orientaion = 'v';
        service.eraseLetterOnBoard(0, 1);
        expect(spyBackWard).toHaveBeenCalled();
        expect(spyErase).toHaveBeenCalled();
        expect(spyMouse).toHaveBeenCalled();
        expect(spyHighLight).toHaveBeenCalled();
        expect(spyRack).toHaveBeenCalled();
    });

    it('eraseLetterOnBoard should call backWardChecking if horizontal', () => {
        const spyBackWard = spyOn(service, 'backWardChecking').and.callFake(() => {});
        spyOn(service.placeLetterService, 'eraseTile').and.callFake(() => {});
        spyOn(service.mousePositionService, 'mouseSelectCase').and.callFake(() => {
            return '';
        });
        spyOn(service.placeLetterService, 'highLightCase').and.callFake(() => {});
        spyOn(service.rackService, 'putOneInRack').and.callFake(() => {});
        service.orientaion = 'h';
        service.eraseLetterOnBoard(0, 1);
        expect(spyBackWard).toHaveBeenCalled();
    });

    it('eraseLetterOnBoard should set isTyping to false if offset is at 40', () => {
        spyOn(service, 'backWardChecking').and.callFake(() => {});
        spyOn(service.placeLetterService, 'eraseTile').and.callFake(() => {});
        spyOn(service.mousePositionService, 'mouseSelectCase').and.callFake(() => {
            return '';
        });
        spyOn(service.placeLetterService, 'highLightCase').and.callFake(() => {});
        spyOn(service.rackService, 'putOneInRack').and.callFake(() => {});
        service.orientaion = 'h';
        service.keyOffset = 40;
        service.eraseLetterOnBoard(0, 1);
        expect(service.isTyping).toBeFalse();
    });

    it('backWardChecking should remove a letter', () => {
        service.letterPlacement.getGrid()[1][1] = new Letter('a', 1);
        service.letters.push(new Letter('a', 1));
        service.backWardChecking(0, 0);
        expect(service.letters.length).toBe(0);
    });

    it('verify should return false if rack is empty', () => {
        const emptyLetter = [] as Letter[];
        spyOn(service.rackService, 'takeFromRack').and.returnValue(emptyLetter);
        const value = service.verifyInRack('a');
        expect(value).toBeFalse();
    });

    it('mouseSelect sets isTyping to false if keyOffset is 0 or less and isTyping is true', () => {
        service.keyOffset = 0;
        service.isTyping = true;
        service.mouseSelect(mouseEvent);
        const value = service.isTyping;
        expect(value).toBeFalse();
    });

    it('mouseSelect dont change anything if keyOffset greater than 0 and isTyping is true', () => {
        service.isTyping = true;
        service.keyOffset = 40;
        service.mouseSelect(mouseEvent);
        const value = service.isTyping;
        const offset = service.keyOffset;
        expect(value).toBeTrue();
        expect(offset).toBeGreaterThan(0);
    });

    it('mouseSelect should call the necessary functions if right click', () => {
        const clickEvent: MouseEvent = {
            button: 0,
            offsetX: 200,
            offsetY: 200,
        } as MouseEvent;
        service.initPosition = { x: 200, y: 200 };
        service.isTyping = false;
        service.keyOffset = 0;
        spyOn(service.gridCoord, 'findColumAndRow').and.returnValue({ x: 'h', y: '8' });
        const spyRemove = spyOn(service.placeLetterService, 'removeLetterOnGrid');
        const spyCalculPos = spyOn(service.mousePositionService, 'calculatePosition');
        const spyMouseSelect = spyOn(service.mousePositionService, 'mouseSelectCase');
        service.mouseSelect(clickEvent);
        expect(spyRemove).toHaveBeenCalled();
        expect(spyCalculPos).toHaveBeenCalled();
        expect(spyMouseSelect).toHaveBeenCalled();
    });

    it('mouseSelect should not call the necessary functions if right click', () => {
        const clickEvent: MouseEvent = {
            button: 3,
        } as MouseEvent;
        service.isTyping = false;
        service.keyOffset = 0;
        const spyRemove = spyOn(service.placeLetterService, 'removeLetterOnGrid');
        const spyCalculPos = spyOn(service.mousePositionService, 'calculatePosition');
        service.mouseSelect(clickEvent);
        expect(spyRemove).not.toHaveBeenCalled();
        expect(spyCalculPos).not.toHaveBeenCalled();
    });

    it('writeOnBoard should return right away if not a letter or a backspace was entered', () => {
        const shiftKey: KeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.orientaion = '';
        service.writeOnBoard(shiftKey);
        const orientatinExpected = service.orientaion;
        expect(orientatinExpected).toBe('');
    });

    it('writeOnBoard should set isTyping to false if user hits Backspace while there is 0 letters on the board', () => {
        const backspaceKey: KeyboardEvent = {
            key: 'Backspace',
        } as KeyboardEvent;
        service.isTyping = true;
        service.keyOffset = 0;
        service.writeOnBoard(backspaceKey);
        const typingExpected = service.isTyping;
        expect(typingExpected).toBeFalse();
    });

    it('writeOnBoard should call eraseLetterOnBoard', () => {
        const backspaceKey: KeyboardEvent = {
            key: 'Backspace',
        } as KeyboardEvent;
        service.usedLetters.push(new Letter('a', 1));
        service.isTyping = true;
        service.keyOffset = 80;
        service.orientaion = 'h';
        service.tilePosition = { x: 200, y: 200 };
        const spyErase = spyOn(service, 'eraseLetterOnBoard').and.callFake(() => {});
        service.writeOnBoard(backspaceKey);
        expect(spyErase).toHaveBeenCalled();
    });

    it('writeOnBoard should increment offset by 40 when writing a letter', () => {
        const eventKey: KeyboardEvent = {
            key: 'a',
        } as KeyboardEvent;
        service.letters.push(new Letter('a', 1));
        service.isTyping = true;
        service.isClicked = true;
        service.keyOffset = 80;
        service.orientaion = 'h';
        service.tilePosition = { x: 200, y: 200 };
        service.writeOnBoard(eventKey);
        const typingValue = service.isTyping;
        spyOn(service, 'verifyInRack').and.returnValue(true);
        expect(typingValue).toBe(true);
    });

    it('frontChecking check the grid', () => {
        service.letterPlacement.lettersGrid.push([]);
        service.letterPlacement.lettersGrid[2].push(new Letter('a', 1));
        service.letterPlacement.lettersGrid[2].push(new Letter('a', 1));
        service.letterPlacement.lettersGrid[2].push(new Letter('a', 1));
        service.letterPlacement.lettersGrid[2].push(new Letter('a', 1));
        service.letterPlacement.lettersGrid[2].push(new Letter('a', 1));
        service.letterPlacement.lettersGrid[2].push(new Letter('a', 1));
        service.letterPlacement.lettersGrid[2].push(new Letter('a', 1));
        service.index = 1;
        spyOn(service, 'positionOnGrid').and.returnValue({ posX: 1, posY: 1 });
        service.frontChecking(0, 1);
        expect(service.index).toBe(2);
    });

    it('frontChecking check the grid', () => {
        service.letterPlacement.lettersGrid.push([]);
        service.letterPlacement.lettersGrid[3].push(new Letter('a', 1));
        service.letterPlacement.lettersGrid[3].push(new Letter('a', 1));
        service.letterPlacement.lettersGrid[3].push(new Letter('a', 1));
        service.letterPlacement.lettersGrid[3].push(new Letter('a', 1));
        service.letterPlacement.lettersGrid[3].push(new Letter('a', 1));
        service.letterPlacement.lettersGrid[3].push(new Letter('a', 1));
        service.letterPlacement.lettersGrid[3].push(new Letter('a', 1));
        service.index = 1;
        service.letters.push(new Letter('a', 1));
        spyOn(service, 'positionOnGrid').and.returnValue({ posX: 3, posY: 3 });
        service.backWardChecking(0, 1);
        expect(service.letters.length).toBeLessThan(1);
    });

    it('verifyInRack should return false if rack is empty', () => {
        service.rackService.letterRack = [];
        const value = service.verifyInRack('a');
        expect(value).toBeFalse();
    });

    it('verifyInRack should return false if letter array is empty', () => {
        service.rackService.letterRack = [new Letter('a', 1)];
        service.letters = [];
        service.letters.push(new Letter('a', 2));
        const value = service.verifyInRack('a');
        expect(value).toBeTrue();
    });

    it('writeOnBoard should not write if is not clicked', () => {
        const eventKey: KeyboardEvent = {
            key: 'a',
        } as KeyboardEvent;
        service.letters.push(new Letter('a', 1));
        service.isTyping = true;
        service.isClicked = false;
        service.keyOffset = 80;
        service.orientaion = 'h';
        service.tilePosition = { x: 200, y: 200 };
        service.writeOnBoard(eventKey);
        const typingValue = service.keyOffset;
        const oldValue = 80;
        expect(typingValue).toBe(oldValue);
    });

    it('writeOnBoard should not write if verifyInRack returns false', () => {
        const eventKey: KeyboardEvent = {
            key: 'a',
        } as KeyboardEvent;
        service.letters.push(new Letter('a', 1));
        service.isTyping = true;
        service.isClicked = true;
        service.keyOffset = 80;
        service.orientaion = 'h';
        service.tilePosition = { x: 200, y: 200 };
        spyOn(service, 'verifyInRack').and.returnValue(false);
        service.writeOnBoard(eventKey);
        const typingValue = service.keyOffset;
        const oldValue = 80;
        expect(typingValue).toBe(oldValue);
    });

    it('writeOnBoard should call mouseSelectCase', () => {
        const eventKey: KeyboardEvent = {
            key: 'a',
        } as KeyboardEvent;
        service.letters.push(new Letter('a', 1));
        service.isTyping = true;
        service.isClicked = true;
        service.keyOffset = 80;
        service.orientaion = 'h';
        service.tilePosition = { x: 200, y: 200 };
        service.writeOnBoard(eventKey);
        const spy = spyOn(service.mousePositionService, 'mouseSelectCase');
        spyOn(service, 'verifyInRack').and.returnValue(true);
        service.writeOnBoard(eventKey);
        expect(spy).toHaveBeenCalled();
    });
});
