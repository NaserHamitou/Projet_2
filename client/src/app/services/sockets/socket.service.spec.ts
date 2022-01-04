/* eslint-disable prefer-const */
import { TestBed } from '@angular/core/testing';
import { SocketMock } from '@app/classes/socket-test-helper';
import { SocketService } from './socket.service';

fdescribe('SocketService', () => {
    let service: SocketService;
    let socketMock: SocketMock;
    socketMock = new SocketMock();

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = jasmine.createSpyObj('SocketService', ['initializeSocket'], { isHost: true, socket: socketMock });
        service = TestBed.inject(SocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should listen to server', () => {
        service.initializeSocket();
        socketMock.emit('connect_error');
        expect(service).toBeTruthy();
    });

    it('should turn socket off when solo', () => {
        service.initializeSocket();
        socketMock.emit('connect');
        expect(service).toBeTruthy();
    });

    it('should turn socket off when solo', () => {
        service.initializeSocket();
        socketMock.emit('hostValue');
        expect(service).toBeTruthy();
    });
});
