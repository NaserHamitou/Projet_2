/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketMock } from '@app/classes/socket-test-helper';
import { SocketService } from '@app/services/sockets/socket.service';
import { LoadingPageComponent } from './loading-page.component';

fdescribe('LoadingPageComponent', () => {
    let component: LoadingPageComponent;
    let fixture: ComponentFixture<LoadingPageComponent>;
    let socketMock: SocketMock;

    beforeEach(async () => {
        socketMock = new SocketMock();
        const socketService = jasmine.createSpyObj('SocketService', {}, { isHost: false, socket: socketMock });
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [LoadingPageComponent],
            providers: [{ provide: SocketService, useValue: socketService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadingPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit should receive opponent name', () => {
        spyOn(component, 'goToGamePage').and.callFake(() => {});
        spyOn(component.gameStateService, 'multiplayerOn').and.callFake(() => {});
        let received = false;
        socketMock.on('SendName', () => {
            received = true;
        });
        component.init();
        socketMock.emit('ReceiveOpponentName', 'name');
        expect(received).toBeTrue();
    });
});
