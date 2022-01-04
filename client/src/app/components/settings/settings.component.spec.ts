import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketMock } from '@app/classes/socket-test-helper';
import { SocketService } from '@app/services/sockets/socket.service';
import { SettingsComponent } from './settings.component';

fdescribe('SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;
    let socketMock: SocketMock;

    beforeEach(async () => {
        socketMock = new SocketMock();
        const socketService = jasmine.createSpyObj('SocketService', ['initializeSocket'], { isHost: true, socket: socketMock });
        await TestBed.configureTestingModule({
            declarations: [SettingsComponent],
            providers: [{ provide: SocketService, useValue: socketService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('printTurnTime should return the time', () => {
        component.turnTime = 60;
        const time = component.printTurnTime();
        expect(time).toBe('1:00');
    });

    it('printTurnTime should return the time', () => {
        component.turnTime = 90;
        const time = component.printTurnTime();
        expect(time).toBe('1:30');
    });

    it('incrementTurnTime should call increment time by 30', () => {
        component.turnTime = 30;
        component.incrementTurnTime();
        const exp = 60;
        expect(component.turnTime).toBe(exp);
    });

    it('decrementTurnTime should call not decrement time by 30', () => {
        component.turnTime = 30;
        component.decrementTurnTime();
        const exp = 30;
        expect(component.turnTime).toBe(exp);
    });

    it('incrementTurnTime should call not increment time by 30', () => {
        component.turnTime = 300;
        component.incrementTurnTime();
        const exp = 300;
        expect(component.turnTime).toBe(exp);
    });

    it('decrementTurnTime should call decrement time by 30', () => {
        component.turnTime = 90;
        component.decrementTurnTime();
        const exp = 60;
        expect(component.turnTime).toBe(exp);
    });

    it('confirmParameters should set the parametes', () => {
        component.turnTime = 90;
        component.confirmParameters();
        const exp = 90;
        expect(component.gameStateService.timeLeft).toBe(exp);
        expect(component.gameStateService.timerTime).toBe(exp);
    });

    it('ngAfterViewChecked should set isPlaying to true', () => {
        component.gameModeService.isPlayingSolo = true;
        component.ngAfterViewChecked();
        expect(component.gameStateService.isPlaying).toBe(true);
    });

    it('should clear the dictionaries map when receiving dictionaries info from server', () => {
        spyOn(component.map, 'clear');
        socketMock.emit('getDictionariesInfo');
        expect(component.map.clear).toHaveBeenCalled();
    });
});
