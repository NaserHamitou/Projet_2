/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VirtualPlayerComponent } from './virtual-player.component';

fdescribe('VirtualPlayerComponent', () => {
    let component: VirtualPlayerComponent;
    let fixture: ComponentFixture<VirtualPlayerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VirtualPlayerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VirtualPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should subcribe to gameState', () => {
        const spy = spyOn(component, 'virtualPlayingF');
        component.ngOnInit();
        component.gameModeService.isPlayingSolo = true;
        component.gameStateService.isPlayingChange.next(false);
        expect(spy).toHaveBeenCalled();
    });

    it('should subcribe to gameState', () => {
        const spy = spyOn(component, 'virtualPlayingF');
        component.ngOnInit();
        component.gameModeService.isPlayingSolo = false;
        component.gameStateService.isPlayingChange.next(true);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call virtualPlayer after time', () => {
        jasmine.clock().install();
        const spy1 = spyOn(component.virtualPlayerService, 'virtualPlaying');
        const spy2 = spyOn(component.gameStateService, 'resetTimer');
        component.virtualPlayingF();
        jasmine.clock().tick(9020);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });
});
