import { TestBed } from '@angular/core/testing';
import { LongerSeven } from './longer-seven';

fdescribe('LongerSeven', () => {
    let bonusClass: LongerSeven;

    beforeEach(() => {
        bonusClass = TestBed.inject(LongerSeven);
    });

    it('should create an instance', () => {
        expect(bonusClass).toBeTruthy();
    });

    it('verify should return false if completed', () => {
        bonusClass.isCompleted = true;
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });

    it('verify should return true if condition is met', () => {
        bonusClass.isCompleted = false;
        bonusClass.wordToCheck = 'abcdefgh';
        const res = bonusClass.verify();
        expect(res).toBeTrue();
    });

    it('verify should return false if condition is not met', () => {
        bonusClass.isCompleted = false;
        bonusClass.wordToCheck = 'abc';
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });

    it('activate should receive the word', () => {
        bonusClass.activate();
        bonusClass.gridCoordService.changeLetter('allo');
        expect(bonusClass.wordToCheck).toBe('allo');
    });
});
