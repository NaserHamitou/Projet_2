import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketMock } from '@app/classes/socket-test-helper';
import { SocketService } from '@app/services/sockets/socket.service';
import { ResetSystemDataComponent } from './reset-system-data.component';

fdescribe('ResetSystemDataComponent', () => {
    let component: ResetSystemDataComponent;
    let fixture: ComponentFixture<ResetSystemDataComponent>;
    let socketMock: SocketMock;
    beforeEach(async () => {
        socketMock = new SocketMock();
        const socketService = jasmine.createSpyObj('SocketService', {}, { isHost: false, socket: socketMock });
        await TestBed.configureTestingModule({
            declarations: [ResetSystemDataComponent],
            providers: [{ provide: SocketService, useValue: socketService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ResetSystemDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
