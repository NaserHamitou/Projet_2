import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as CONSTANTS from '@app/constants';
import { Letter } from '@app/letter';
import { WordValidatorService } from '@app/services/word-validator/word-validator.service';

describe('WordValidatorService', () => {
    let service: WordValidatorService;
    const grid: Letter[][] = [];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WordValidatorService);
        for (let i = 0; i <= CONSTANTS.NUMBER_OF_TILES + 1; i++) {
            grid[i] = [];
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getLetterNumber should correctly return the index of the * character in the alphabet', () => {
        const INDEX = 26;
        expect(service.getLetterNumber('*')).toEqual(INDEX);
    });

    it('tileToCoordinates should correctly convert tile positions to coordinates', () => {
        const coords = { x: 1, y: 3 };
        expect(service.tileToCoordinates('A', 3)).toEqual(coords);
    });

    it('validateWord should return false if the player does not place any letters', () => {
        const userInput = { row: 'e', col: 3, direction: 'h', word: 'unir' };
        grid[5][3] = new Letter('u', 1);
        grid[5][4] = new Letter('n', 1);
        grid[5][5] = new Letter('i', 1);
        grid[5][6] = new Letter('r', 1);
        expect(service.validateWord(userInput, grid)).toBeFalse();
    });

    it('validateWord should return false if the player does not place any letters', () => {
        const userInput = { row: 'e', col: 3, direction: 'v', word: 'je' };
        grid[5][3] = new Letter('j', 1);
        grid[6][3] = new Letter('e', 1);
        expect(service.validateWord(userInput, grid)).toBeFalse();
    });

    it('validateWord should return false if the direction is wrong', () => {
        const userInput = { row: 'a', col: 10, direction: 't', word: 'pomme' };
        expect(service.validateWord(userInput, grid)).toBeFalse();
    });

    it('validateHorizontalWord should return false if the word detected is not in the dictionary', () => {
        const userInput = { row: 'e', col: 6, direction: 'h', word: 'ist' };
        expect(service.validateWord(userInput, grid)).toBeFalse();
    });

    it('validateHorizontalWord for letters placed on the left of a word on the grid', () => {
        const userInput = { row: 'e', col: 1, direction: 'h', word: 're' };
        grid[5][3] = new Letter('u', 1);
        grid[5][4] = new Letter('n', 1);
        grid[5][5] = new Letter('i', 1);
        grid[5][6] = new Letter('r', 1);
        expect(service.validateWord(userInput, grid)).toBeTruthy();
    });

    it('validateHorizontalWord should return false if the word detected does not match the letters on the grid', () => {
        const userInput = { row: 'e', col: 5, direction: 'h', word: 'vre' };
        grid[5][3] = new Letter('l', 3);
        grid[5][4] = new Letter('i', 3);
        grid[5][5] = new Letter('b', 3);

        expect(service.validateWord(userInput, grid)).toBeFalse();
    });

    it('validateHorizontalWord should return false if the placement forms invalid words vertical to the letters placed', () => {
        const userInput = { row: 'e', col: 5, direction: 'h', word: 'bre' };
        grid[5][3] = new Letter('l', 3);
        grid[5][4] = new Letter('i', 3);
        grid[5][5] = new Letter('b', 3);
        grid[6][6] = new Letter('z', 3);

        expect(service.validateWord(userInput, grid)).toBeFalse();
    });

    it('validateHorizontalWord should return true if the placement forms valid words vertical to the letters placed', () => {
        const userInput = { row: 'e', col: 5, direction: 'h', word: 'bre' };
        grid[5][3] = new Letter('l', 3);
        grid[5][4] = new Letter('i', 3);
        grid[5][5] = new Letter('b', 3);
        grid[4][6] = new Letter('b', 3);
        grid[6][6] = new Letter('u', 3);
        grid[7][6] = new Letter('n', 3);

        expect(service.validateWord(userInput, grid)).toBeTruthy();
    });

    it('validateVerticalWord should return false if the word detected is not in the dictionary', () => {
        const userInput = { row: 'h', col: 3, direction: 'v', word: 'ist' };
        grid[5][3] = new Letter('e', 3);
        grid[6][3] = new Letter('g', 3);
        grid[7][3] = new Letter('o', 3);

        expect(service.validateWord(userInput, grid)).toBeFalse();
    });

    it('validateVerticalWord for letters placed on the top of a word on the grid', () => {
        const userInput = { row: 'd', col: 3, direction: 'v', word: 'a' };
        grid[5][3] = new Letter('d', 2);
        grid[6][3] = new Letter('o', 1);
        grid[7][3] = new Letter('n', 1);
        grid[8][3] = new Letter('n', 1);
        grid[9][3] = new Letter('e', 1);
        grid[10][3] = new Letter('r', 1);

        expect(service.validateWord(userInput, grid)).toBeTruthy();
    });

    it('validateVerticalWord for letters placed on the top of a word on the grid and at the end of the word', () => {
        const userInput = { row: 'd', col: 3, direction: 'v', word: 'adonnerai' };
        grid[5][3] = new Letter('d', 2);
        grid[6][3] = new Letter('o', 1);
        grid[7][3] = new Letter('n', 1);
        grid[8][3] = new Letter('n', 1);
        grid[9][3] = new Letter('e', 1);
        grid[10][3] = new Letter('r', 1);

        expect(service.validateWord(userInput, grid)).toBeTruthy();
    });

    it('validateVerticalWord should return false if the word detected does not match the letters on the grid', () => {
        const userInput = { row: 'g', col: 3, direction: 'v', word: 'vre' };
        grid[5][3] = new Letter('l', 3);
        grid[6][3] = new Letter('i', 3);
        grid[7][3] = new Letter('b', 3);

        expect(service.validateWord(userInput, grid)).toBeFalse();
    });

    it('validateVerticalWord should return false if the word is not in the dictionary', () => {
        const userInput = { row: 'g', col: 3, direction: 'v', word: 'bre' };
        expect(service.validateWord(userInput, grid)).toBeFalse();
    });

    it('validateVerticalWord should return false if the placement forms invalid words horizontal to the letters placed', () => {
        const userInput = { row: 'g', col: 3, direction: 'v', word: 'bre' };
        grid[5][3] = new Letter('l', 3);
        grid[6][3] = new Letter('i', 3);
        grid[7][3] = new Letter('b', 3);
        grid[8][4] = new Letter('z', 3);

        expect(service.validateWord(userInput, grid)).toBeFalse();
    });

    it('validateVerticalWord should return true if the placement forms valid words horizontal to the letters placed', () => {
        const userInput = { row: 'g', col: 3, direction: 'v', word: 'bre' };

        grid[5][3] = new Letter('l', 3);
        grid[6][3] = new Letter('i', 3);
        grid[7][3] = new Letter('b', 3);
        grid[9][1] = new Letter('p', 3);
        grid[9][2] = new Letter('i', 3);
        grid[9][4] = new Letter('d', 3);

        expect(service.validateWord(userInput, grid)).toBeTruthy();
    });

    it('should remove unnecessary spaces from input words', () => {
        const wordToCheck = ' mot';
        expect(service.removeUnnecessarySpaces(wordToCheck)).toBe('mot');
    });

    it('should not modify words that have no spaces in them', () => {
        const wordToCheck = 'mot';
        expect(service.removeUnnecessarySpaces(wordToCheck)).toBe('mot');
    });
});
