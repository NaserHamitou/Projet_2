import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants';
import { UserInput } from '@app/interfaces/user-input';
import { Letter } from '@app/letter';
import { WordValidatorService } from '@app/services/word-validator/word-validator.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { GridService } from './grid/grid.service';

const BONUS_POINTS_VALUE = 50;

@Injectable({
    providedIn: 'root',
})
export class PointsCalculatorService {
    colorGrid: string[][] = [];
    totalPointsDisplay: number[];
    currentPoints: Observable<number>;
    playerToCredit: Observable<number>;
    private points = new BehaviorSubject<number>(0);
    private playerNumber = new BehaviorSubject<number>(0);
    constructor(private wordValidator: WordValidatorService, public gridService: GridService) {
        this.currentPoints = this.points.asObservable();
        this.playerToCredit = this.playerNumber.asObservable();
        this.wordValidator.missingLetters = [];
        this.totalPointsDisplay = [0, 0];
    }

    changePoints(points: number, value: number) {
        this.playerNumber.next(value);
        this.points.next(points);
        this.totalPointsDisplay[value] += points;
    }

    calculatePoints(userInput: UserInput, grid: Letter[][]): number {
        if (userInput.direction.toLowerCase() === 'v') {
            return this.calculateAnyDirectionPoints(grid, userInput, false);
        } else if (userInput.direction.toLowerCase() === 'h') {
            return this.calculateAnyDirectionPoints(grid, userInput, true);
        }
        return CONSTANTS.INCORRECT_VALUE;
    }

    initializeColorGrid() {
        for (let i = 1; i <= CONSTANTS.NUMBER_OF_TILES; i++) {
            this.colorGrid[i] = [];
            for (let j = 1; j <= CONSTANTS.NUMBER_OF_TILES; j++) {
                this.colorGrid[i][j] = 'regular';
            }
        }
        let index = 0;
        this.colorGrid[1][1] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[1][8] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[1][15] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[8][1] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[8][15] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[15][1] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[15][8] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[15][15] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[4][1] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[12][1] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[7][3] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[9][3] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[1][4] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[8][4] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[15][4] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[3][7] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[7][7] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[9][7] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[13][7] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[4][8] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[12][8] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[3][9] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[7][9] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[9][9] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[13][9] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[1][12] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[8][12] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[15][12] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[7][13] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[9][13] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[4][15] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[12][15] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[2][2] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[14][2] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[2][14] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[14][14] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[3][3] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[13][3] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[3][13] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[13][13] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[4][4] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[12][4] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[4][12] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[12][12] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[5][5] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[11][5] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[5][11] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[11][11] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[6][2] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[10][2] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[6][6] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[10][6] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[6][10] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[10][10] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[6][14] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[10][14] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[2][6] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[14][6] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[2][10] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[14][10] = this.getColor(this.gridService.specialCaseArray[index++].color);
        this.colorGrid[8][8] = this.getColor(this.gridService.specialCaseArray[index++].color);
    }

    private calculateAnyDirectionPoints(grid: Letter[][], userInput: UserInput, isHorizontal: boolean) {
        let i;
        let j;
        let color = '';
        let totalPoints = 0;
        const letterMultiplier = 1;
        const wordMultiplier = 0;
        const multipliers = { wordFactor: wordMultiplier, letterFactor: letterMultiplier };

        // Count points for the placed word
        const position = this.wordValidator.tileToCoordinates(userInput.row, userInput.col);
        const inputWord: Letter[] = [];
        const wordArray = Array.from(userInput.word.toLowerCase());

        // convert the input word into a Letter array
        for (i = 0; i < userInput.word.length; i++) {
            const letterIndex = this.wordValidator.getLetterNumber(wordArray[i]);
            inputWord[i] = new Letter(wordArray[i], CONSTANTS.alphabet[letterIndex - 1].getValue()); // -1 since the first element starts at 0
        }

        let positionOnGrid = { position, grid };
        const formedWord = this.wordValidator.formWord(positionOnGrid, inputWord, isHorizontal);

        const startIndex = isHorizontal ? position.y : position.x;
        for (i = startIndex, j = 0; i < startIndex + formedWord.length; i++, j++) {
            const pos = this.wordValidator.getPositionArray(i, position, isHorizontal);
            color = this.colorGrid[pos[0]][pos[1]];
            const currentPosition: Vec2 = { x: pos[0], y: pos[1] };
            positionOnGrid = { position: currentPosition, grid };
            this.changePointMultipliers(multipliers, positionOnGrid, color);
            totalPoints += formedWord[j].getValue() * multipliers.letterFactor;
        }
        if (multipliers.wordFactor !== 0) totalPoints *= multipliers.wordFactor; // total for placed word

        // Reset multipliers for other words
        multipliers.wordFactor = 0;
        multipliers.letterFactor = 1;

        // Calculate points for other words formed by placement
        let formedWordsPoints = 0;
        let index: number;
        let numberOfLettersPlaced = 0;
        let newWordFormed = false;
        for (i = startIndex, j = 0; i < startIndex + formedWord.length; i++, j++) {
            let pos = this.wordValidator.getPositionArray(i, position, isHorizontal);
            if (this.isTileEmpty(grid, pos[0], pos[1])) {
                // we only count points for words formed by a newly placed letter
                const startPosition = isHorizontal ? position.x : position.y;
                numberOfLettersPlaced++;
                color = this.colorGrid[pos[0]][pos[1]];
                const currentPosition: Vec2 = { x: pos[0], y: pos[1] };
                positionOnGrid = { position: currentPosition, grid };
                this.changePointMultipliers(multipliers, positionOnGrid, color);
                formedWordsPoints += formedWord[j].getValue() * multipliers.letterFactor;

                index = startPosition - 1;
                pos = this.wordValidator.getPositionArray(index, { x: i, y: i }, isHorizontal);
                while (grid[pos[1]][pos[0]] != null) {
                    newWordFormed = true;
                    formedWordsPoints += grid[pos[1]][pos[0]].getValue();
                    index--;
                    pos = this.wordValidator.getPositionArray(index, { x: i, y: i }, isHorizontal);
                }

                index = startPosition + 1;
                pos = this.wordValidator.getPositionArray(index, { x: i, y: i }, isHorizontal);
                while (grid[pos[1]][pos[0]] != null) {
                    newWordFormed = true;
                    formedWordsPoints += grid[pos[1]][pos[0]].getValue();
                    index++;
                    pos = this.wordValidator.getPositionArray(index, { x: i, y: i }, isHorizontal);
                }
                if (newWordFormed) {
                    if (multipliers.wordFactor !== 0) {
                        totalPoints += formedWordsPoints * multipliers.wordFactor;
                    } else {
                        totalPoints += formedWordsPoints;
                    }
                } else {
                    multipliers.wordFactor = 0;
                    multipliers.letterFactor = 1;
                }
                formedWordsPoints = 0;
                newWordFormed = false;
            }
        }
        if (numberOfLettersPlaced === CONSTANTS.SIZE_OF_RACK) totalPoints += BONUS_POINTS_VALUE;
        return totalPoints;
    }
    private changePointMultipliers(
        multipliers: { wordFactor: number; letterFactor: number },
        positionOnGrid: { position: Vec2; grid: Letter[][] },
        color: string,
    ) {
        const position = positionOnGrid.position;
        const grid = positionOnGrid.grid;
        switch (color) {
            case 'pink':
                if (this.isTileEmpty(grid, position.x, position.y)) {
                    multipliers.wordFactor += 2;
                }
                break;
            case 'red':
                if (this.isTileEmpty(grid, position.x, position.y)) multipliers.wordFactor += 3;
                break;
            case 'lightBlue':
                if (!this.isTileEmpty(grid, position.x, position.y)) {
                    multipliers.letterFactor = 1;
                } else {
                    multipliers.letterFactor = 2;
                }
                break;
            case 'blue':
                if (!this.isTileEmpty(grid, position.x, position.y)) {
                    multipliers.letterFactor = 1;
                } else {
                    multipliers.letterFactor = 3;
                }
                break;
            case 'regular':
                multipliers.letterFactor = 1;
        }
    }
    private isTileEmpty(grid: Letter[][], xIndex: number, yIndex: number) {
        return grid[xIndex][yIndex] == null;
    }
    private getColor(color: string): string {
        if (color === 'rgba(255, 128, 0, 0.7)') return 'red';
        if (color === 'rgba(8, 177, 248, 0.7)') return 'lightBlue';
        if (color === 'rgba(0, 76, 153, 0.7)') return 'blue';
        return 'pink';
    }
}
