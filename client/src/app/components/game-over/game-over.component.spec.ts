import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameOptionsComponent } from '@app/pages/game-options/game-options.component';
import { GameOverComponent } from './game-over.component';

fdescribe('GameOverComponent', () => {
    let component: GameOverComponent;
    let fixture: ComponentFixture<GameOverComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([{ path: 'home', component: GameOptionsComponent }])],
            declarations: [GameOverComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameOverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('displayWinner should display the correct winner', () => {
        component.scoreP1 = 2;
        component.scoreP2 = 0;
        component.displayWinner();
        expect(component.result).toBe('Félicitaion vous avez gagné !');
    });

    it('displayWinner should display the correct loser', () => {
        component.scoreP1 = 0;
        component.scoreP2 = 2;
        component.displayWinner();
        expect(component.result).toBe('Vous avez perdu la partie, ' + component.winner + ' a gagné.');
    });

    it('quitButton should change page', () => {
        // eslint-disable-next-line dot-notation
        const spy = spyOn(component['location'], 'replaceState');
        component.quitButton();
        expect(spy).toHaveBeenCalled();
    });
});
