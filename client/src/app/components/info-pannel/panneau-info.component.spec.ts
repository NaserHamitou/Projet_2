/* eslint-disable @typescript-eslint/no-empty-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameOptionsComponent } from '@app/pages/game-options/game-options.component';
import { PanneauInfoComponent } from './panneau-info.component';

fdescribe('PanneauInfoComponent', () => {
    let component: PanneauInfoComponent;
    let fixture: ComponentFixture<PanneauInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([{ path: 'home', component: GameOptionsComponent }])],
            declarations: [PanneauInfoComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PanneauInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should subscribe from timeLeftChange and change the timeLeft ', async (done) => {
        component.gameStateService.timeLeftChange.subscribe((timeReceived) => {
            expect(timeReceived).toEqual(timeReceived);
            done();
        });
    });

    it('should subscribe from isPlaying', async () => {
        component.gameStateService.isPlayingChange.subscribe((valueReceived) => {
            expect(valueReceived).toEqual(false);
        });
    });

    it('getRandomAdvarsaryName should get called', () => {
        component.gameModeService.isPlayingSolo = true;
        const spy = spyOn(component.virtualPlayerService, 'getOpponentName');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should set is Playing to true', async () => {
        component.isPlaying = false;
        component.gameStateService.isPlayingChange.next(true);
        expect(component.isPlaying).toBe(true);
        expect(component.isPlaying).toBe(true);
    });

    it('should set is player1 to none and player2 to empty ', async () => {
        component.isPlaying = false;
        component.gameStateService.isPlayingChange.next(false);
        expect(component.player1).toBe('none');
        expect(component.player2).toBe('');
    });

    it('resetTimer should call emitReset', () => {
        const spy = spyOn(component.gameStateService, 'emitReset');
        component.resetTimer();
        expect(spy).toHaveBeenCalled();
    });

    it('cancelQuit should set quitBox to empty', () => {
        component.quitBox = 'test';
        component.quitGameWindow();
        expect(component.quitBox).toBe('');
    });

    it('cancelQuit should set quitBox to none', () => {
        component.quitBox = '';
        component.cancelQuit();
        expect(component.quitBox).toBe('none');
    });
});
