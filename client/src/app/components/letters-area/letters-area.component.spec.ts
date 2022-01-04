import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LetterHolderComponent } from '@app/components/letter-holder/letter-holder.component';
import { LettersAreaComponent } from './letters-area.component';

fdescribe('LettersAreaComponent', () => {
    let component: LettersAreaComponent;
    let fixture: ComponentFixture<LettersAreaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([])],
            declarations: [LettersAreaComponent, LetterHolderComponent],
            providers: [{ provide: LetterHolderComponent, useValue: {} }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LettersAreaComponent);
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

    it('placeOnTheBoard should call playTheWord if is playing', () => {
        const spy = spyOn(component.placeLetterService, 'playTheWord');
        component.gameState.isPlaying = true;
        component.placeOnTheBoard();
        expect(spy).toHaveBeenCalled();
    });

    it('placeOnTheBoard should call playTheWord if is playing', () => {
        const spy = spyOn(component.placeLetterService, 'playTheWord');
        component.gameState.isPlaying = false;
        component.placeOnTheBoard();
        expect(spy).not.toHaveBeenCalled();
    });

    it('ngOnInit should call placeOnBord if the word is not empty', () => {
        const spy = spyOn(component, 'placeOnTheBoard');
        component.ngOnInit();
        component.word = 'a';
        component.eventService.sendClickEvent();
        expect(spy).toHaveBeenCalled();
    });

    it('ngOnInit should call placeOnBord if the word is empty', () => {
        const spy = spyOn(component, 'placeOnTheBoard');
        component.ngOnInit();
        component.word = '';
        component.eventService.sendClickEvent();
        expect(spy).not.toHaveBeenCalled();
    });
});
