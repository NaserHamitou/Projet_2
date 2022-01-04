/* eslint-disable @typescript-eslint/no-magic-numbers */ // Random numbers to test service
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as CONSTANTS from '@app/constants';
import { Letter } from '@app/letter';
import { PointsCalculatorService } from '@app/services/points-calculator.service';
fdescribe('PointsCalculatorService', () => {
    let service: PointsCalculatorService;
    const GRID: Letter[][] = [];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        }).compileComponents();
    });
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([])],
        });
        service = TestBed.inject(PointsCalculatorService);
        for (let i = 0; i <= CONSTANTS.NUMBER_OF_TILES + 1; i++) {
            GRID[i] = [];
        }
        service.gridService.generateSpecialCases(false);
        service.initializeColorGrid();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('calculatePoints should return -1 if the user input is invalid', () => {
        const USER_INPUT = { row: '0', col: 0, direction: 'l', word: 'vert' };
        const EXPECTED_POINTS = -1;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculate points for a simple word', () => {
        const USER_INPUT = { row: 'a', col: 1, direction: 'h', word: 'vert' };
        const EXPECTED_POINTS = 24;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculate points for a simple word', () => {
        const USER_INPUT = { row: 'e', col: 5, direction: 'h', word: 'emotion' };
        GRID[5][6] = new Letter('m', 2);
        GRID[5][7] = new Letter('o', 1);
        GRID[5][8] = new Letter('t', 1);
        const EXPECTED_POINTS = 32;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculate points for a simple word placed in front of letters on the grid', () => {
        const USER_INPUT = { row: 'a', col: 1, direction: 'h', word: 've' };
        GRID[1][3] = new Letter('r', 1);
        GRID[1][4] = new Letter('t', 1);
        const EXPECTED_POINTS = 21;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should not include bonuses from already placed letters', () => {
        const USER_INPUT = { row: 'a', col: 1, direction: 'h', word: 'vert' };
        GRID[1][1] = new Letter('v', 4);
        const EXPECTED_POINTS = 8;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should not include bonuses from already placed letters', () => {
        const USER_INPUT = { row: 'a', col: 1, direction: 'h', word: 'vert' };
        GRID[1][1] = new Letter('v', 4);
        GRID[1][4] = new Letter('r', 1);
        const EXPECTED_POINTS = 7;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should correctly calculate points for multiple words formed by a placement', () => {
        const USER_INPUT = { row: 'h', col: 1, direction: 'h', word: 'vert' };
        GRID[3][2] = new Letter('a', 1);
        GRID[4][2] = new Letter('g', 2);
        GRID[5][2] = new Letter('e', 1);
        GRID[6][2] = new Letter('n', 1);
        GRID[7][2] = new Letter('t', 1);
        const EXPECTED_POINTS = 31;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should include bonuses from placed letters', () => {
        const USER_INPUT = { row: 'a', col: 8, direction: 'h', word: 'ete' };
        GRID[2][8] = new Letter('t', 1);
        GRID[3][8] = new Letter('e', 1);
        const EXPECTED_POINTS = 18;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculate points for a word that forms another word on the bottom', () => {
        const USER_INPUT = { row: 'j', col: 5, direction: 'h', word: 'non' };
        GRID[11][7] = new Letter('o', 1);
        GRID[12][7] = new Letter('n', 1);
        const EXPECTED_POINTS = 8;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculate points for a word that forms another word on top', () => {
        const USER_INPUT = { row: 'n', col: 5, direction: 'h', word: 'suite' };
        GRID[11][5] = new Letter('s', 1);
        GRID[12][5] = new Letter('o', 1);
        GRID[13][5] = new Letter('u', 1);
        const EXPECTED_POINTS = 11;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should calculate points for letters placed above the position input', () => {
        const USER_INPUT = { row: 'd', col: 6, direction: 'h', word: 'rre' };

        GRID[2][8] = new Letter('e', 1);
        GRID[3][8] = new Letter('t', 1);

        GRID[4][4] = new Letter('t', 1);
        GRID[4][5] = new Letter('e', 1);
        const EXPECTED_POINTS = 10;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should give 50 bonus points if the player makes a bingo', () => {
        const USER_INPUT = { row: 'b', col: 9, direction: 'h', word: 'lettres' };
        const EXPECTED_POINTS = 0;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculate points for a simple word', () => {
        const USER_INPUT = { row: 'a', col: 1, direction: 'v', word: 'vert' };
        const EXPECTED_POINTS = 24;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculate points for a simple word placed on top of letters on the grid', () => {
        const USER_INPUT = { row: 'a', col: 8, direction: 'v', word: 've' };
        GRID[3][8] = new Letter('r', 1);
        GRID[4][8] = new Letter('t', 1);
        const EXPECTED_POINTS = 21;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should not include bonuses from already placed letters', () => {
        const USER_INPUT = { row: 'a', col: 1, direction: 'v', word: 'vert' };
        GRID[1][1] = new Letter('v', 4);
        const EXPECTED_POINTS = 8;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should not include bonuses from already placed letters', () => {
        const USER_INPUT = { row: 'a', col: 1, direction: 'v', word: 'vert' };
        GRID[1][1] = new Letter('v', 4);
        GRID[4][1] = new Letter('t', 1);
        const EXPECTED_POINTS = 7;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should correctly calculate points for multiple words formed by a placement', () => {
        const USER_INPUT = { row: 'b', col: 7, direction: 'v', word: 'vert' };
        GRID[3][2] = new Letter('a', 1);
        GRID[3][3] = new Letter('g', 2);
        GRID[3][4] = new Letter('e', 1);
        GRID[3][5] = new Letter('n', 1);
        GRID[3][6] = new Letter('t', 1);
        const EXPECTED_POINTS = 16;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should include bonuses from placed letters', () => {
        const USER_INPUT = { row: 'a', col: 8, direction: 'v', word: 'vert' };
        GRID[2][6] = new Letter('e', 1);
        GRID[2][7] = new Letter('t', 1);
        const EXPECTED_POINTS = 27;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculate points for a word that forms another word at the left', () => {
        const USER_INPUT = { row: 'b', col: 14, direction: 'v', word: 'non' };
        GRID[2][12] = new Letter('s', 1);
        GRID[2][13] = new Letter('o', 1);
        GRID[2][14] = new Letter('n', 1);
        const EXPECTED_POINTS = 3;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculate points for a word that forms another word at the right', () => {
        const USER_INPUT = { row: 'c', col: 4, direction: 'v', word: 'boire' };
        GRID[3][5] = new Letter('o', 1);
        GRID[3][6] = new Letter('n', 1);
        const EXPECTED_POINTS = 19;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should calculate points for letters placed above the position input', () => {
        const USER_INPUT = { row: 'd', col: 6, direction: 'v', word: 'rre' };
        GRID[2][6] = new Letter('t', 1);
        GRID[3][6] = new Letter('e', 1);

        GRID[3][7] = new Letter('t', 1);
        GRID[3][8] = new Letter('e', 1);
        const EXPECTED_POINTS = 7;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should include word bonuses for other words formed by the placement', () => {
        const USER_INPUT = { row: 'a', col: 8, direction: 'v', word: 'terre' };

        GRID[1][6] = new Letter('m', 2);
        GRID[1][7] = new Letter('e', 1);
        const EXPECTED_POINTS = 30;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });

    it('calculatePoints should give 50 bonus points if the player makes a bingo', () => {
        const USER_INPUT = { row: 'b', col: 9, direction: 'v', word: 'lettres' };
        const EXPECTED_POINTS = 59;
        const EARNED_POINTS = service.calculatePoints(USER_INPUT, GRID);
        expect(EARNED_POINTS).toBe(EXPECTED_POINTS);
    });
});
