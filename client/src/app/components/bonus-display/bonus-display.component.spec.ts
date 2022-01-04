/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-empty-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketMock } from '@app/classes/socket-test-helper';
import { Objective } from '@app/interfaces/objective';
import { ObjectivesService } from '@app/services/objectives/objectives.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { BonusDisplayComponent } from './bonus-display.component';

fdescribe('BonusDisplayComponent', () => {
    let component: BonusDisplayComponent;
    let fixture: ComponentFixture<BonusDisplayComponent>;
    let socketMock: SocketMock;

    beforeEach(async () => {
        socketMock = new SocketMock();
        const socketService = jasmine.createSpyObj('SocketService', {}, { isHost: false, socket: socketMock });
        await TestBed.configureTestingModule({
            declarations: [BonusDisplayComponent],
            providers: [{ provide: SocketService, useValue: socketService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BonusDisplayComponent);
        const service = TestBed.inject(ObjectivesService);
        const bonus = {
            points: 1,
            completed: '',
            isCompleted: false,
            description: '',
            name: '',
            activate: () => {},
            verify: () => true,
        } as Objective;
        service['publicBonus'] = [bonus, bonus, bonus];
        service['privateBonus'] = bonus;
        service['secondPlayerBonus'] = bonus;
        service['objectivesList'] = [bonus, bonus, bonus, bonus];
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('verificationSteps verify player 1 objectives', () => {
        const spy = spyOn(component.objectivesService.pointsCalculatorService, 'changePoints').and.callFake(() => {});
        component.verificationSteps();
        component.objectivesService.setIsPlayValid(true);
        expect(spy).toHaveBeenCalled();
    });

    it('verificationSteps verify player 2 objectives', () => {
        let received = false;
        socketMock.on('privateCompletPlayer2', () => {
            received = true;
        });
        spyOn(component.objectivesService.secondPlayerBonus, 'verify').and.returnValue(true);
        component.verificationSteps();
        component.objectivesService.setIsPlayValid(false);
        expect(received).toBeTrue();
    });

    it('verificationSteps verify public  objectives', () => {
        let received2 = false;
        socketMock.on('public2CompletPlayer1', () => {
            received2 = true;
        });
        spyOn(component.objectivesService.publicBonus[1], 'verify').and.returnValue(true);
        component.verificationSteps();
        component.objectivesService.setIsPlayValid(true);
        expect(received2).toBeTrue();
    });

    it('should secondClientSetUp be called if is not host and not solo mode', () => {
        component.gameMode.isPlayingSolo = false;
        const spy = spyOn(component, 'secondClientSetUp').and.callFake(() => {});
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should mainClientSetUp be called if is host or solo mode', () => {
        component.gameMode.isPlayingSolo = true;
        const spy = spyOn(component, 'mainClientSetUp').and.callFake(() => {});
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('mainClientSetUp should should return if playing solo', () => {
        let receivedPublic = false;
        let receivedPrivate = false;
        socketMock.on('sendPublic', () => {
            receivedPublic = true;
        });
        socketMock.on('sendPrivate', () => {
            receivedPrivate = true;
        });
        component.gameMode.isPlayingSolo = true;
        component.mainClientSetUp();
        expect(receivedPublic).toBeFalse();
        expect(receivedPrivate).toBeFalse();
    });

    it('mainClientSetUp should emit the objectives to the server', () => {
        let receivedPublic = false;
        let receivedPrivate = false;
        socketMock.on('sendPublic', () => {
            receivedPublic = true;
        });
        socketMock.on('sendPrivate', () => {
            receivedPrivate = true;
        });
        component.mainClientSetUp();
        expect(receivedPublic).toBeTrue();
        expect(receivedPrivate).toBeTrue();
    });

    it('secondClientSetUp should receive the objectives', () => {
        const bonus = {
            name: '',
            description: '',
            completed: '',
            isCompleted: false,
            points: 1,
        };
        component.secondClientSetUp();
        socketMock.emit('ReceivePrivateObjective', bonus);
        socketMock.emit('ReceivePublicObjective', bonus, bonus);
    });

    it('secondClientSetUp should receive the points for player2', () => {
        const spy = spyOn(component.objectivesService.pointsCalculatorService, 'changePoints').and.callFake(() => {});
        component.secondClientSetUp();
        socketMock.emit('privateCompletedP2', 5);
        socketMock.emit('public1CompletedP2', 5);
        socketMock.emit('public2CompletedP2', 5);
        expect(spy).toHaveBeenCalledTimes(6);
    });

    it('secondClientSetUp should receive the points for player1', () => {
        const spy = spyOn(component.objectivesService.pointsCalculatorService, 'changePoints').and.callFake(() => {});
        component.secondClientSetUp();
        socketMock.emit('updateP1score', 5);
        socketMock.emit('public1CompletedP1', 5);
        socketMock.emit('public2CompletedP1', 5);
        expect(spy).toHaveBeenCalledTimes(6);
    });
});
