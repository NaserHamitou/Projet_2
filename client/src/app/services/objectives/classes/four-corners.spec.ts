import { TestBed } from '@angular/core/testing';
import { Letter } from '@app/letter';
import { FourCorners } from './four-corners';

fdescribe('FourCorners', () => {
    let bonusClass: FourCorners;

    beforeEach(() => {
        bonusClass = TestBed.inject(FourCorners);
    });

    it('should create an instance', () => {
        expect(bonusClass).toBeTruthy();
    });

    it('activate should set isCompleted to false', () => {
        bonusClass.activate();
        expect(bonusClass.isCompleted).toBeFalse();
    });

    it('verify should return false if completed', () => {
        bonusClass.isCompleted = true;
        const result = bonusClass.verify();
        expect(result).toBeFalse();
    });

    it('verify should return true if condition is met', () => {
        bonusClass.isCompleted = false;
        spyOn(bonusClass, 'checkBoard').and.returnValue(true);
        const result = bonusClass.verify();
        expect(result).toBeTrue();
    });

    it('verify should return false if condition is not met', () => {
        bonusClass.isCompleted = false;
        spyOn(bonusClass, 'checkBoard').and.returnValue(false);
        const result = bonusClass.verify();
        expect(result).toBeFalse();
    });

    it('checkBoard should check the corner of the grid', () => {
        bonusClass.letterPlacementService.lettersGrid[1][1] = new Letter('a', 1);
        const result = bonusClass.checkBoard();
        expect(result).toBeTrue();
    });

    it('checkBoard should check the corner of the grid', () => {
        bonusClass.letterPlacementService.lettersGrid[15][1] = new Letter('a', 1);
        const result = bonusClass.checkBoard();
        expect(result).toBeTrue();
    });

    it('checkBoard should check the corner of the grid', () => {
        bonusClass.letterPlacementService.lettersGrid[1][15] = new Letter('a', 1);
        const result = bonusClass.checkBoard();
        expect(result).toBeTrue();
    });

    it('checkBoard should check the corner of the grid', () => {
        bonusClass.letterPlacementService.lettersGrid[15][15] = new Letter('a', 1);
        const result = bonusClass.checkBoard();
        expect(result).toBeTrue();
    });

    it('checkBoard should check the corner of the grid', () => {
        const result = bonusClass.checkBoard();
        expect(result).toBeFalse();
    });
});
