/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-empty-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketMock } from '@app/classes/socket-test-helper';
import { LettersAreaComponent } from '@app/components/letters-area/letters-area.component';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { LetterPlacementService } from '@app/services/letter-placement.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { GridComponent } from './grid.component';

fdescribe('GridComponent', () => {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;
    let socketMock: SocketMock;

    beforeEach(async () => {
        socketMock = new SocketMock();
        const socketService = jasmine.createSpyObj('SocketService', {}, { isHost: false, socket: socketMock });
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([])],
            declarations: [GridComponent, LettersAreaComponent],
            providers: [LetterPlacementService, GameStateService, { provide: SocketService, useValue: socketService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyOn(component.gameStateService, 'emitReset').and.callFake(() => {});
        spyOn(component, 'setUpDictionary').and.callFake(() => {});
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('changeState should call endGame if called 3 times', () => {
        const spy = spyOn(component, 'endOfGame').and.callFake(() => {});
        component.changeState();
        component.changeState();
        component.changeState();
        expect(spy).toHaveBeenCalled();
    });

    it('confirmPlay return if the game dont start at h8', () => {
        jasmine.clock().install();
        component.gameStateService.isGameBegin = true;
        spyOn(component.gridCoord, 'findColumAndRow').and.callFake(() => {
            return { x: 'a', y: '1' };
        });
        const spy = spyOn(component, 'resetBoard').and.callFake(() => {});
        component.confirmPlay();
        jasmine.clock().tick(1200);
        expect(spy).not.toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('subscripiton should call cancelPlay if isPlaying is false', () => {
        const spy = spyOn(component, 'cancelPlay');
        component.ngOnInit();
        component.mousePlaceLetter.isTyping = true;
        component.gameStateService.isPlayingChange.next(false);
        expect(spy).toHaveBeenCalled();
    });

    it('subscripiton should not call cancelPlay if isPlaying is false', () => {
        const spy = spyOn(component, 'cancelPlay');
        component.ngOnInit();
        component.gameStateService.isPlayingChange.next(true);
        expect(spy).not.toHaveBeenCalled();
    });

    it('buttonDetect should return if isPlayer is false', () => {
        const keyEvent = {
            key: 'a',
        } as KeyboardEvent;
        component.gameStateService.isPlayingChange.next(false);
        component.buttonDetect(keyEvent);
        const spy = spyOn(component, 'cancelPlay');
        expect(spy).not.toHaveBeenCalled();
    });

    it('buttonDetect should call cancelPlay if Escape', () => {
        const keyEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        component.gameStateService.isPlayingChange.next(true);
        component.buttonDetect(keyEvent);
        expect(keyEvent.key).toBe('Escape');
    });

    it('mouseHighlight should call mouseHighLight method', () => {
        const mouseEvent = {
            offsetX: 10,
            offsetY: 10,
        } as MouseEvent;
        const spy = spyOn(component.mousePositionService, 'mouseHightlight');
        component.mouseHighlight(mouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('confirmPlay should find the coordinates to place the letter', () => {
        jasmine.clock().install();
        const spy = spyOn(component.gridCoord, 'findColumAndRow').and.callFake(() => {
            return { x: 'a', y: '1' };
        });
        component.confirmPlay();
        jasmine.clock().tick(1200);
        expect(spy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('changeFont should change the font size', () => {
        const mouseEvent = {
            offsetX: 10,
            offsetY: 10,
        } as MouseEvent;
        const spy = spyOn(component.gridService, 'drawSpecialCases').and.callFake(() => {});
        component.changeFont(mouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('endOfGame should set EndGame to true', () => {
        component.endOfGame();
        expect(component.displayEndGameComponent).toBeTrue();
    });

    it('buttonDetect should return right away is not playing', () => {
        const keyEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        component.gameStateService.isPlayingChange.next(false);
        component.gameStateService.isPlaying = false;
        component.buttonDetect(keyEvent);
        expect(component.gameStateService.isPlaying).toBeFalse();
    });

    it('endOfGame should set EndGame to true', () => {
        const keyEvent = {
            key: 'Enter',
        } as KeyboardEvent;
        const spy = spyOn(component, 'confirmPlay').and.callFake(() => {});
        component.buttonDetect(keyEvent);
        expect(spy).toHaveBeenCalled();
    });
});
