import { TestBed } from '@angular/core/testing';
import { Palindrome } from './palindrome';

fdescribe('Palindrome', () => {
    let bonusClass: Palindrome;

    beforeEach(() => {
        bonusClass = TestBed.inject(Palindrome);
    });

    it('should create an instance', () => {
        expect(bonusClass).toBeTruthy();
    });

    it('activate should receive the word', () => {
        bonusClass.activate();
        bonusClass.gridCoordService.changeLetter('allo');
        expect(bonusClass.wordToCheck).toBe('allo');
    });

    it('verify should return false if is completed', () => {
        bonusClass.isCompleted = true;
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });

    it('verify should return true if condition is met', () => {
        bonusClass.isCompleted = false;
        bonusClass.wordToCheck = 'aa';
        spyOn(bonusClass, 'checkPalindrome').and.returnValue(true);
        const res = bonusClass.verify();
        expect(res).toBeTrue();
    });

    it('verify should return false if condition is not met', () => {
        bonusClass.isCompleted = false;
        bonusClass.wordToCheck = 'aa';
        spyOn(bonusClass, 'checkPalindrome').and.returnValue(false);
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });

    it('verify should return false if condition is not met', () => {
        bonusClass.isCompleted = false;
        bonusClass.wordToCheck = 'a';
        spyOn(bonusClass, 'checkPalindrome').and.returnValue(true);
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });

    it('checkPalindrome should return true if palindrome', () => {
        bonusClass.isCompleted = false;
        bonusClass.wordToCheck = 'anna';
        const res = bonusClass.checkPalindrome();
        expect(res).toBeTrue();
    });

    it('checkPalindrome should return false if not palindrome', () => {
        bonusClass.isCompleted = false;
        bonusClass.wordToCheck = 'test';
        bonusClass.checkPalindrome();
        const res = bonusClass.checkPalindrome();
        expect(res).toBeFalse();
    });
});
