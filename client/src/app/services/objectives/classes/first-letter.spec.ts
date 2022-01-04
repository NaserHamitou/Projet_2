import { TestBed } from '@angular/core/testing';
import { FirstLetter } from './first-letter';

fdescribe('FirstLetter', () => {
    let bonusClass: FirstLetter;

    beforeEach(() => {
        bonusClass = TestBed.inject(FirstLetter);
    });

    it('should create an instance', () => {
        expect(bonusClass).toBeTruthy();
    });

    it('activate should receive the current word value', () => {
        bonusClass.activate();
        bonusClass.gridCoordService.changeLetter('abc');
        expect(bonusClass.wordToCheck).toBe('abc');
    });

    it('verify should return false if completed', () => {
        bonusClass.isCompleted = true;
        const result = bonusClass.verify();
        expect(result).toBeFalse();
    });

    it('verify should return true if condition is met', () => {
        bonusClass.isCompleted = false;
        bonusClass.wordToCheck = 'que';
        bonusClass.letterToStart = 'q';
        const result = bonusClass.verify();
        expect(result).toBeTrue();
    });

    it('verify should return false if condition is not met', () => {
        bonusClass.isCompleted = false;
        bonusClass.wordToCheck = 'allo';
        bonusClass.letterToStart = 'q';
        const result = bonusClass.verify();
        expect(result).toBeFalse();
    });
});
