/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketMock } from '@app/classes/socket-test-helper';
import { Letter } from '@app/letter';
import { SocketService } from '@app/services/sockets/socket.service';
import { RackService } from './rack.service';

fdescribe('RackService', () => {
    let service: RackService;
    let socketMock: SocketMock;
    socketMock = new SocketMock();
    const socketService = jasmine.createSpyObj('SocketService', {}, { isHost: true, socket: socketMock });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [{ provide: SocketService, useValue: socketService }],
        }).compileComponents();
    });

    beforeEach(() => {
        service = TestBed.inject(RackService);
        service.letterRack = [
            new Letter('a', 1),
            new Letter('b', 1),
            new Letter('c', 1),
            new Letter('d', 1),
            new Letter('e', 1),
            new Letter('f', 1),
            new Letter('g', 1),
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initRack should emit signal not host', () => {
        (Object.getOwnPropertyDescriptor(socketService, 'isHost')?.get as jasmine.Spy<() => boolean>).and.returnValue(false);
        let received = false;
        service.gameModeService.isPlayingSolo = false;
        socketMock.on('GetInitialRack', () => {
            received = true;
        });
        service.initRack();
        expect(received).toBeTrue();
    });

    it('initRack receive signal GetRackFromBank', () => {
        (Object.getOwnPropertyDescriptor(socketService, 'isHost')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);
        service.gameModeService.isPlayingSolo = false;
        const spy = spyOn(service, 'fillOutRack').and.callFake(() => {});
        service.initRack();
        socketMock.emit('GetRackFromBank');
        expect(spy).toHaveBeenCalled();
    });

    it('initRack receive signal ReceiveRack', () => {
        (Object.getOwnPropertyDescriptor(socketService, 'isHost')?.get as jasmine.Spy<() => boolean>).and.returnValue(false);
        service.gameModeService.isPlayingSolo = false;
        spyOn(service, 'changeRack').and.callFake(() => {});
        const spy = spyOn(service, 'reconstructLetterArray').and.callFake(() => {
            return [];
        });
        service.initRack();
        socketMock.emit('ReceiveRack');
        expect(spy).toHaveBeenCalled();
    });

    it('initRack receive signal exchangeP2Clicked', () => {
        service.gameModeService.isPlayingSolo = false;
        service.initRack();
        socketMock.emit('exchangeP2Clicked');
        expect(service.noExchangeP2).toBe(0);
    });

    it('should select a letter correctly', () => {
        service.selectLetter(service.letterRack[0]);
        expect(service.letterRack[0].isSelected).toBeTruthy();
    });

    it('should initialize the rack', () => {
        service.socketService.isHost = false;
        service.gameModeService.isPlayingSolo = true;
        service.initRack();
        expect(service.letterRack).toBeTruthy();
    });

    it('should swap a letter using the scroll wheel', () => {
        const SCROLL_UP_VALUE = 100;
        const SCROLL_DOWN_VALUE = -100;

        service.selectLetter(service.letterRack[0]);
        service.wheelSwap(SCROLL_UP_VALUE);
        service.wheelSwap(SCROLL_DOWN_VALUE);
        expect(service.letterRack[0].getLetter()).toBe('a');
    });

    it('should select a letter using keys', () => {
        const KEYBOARD_INPUT = 'a';
        service.keyboardSelectLetter(KEYBOARD_INPUT);
        expect(service.letterRack[0].isSelected).toBeTruthy();
    });
    it('should select other instances of a same letter using keys', () => {
        const KEYBOARD_INPUT = 'a';
        service.letterRack = [
            new Letter('a', 1),
            new Letter('a', 1),
            new Letter('c', 1),
            new Letter('d', 1),
            new Letter('e', 1),
            new Letter('f', 1),
            new Letter('g', 1),
        ];
        service.keyboardSelectLetter(KEYBOARD_INPUT); // a at index 0
        service.keyboardSelectLetter(KEYBOARD_INPUT); // a at index 1
        service.keyboardSelectLetter(KEYBOARD_INPUT); // index 0
        service.keyboardSelectLetter(KEYBOARD_INPUT); // index 1
        expect(service.letterRack[1].isSelected).toBeTruthy();
    });
    it('should return the index of the letter corresponding to the pressed key', () => {
        const KEYBOARD_INPUT = 'a';
        service.keyboardSelectLetter(KEYBOARD_INPUT); // a at index 0
        service.keyboardSelectLetter(KEYBOARD_INPUT); // a at index 0
        expect(service.letterRack[0].isSelected).toBeTruthy();
    });
    it('should unselect all letters if the pressed key does not match with a letter on the rack', () => {
        const KEYBOARD_INPUT = 'v';
        service.keyboardSelectLetter(KEYBOARD_INPUT);
        expect(service.letterRack[0].isSelected).toBeFalse();
    });

    it('should swap letters using arrow keys', () => {
        const KEYBOARD_INPUT = 'ArrowLeft';
        service.selectLetter(service.letterRack[0]);
        service.keyboardSwap(KEYBOARD_INPUT);
        expect(service.letterRack[0].getLetter()).toBe('g');
    });
    it('should swap letters using arrow keys', () => {
        const KEYBOARD_INPUT = 'ArrowRight';
        service.selectLetter(service.letterRack[6]);
        service.keyboardSwap(KEYBOARD_INPUT);
        expect(service.letterRack[6].getLetter()).toBe('a');
    });

    it('should unselect letters if another key is input', () => {
        const KEYBOARD_INPUT = 'a';
        service.selectLetter(service.letterRack[6]);
        service.keyboardSwap(KEYBOARD_INPUT);
        expect(service.letterRack[6].isSelected).toBeFalse();
    });
    it('findLetterInRack should return -1 if the letter was not found', () => {
        const LETTER_TO_FIND = new Letter('x', 1);
        const index = service.findLetterInRack(LETTER_TO_FIND);
        expect(index).toBe(-1);
    });
    it('isLetter should return true for a letter in the alphabet', () => {
        const KEYBOARD_INPUT = 'a';
        const isLetter = service.isLetter(KEYBOARD_INPUT);
        expect(isLetter).toBeTruthy();
    });
    it('isLetter should return true for the * character', () => {
        const KEYBOARD_INPUT = '*';
        const isLetter = service.isLetter(KEYBOARD_INPUT);
        expect(isLetter).toBeTruthy();
    });
    it('takeFromRack should correctly remove letters from the player rack', () => {
        const lettersToRemove = 'ab';
        service.takeFromRack(lettersToRemove);
        expect(service.letterRack.length).toBe(5);
    });
    it('putBackInRack should return removed letters to the player rack', () => {
        service.letterRack = [new Letter('d', 1), new Letter('e', 1), new Letter('f', 1), new Letter('g', 1)];
        const lettersToPutBack = [new Letter('a', 1), new Letter('b', 1), new Letter('c', 1)];
        service.putBackInRack(lettersToPutBack);
        expect(service.letterRack.length).toBe(7);
    });
    it('putOneInRack should add a letter to the player rack', () => {
        service.letterRack = [new Letter('b', 1), new Letter('c', 1), new Letter('d', 1), new Letter('e', 1), new Letter('f', 1), new Letter('g', 1)];
        const letterToPutBack = new Letter('a', 1);
        service.putOneInRack(letterToPutBack);
        expect(service.letterRack.length).toBe(7);
    });
    it('reconstructLetterArray should recreate an array of letters', () => {
        const letterArray = [new Letter('a', 1), new Letter('a', 1), new Letter('c', 1)];
        const newArray = service.reconstructLetterArray(letterArray);
        expect(newArray.length).toBe(3);
    });

    it('fillOutRack should add letters to racks of sizes under 7 ', () => {
        service.letterRack = [new Letter('a', 1), new Letter('a', 1), new Letter('c', 1)];
        service.fillOutRack(service.letterRack);
        expect(service.letterRack.length).toBe(7);
    });

    // exchange functions

    it('should select a letter for exchange', () => {
        const mouseEvent = new MouseEvent('');
        service.selectForExchange(service.letterRack[0], mouseEvent);
        expect(service.letterRack[0].isSelectedExchange).toBeTruthy();
    });
    it('should remove an unselected letter from the selectedLetters array', () => {
        const mouseEvent = new MouseEvent('');
        service.selectForExchange(service.letterRack[0], mouseEvent);
        service.selectForExchange(service.letterRack[0], mouseEvent);
        expect(service.letterRack[0].isSelectedExchange).toBeFalse();
    });

    it('should exchange all selected letters for exchange', () => {
        service.selectedLetters = [new Letter('a', 1), new Letter('b', 1)];
        service.exchangeLetters();
        expect(service.selectedLetters.length).toBe(0);
    });
    it('should cancel an exchange', () => {
        service.selectedLetters = [new Letter('a', 1), new Letter('b', 1)];
        service.cancelExchange();
        expect(service.selectedLetters.length).toBe(0);
    });
});
