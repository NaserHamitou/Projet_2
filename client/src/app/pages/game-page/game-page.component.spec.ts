/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-empty-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketMock } from '@app/classes/socket-test-helper';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { SocketService } from '@app/services/sockets/socket.service';
import { GamePageComponent } from './game-page.component';

fdescribe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let socketMock: SocketMock;

    beforeEach(async () => {
        socketMock = new SocketMock();
        const socketService = jasmine.createSpyObj('SocketService', {}, { isHost: false, socket: socketMock });
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([])],
            providers: [{ provide: SocketService, useValue: socketService }],
            declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should receive signal from server when player other player leaves', () => {
        const spy = spyOn(component, 'setToSoloMode').and.callFake(() => {});
        component.ngAfterViewInit();
        jasmine.clock().install();
        socketMock.emit('playerClosed');
        jasmine.clock().tick(5100);
        expect(spy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('should receive signal from server when player other player leaves', () => {
        const spy = spyOn(component, 'setToSoloMode').and.callFake(() => {});
        component.ngAfterViewInit();
        socketMock.emit('playerLeft');
        expect(spy).toHaveBeenCalled();
    });

    /*   it('should set solo mod', () => {
        const spyReset = spyOn(component.gameStateService, 'resetTimer').and.callFake(() => {});
        const spyVirtual = spyOn(component.virtualPlayer, 'getOpponentName').and.callFake(() => {
            return 'name';
        });
        component.panel.players[1].name = '';
        component.panel.players[0].name = '';
        component.setToSoloMode();
        expect(spyReset).toHaveBeenCalled();
        expect(spyVirtual).toHaveBeenCalled();
    }); */
});
