/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketMock } from '@app/classes/socket-test-helper';
import { GameOptionsComponent } from '@app/pages/game-options/game-options.component';
import { SocketService } from '@app/services/sockets/socket.service';
import { RoomManagerComponent } from './room-manager.component';
export interface Room {
    nameOfhost: string;
    nameOfRoom: string;
}

fdescribe('RoomManagerComponent', () => {
    let component: RoomManagerComponent;
    let fixture: ComponentFixture<RoomManagerComponent>;
    let socketMock: SocketMock;

    beforeEach(async () => {
        socketMock = new SocketMock();
        const socketService = jasmine.createSpyObj('SocketService', ['initializeSocket'], { isHost: true, socket: socketMock });
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([{ path: 'home', component: GameOptionsComponent }]), FormsModule],
            declarations: [RoomManagerComponent],
            providers: [{ provide: SocketService, useValue: socketService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RoomManagerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        socketMock.emit('connect', () => {});
        expect(component).toBeTruthy();
    });

    it('component should receive room list from server', () => {
        component.ngOnInit();
        const mapTest = new Map();
        mapTest.set('room1', 'host');
        socketMock.emit('currentRoomList', mapTest);
        expect(component.rooms.length).toBeGreaterThan(0);
    });

    it('component should receive created room from server', () => {
        component.ngOnInit();
        const name = 'host';
        const room = 'room1';
        socketMock.emit('showRoomCreated', name, room);
        expect(component.rooms.length).toBeGreaterThan(0);
    });

    it('component should go to connection page when game starts', () => {
        const spy = spyOn(component.router, 'navigate').and.callFake(async () => {
            return new Promise<boolean>(() => {});
        });
        component.ngOnInit();
        socketMock.emit('startGame');
        expect(spy).toHaveBeenCalled();
    });

    it('component should remove room', () => {
        component.ngOnInit();
        const room = 'room1';
        const mapTest = new Map();
        mapTest.set('room1', 'host');
        socketMock.emit('removeRoom', room);
        expect(component.rooms.length).toBe(0);
    });

    it('joinRandom should join a random room', () => {
        component.rooms.push({ nameOfhost: 'host', nameOfRoom: 'room1' });
        const spy = spyOn(component, 'joinBox').and.callFake(() => {});
        component.joinRandom();
        expect(spy).toHaveBeenCalled();
    });

    it('verifyRoomName should verify if the room name is not valid', () => {
        component.rooms.push({ nameOfhost: 'host', nameOfRoom: 'room1' });
        component.verifyRoomName('room1');
        expect(component.roomNameValid).toBeFalse();
    });

    it('verifyRoomName should verify if the room name is valid', () => {
        component.rooms.push({ nameOfhost: 'host', nameOfRoom: 'room1' });
        component.verifyRoomName('room2');
        expect(component.roomNameValid).toBeTrue();
    });

    it('cancelCreatioon should cancel the creation of room', () => {
        component.cancelCreatioon();
        expect(component.createRoomBox).toBe('none');
        expect(component.listRoomBox).toBe('block');
        expect(component.roomName).toBe('');
    });

    it('goBack should go the home page', () => {
        const spy = spyOn(component.location, 'replaceState').and.callFake(() => {});
        component.goBack();
        expect(spy).toHaveBeenCalled();
    });

    it('should create room', () => {
        socketMock.emit('connect', () => {});
        component.rooms = [];
        const spy = spyOn(component.socketService.socket, 'emit');
        component.createRoom('room1');
        expect(spy).toHaveBeenCalled();
        expect(component.rooms[0].nameOfRoom).toBe('room1');
    });

    it('should not create room', () => {
        const room1 = {
            nameOfhost: 'name',
            nameOfRoom: 'room1',
        };
        component.rooms = [room1];
        const spy = spyOn(component.socketService.socket, 'emit');
        const spyWindow = spyOn(window, 'alert');
        component.createRoom('room1');
        expect(spy).not.toHaveBeenCalled();
        expect(spyWindow).toHaveBeenCalled();
        expect(component.rooms[0].nameOfRoom).toBe('room1');
    });

    it('should display createBox', () => {
        component.createBox();
        expect(component.createRoomBox).toBe('block');
        expect(component.listRoomBox).toBe('none');
    });

    it('should  joinRoom', () => {
        const spy = spyOn(component.socketService.socket, 'emit');
        component.joinRoom('room1');
        expect(spy).toHaveBeenCalled();
    });

    it('should display joinBox', () => {
        component.joinBox('room1');
        expect(component.joinDisplay).toBe('block');
        expect(component.listRoomBox).toBe('block');
    });

    it('should  playSolo', () => {
        const spy = spyOn(component.socketService.socket, 'emit');
        const spyRouter = spyOn(component.router, 'navigate');
        component.playSolo();
        expect(spy).toHaveBeenCalled();
        expect(spyRouter).toHaveBeenCalled();
    });

    it('should listen to server', () => {
        const spy = spyOn(component.socketService.socket, 'on');
        component.ngOnInit();
        expect(spy).toHaveBeenCalledTimes(4);
    });
});
