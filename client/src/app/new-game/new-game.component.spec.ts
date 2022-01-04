import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NewGameComponent } from './new-game.component';

fdescribe('NewGameComponent', () => {
    let component: NewGameComponent;
    let fixture: ComponentFixture<NewGameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewGameComponent],
            imports: [RouterTestingModule.withRoutes([]), FormsModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
