/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketMock } from '@app/classes/socket-test-helper';
import { SocketService } from '@app/services/sockets/socket.service';
import { GameStateService } from './game-state.service';

fdescribe('GameStateService', () => {
    let service: GameStateService;
    let socketMock: SocketMock;

    beforeEach(async () => {
        socketMock = new SocketMock();
        const socketService = jasmine.createSpyObj('SocketService', {}, { isHost: false, socket: socketMock });
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [{ provide: SocketService, useValue: socketService }],
        }).compileComponents();
    });

    beforeEach(() => {
        service = TestBed.inject(GameStateService);
        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('multiplayerOn should receive resetTime signal', () => {
        const spy = spyOn(service, 'resetTimer').and.callFake(() => {});
        const spyInit = spyOn(service, 'init').and.callFake(() => {});
        service.multiplayerOn();
        socketMock.emit('resetTimer');
        expect(spyInit).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(service.isPlaying).toBeTrue();
    });

    it('passedRound should increment the pass count', () => {
        service.passedCounter = 0;
        service.passedRound();
        expect(service.passedCounter).toBe(1);
    });

    it('emitReset should emit a reset', () => {
        let received = false;
        socketMock.on('TimerReset', () => {
            received = true;
        });
        spyOn(service, 'resetTimer').and.callFake(() => {});
        service.emitReset();
        expect(received).toBeTrue();
    });

    it('resetTimer should reset the timer', () => {
        const spy = spyOn(service, 'startTimer');
        service.isPlaying = true;
        service.resetTimer();
        expect(spy).toHaveBeenCalled();
        expect(service.isPlaying).toBeFalse();
    });

    it('clearTimer should clear the timer', () => {
        service.clearTimer();
        expect(service.timeLeft).toBe(60);
        expect(service.timerTime).toBe(60);
    });

    it('isHost should isPlaying', () => {
        service.socketService.isHost = false;
        service.init();
        const HALF_SECOND = 505;
        jasmine.clock().tick(HALF_SECOND);
        expect(service.isPlaying).toBe(false);
    });

    it(' startTimer should call timer function after 1 second', () => {
        const spy = spyOn(service, 'timer');
        service.startTimer();
        const ONE_SECOND = 1005;
        jasmine.clock().tick(ONE_SECOND);
        expect(spy).toHaveBeenCalled();
    });

    it('timer should decrement timeLeft by one if its positive', () => {
        service.timeLeft = 5;
        const value = service.timeLeft - 1;
        service.timer();
        expect(service.timeLeft).toBe(value);
    });

    it('timer should call resetTimer if timeLeft is 0', () => {
        service.timeLeft = 0;
        const spy = spyOn(service, 'resetTimer');
        service.timer();
        expect(spy).toHaveBeenCalled();
    });
});
