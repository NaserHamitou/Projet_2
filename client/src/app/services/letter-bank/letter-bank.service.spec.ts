/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { Letter } from '@app/letter';
import { LetterBankService } from './letter-bank.service';

fdescribe('LetterBankService', () => {
    let service: LetterBankService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LetterBankService);
        service.initializeAllLetters();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fill out letterBank and mix it', () => {
        let compareBank: Letter[] = [];
        const sizeOfBank = 102;
        service.bank = [];
        service.initializeAllLetters();
        compareBank = service.bank;
        service.initializeAllLetters();
        expect(service.bank.length).toEqual(sizeOfBank);
        expect(service.bank).not.toEqual(compareBank);
    });

    it('should get a Letter', () => {
        const sizeOfBank = 102;
        service.initializeAllLetters();
        const random: Letter = service.getLetter();
        expect(random).toBeInstanceOf(Letter);
        expect(service.bank.length).not.toEqual(sizeOfBank);
    });

    it('should get another Letter', () => {
        service.initializeAllLetters();
        const random: Letter = service.getLetter();
        const changed: Letter = service.changeLetter(random);
        expect(changed).toBeTruthy();
    });

    it('putBackLetter should add a letter in the bank array', () => {
        service.bank = [];
        service.putBackLetter(new Letter('a', 1));
        expect(service.bank.length).toBe(1);
    });
});
