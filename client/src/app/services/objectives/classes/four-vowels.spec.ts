import { TestBed } from '@angular/core/testing';
import { FourVowels } from './four-vowels';

fdescribe('FourVowels', () => {
    let bonusClass: FourVowels;

    beforeEach(() => {
        bonusClass = TestBed.inject(FourVowels);
    });

    it('should create an instance', () => {
        expect(bonusClass).toBeTruthy();
    });

    it('verify should return false if completed', () => {
        bonusClass.isCompleted = true;
        bonusClass.wordToCheck = 'test';
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });

    it('verify should return true if condition is met', () => {
        bonusClass.isCompleted = false;
        bonusClass.wordToCheck = 'aieul';
        const res = bonusClass.verify();
        expect(res).toBeTrue();
    });

    it('verify should return false if condition is met', () => {
        bonusClass.isCompleted = false;
        bonusClass.wordToCheck = 'allo';
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });

    it('activate should receive word', () => {
        bonusClass.activate();
        bonusClass.gridCoordService.changeLetter('allo');
        expect(bonusClass.wordToCheck).toBe('allo');
    });

    it('if no word return false', () => {
        bonusClass.wordToCheck = '';
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });
});
