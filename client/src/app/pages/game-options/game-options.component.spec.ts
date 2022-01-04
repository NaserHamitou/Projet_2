/* eslint-disable @typescript-eslint/no-empty-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketMock } from '@app/classes/socket-test-helper';
import { SocketService } from '@app/services/sockets/socket.service';
import { GameOptionsComponent } from './game-options.component';

fdescribe('GameOptionsComponent', () => {
    let component: GameOptionsComponent;
    let fixture: ComponentFixture<GameOptionsComponent>;
    let socketMock: SocketMock;

    beforeEach(async () => {
        socketMock = new SocketMock();
        const socketService = jasmine.createSpyObj('SocketService', {}, { isHost: false, socket: socketMock });
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([])],
            providers: [{ provide: SocketService, useValue: socketService }],
            declarations: [GameOptionsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should ngOnInit', () => {
        component.ngOnInit();
        expect(component.gameModeService.isPlayingSolo).toBe(false);
    });

    it('ngOnInit should connect to server', () => {
        socketMock.emit('connect');
    });

    it('ngOnInit should receive best scores from server', () => {
        const spy = spyOn(component, 'setClassicScore').and.callFake(() => {});
        const spy2 = spyOn(component, 'setLogScore').and.callFake(() => {});
        component.getBestScores();
        const score1 = { playerName: 'player1', score: 1 };
        socketMock.emit('bestScore', [score1], [score1]);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    /* it('setClassicScore should add the scores to array', () => {
        const score1 = { playerName: 'player1', score: 1 };
        const score2 = { playerName: 'player1', score: 1 };
        const score3 = { playerName: 'player1', score: 1 };
        const score4 = { playerName: 'player1', score: 1 };
        component.setClassicScore([score1, score2, score3, score4]);
        expect(component.listClassique).toBeGreaterThan(0);
    });

    it('setLogScore should add the scores to array', () => {
        const score1 = { playerName: 'player1', score: 1 };
        const score2 = { playerName: 'player1', score: 1 };
        const score3 = { playerName: 'player1', score: 1 };
        const score4 = { playerName: 'player1', score: 1 };
        component.setLogScore([score1, score2, score3, score4]);
        expect(component.listLog).toBeGreaterThan(0);
    }); */

    it('should setSingleplayer', () => {
        component.setSingleplayer();
        expect(component.gameModeService.isPlayingSolo).toBe(true);
    });

    it('should setMultiplayer', () => {
        component.setMultiplayer();
        expect(component.gameModeService.isPlayingSolo).toBe(false);
    });

    it('getBestScores should send signal to server to send the scores', () => {
        let received = false;
        socketMock.on('askbestScore', () => {
            received = true;
        });
        component.getBestScores();
        expect(received).toBeTrue();
        expect(component.mainPage).toBe('none');
        expect(component.bestScore).toBe('block');
    });

    it('clearscores should set the array empty', () => {
        spyOn(component, 'reload').and.callFake(() => {});
        component.clearscores();
        expect(component.scorClassique.length).toBe(0);
        expect(component.nameClassique.length).toBe(0);
    });
});
