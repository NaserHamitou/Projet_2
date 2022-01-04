import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserInput } from '@app/interfaces/user-input';
import { Letter } from '@app/letter';
import { LetterPlacementService } from './letter-placement.service';

fdescribe('LetterPlacementService', () => {
    let service: LetterPlacementService;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [RouterTestingModule.withRoutes([])] });
        service = TestBed.inject(LetterPlacementService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('validatePlacementV2 should return true if position h8', () => {
        const mockInput = {
            row: 'h',
            col: 8,
            direction: 'h',
            word: 'a',
        } as UserInput;
        expect(service.validatePlacementV2(mockInput)).toBeTrue();
    });

    it('validatePlacementV2 should call checkVertical when vertical', () => {
        const mockInput = {
            row: 'b',
            col: 2,
            direction: 'v',
            word: 'a',
        } as UserInput;
        const spy = spyOn(service, 'checkVerticalWord');
        service.validatePlacementV2(mockInput);
        expect(spy).toHaveBeenCalled();
    });

    it('validatePlacementV2 should call checkHorizontalWord when horizontal', () => {
        const mockInput = {
            row: 'b',
            col: 2,
            direction: 'h',
            word: 'a',
        } as UserInput;
        const spy = spyOn(service, 'checkHorizontalWord');
        service.validatePlacementV2(mockInput);
        expect(spy).toHaveBeenCalled();
    });

    it('checkVerticalWord should return true if there is a letter on the sides', () => {
        service.lettersGrid[8][8] = new Letter('a', 1);
        service.lettersGrid[9][8] = new Letter('b', 1);
        service.lettersGrid[10][8] = new Letter('c', 1);
        const value = service.checkVerticalWord('d', 'h', '9');
        expect(value).toBeTrue();
    });

    it('checkVerticalWord should return true if there is a letter on the extremities', () => {
        service.lettersGrid[8][8] = new Letter('a', 1);
        service.lettersGrid[9][8] = new Letter('b', 1);
        service.lettersGrid[10][8] = new Letter('c', 1);
        const value = service.checkVerticalWord('d', 'k', '8');
        expect(value).toBeTrue();
    });

    it('checkVerticalWord should return false if there is no letters connecting', () => {
        service.lettersGrid[8][8] = new Letter('a', 1);
        service.lettersGrid[9][8] = new Letter('b', 1);
        service.lettersGrid[10][8] = new Letter('c', 1);
        const value = service.checkVerticalWord('d', 'b', '2');
        expect(value).toBeFalse();
    });

    it('checkHorizontalWord should return true if there is a letter on the sides', () => {
        service.lettersGrid[8][8] = new Letter('a', 1);
        service.lettersGrid[8][9] = new Letter('b', 1);
        service.lettersGrid[8][10] = new Letter('c', 1);
        const value = service.checkHorizontalWord('d', 'g', '8');
        expect(value).toBeTrue();
    });

    it('checkHorizontalWord should return true if there is a letter on the extremities', () => {
        service.lettersGrid[8][8] = new Letter('a', 1);
        service.lettersGrid[8][9] = new Letter('b', 1);
        service.lettersGrid[8][10] = new Letter('c', 1);
        const value = service.checkHorizontalWord('d', 'h', '11');
        expect(value).toBeTrue();
    });

    it('checkHorizontalWord should return false if there is no letters connecting', () => {
        service.lettersGrid[8][8] = new Letter('a', 1);
        service.lettersGrid[8][9] = new Letter('b', 1);
        service.lettersGrid[8][10] = new Letter('c', 1);
        const value = service.checkHorizontalWord('d', 'b', '2');
        expect(value).toBeFalse();
    });
});
