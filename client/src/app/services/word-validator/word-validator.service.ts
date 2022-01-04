// Ligne 50 https://www.codegrepper.com/code-examples/javascript/get+only+numbers+from+string+js
import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants';
import { DictionaryData } from '@app/interfaces/dictionary-data';
import { UserInput } from '@app/interfaces/user-input';
import { Letter } from '@app/letter';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { RackService } from '@app/services/rack/rack.service';
import { Subscription } from 'rxjs';
import data from 'src/assets/dictionnary.json';

@Injectable({
    providedIn: 'root',
})
export class WordValidatorService {
    dictionaryData = data as DictionaryData;
    dictionary: string[];
    formedWord: Letter[];
    missingLetters: Letter[];
    subscription: Subscription;
    isPlaying: boolean;

    constructor(public rackService: RackService, public gameStateService: GameStateService) {
        this.dictionary = this.dictionaryData.words;
        this.subscription = gameStateService.isPlayingChange.subscribe((value) => {
            this.isPlaying = value;
        });
    }

    copyGrid(grid: Letter[][], tempGrid: Letter[][]) {
        this.initializeGrid(tempGrid);
        for (let i = 0; i <= CONSTANTS.NUMBER_OF_TILES + 1; i++) {
            for (let j = 0; j <= CONSTANTS.NUMBER_OF_TILES + 1; j++) {
                if (grid[i][j] != null) tempGrid[i][j] = new Letter(grid[i][j].getLetter(), grid[i][j].getValue());
            }
        }
    }

    tileToCoordinates(row: string, col: number) {
        const coords: Vec2 = {
            x: row.toLowerCase().charCodeAt(0) - CONSTANTS.LETTER_OFFSET_ASCII,
            y: col,
        };
        return coords;
    }

    validateWord(userInput: UserInput, grid: Letter[][]) {
        this.missingLetters = [];
        if (userInput.direction.toLowerCase() === 'v') return this.validateAnyDirectionWord(userInput, grid, false);
        else if (userInput.direction.toLowerCase() === 'h') return this.validateAnyDirectionWord(userInput, grid, true);
        else return false;
    }

    letterArrayToString(letterArray: Letter[]) {
        let str = '';
        for (const letter of letterArray) {
            str += letter.getLetter();
        }
        return str;
    }
    getLetterNumber(letter: string): number {
        if (letter === '*') return CONSTANTS.alphabet.length - 1;
        else if (letter === undefined) return CONSTANTS.INCORRECT_VALUE;
        else return letter.toLowerCase().charCodeAt(0) - CONSTANTS.LETTER_OFFSET_ASCII;
    }

    formWord(positionOnGrid: { position: Vec2; grid: Letter[][] }, inputWord: Letter[], isHorizontal: boolean) {
        const formedWord: Letter[] = [];
        const emptyWord: Letter[] = [];
        const position = positionOnGrid.position;
        const grid = positionOnGrid.grid;
        const initialPosition = isHorizontal ? position.y : position.x;

        let index = initialPosition;
        index--;
        let pos = this.getPositionArray(index, position, isHorizontal);
        while (grid[pos[0]][pos[1]] !== undefined && grid[pos[0]][pos[1]] != null) {
            formedWord.unshift(grid[pos[0]][pos[1]]);
            index--;
            pos = this.getPositionArray(index, position, isHorizontal);
        }

        const startIndex = index + 1;
        index = initialPosition;
        pos = this.getPositionArray(index, position, isHorizontal);

        for (const letter of inputWord) {
            formedWord.push(letter);
            if (grid[pos[0]][pos[1]] == null || grid[pos[0]][pos[1]].getLetter() !== letter.getLetter()) {
                this.missingLetters.push(letter);
            }
            index++;
            pos = this.getPositionArray(index, position, isHorizontal);
        }

        while (grid[pos[0]][pos[1]] !== undefined && grid[pos[0]][pos[1]] != null) {
            formedWord.push(grid[pos[0]][pos[1]]);
            index++;
            pos = this.getPositionArray(index, position, isHorizontal);
        }
        if (isHorizontal) position.y = startIndex;
        else position.x = startIndex;

        if (startIndex + formedWord.length > CONSTANTS.NUMBER_OF_TILES) return emptyWord;
        return formedWord;
    }

    stringArrayToLetterArray(stringArray: string) {
        const wordArray = Array.from(stringArray);
        const inputWord: Letter[] = [];
        for (let i = 0; i < stringArray.length; i++) {
            const letterIndex = this.getLetterNumber(wordArray[i]);
            if (letterIndex > CONSTANTS.INCORRECT_VALUE) inputWord[i] = new Letter(wordArray[i], CONSTANTS.alphabet[letterIndex - 1].getValue());
        }
        return inputWord;
    }

    removeUnnecessarySpaces(wordToCheck: string): string {
        const spacePos = wordToCheck.indexOf(' ');
        if (spacePos !== CONSTANTS.INCORRECT_VALUE) {
            if (spacePos === 0) return wordToCheck.slice(spacePos + 1);
            /*
            else if (spacePos === wordToCheck.length - 1) return wordToCheck.slice(spacePos + 1);
            else {
                const returnedWord = wordToCheck.slice(0, spacePos) + wordToCheck.slice(spacePos + 1);
                return returnedWord;
            }
            */
        }
        return wordToCheck;
    }

    getPositionArray(index: number, position: Vec2, isHorizontal: boolean): number[] {
        if (isHorizontal) {
            return [position.x, index];
        }
        return [index, position.y];
    }

    private validateAnyDirectionWord(decodedInput: UserInput, grid: Letter[][], isHorizontal: boolean) {
        let i;
        let j;
        const tempGrid: Letter[][] = [];
        this.copyGrid(grid, tempGrid);
        const position: Vec2 = this.tileToCoordinates(decodedInput.row, decodedInput.col);
        const inputWord = this.stringArrayToLetterArray(decodedInput.word);
        const positionOnGrid = { position, grid: tempGrid };
        this.formedWord = this.formWord(positionOnGrid, inputWord, isHorizontal);

        if (this.missingLetters.length === 0 || this.formedWord.length === 0) return false;
        const startIndex = isHorizontal ? position.y : position.x;
        // verify if the word matches the letters on the grid and add them to the grid if the tile is empty
        for (j = startIndex, i = 0; j < startIndex + this.formedWord.length; j++, i++) {
            const pos = this.getPositionArray(j, position, isHorizontal);
            if (!(tempGrid[pos[0]][pos[1]] == null || tempGrid[pos[0]][pos[1]].getLetter() === this.formedWord[i].getLetter())) return false;
            else if (tempGrid[pos[0]][pos[1]] == null) {
                tempGrid[pos[0]][pos[1]] = this.formedWord[i];
            }
        }

        // if the completed word isn't in the dictionnary, the word isn't valid
        if (!this.isInDictionary(this.letterArrayToString(this.formedWord))) return false;
        // If there are any invalid words formed vertically, the placement is invalid.
        let perpendicularWord: Letter[] = [];
        let index: number;
        for (i = startIndex; i < startIndex + this.formedWord.length; i++) {
            const startPosition = isHorizontal ? position.x : position.y;
            index = startPosition - 1;
            let pos = this.getPositionArray(index, { x: i, y: i }, isHorizontal);
            while (tempGrid[pos[1]][pos[0]] != null) {
                perpendicularWord.unshift(tempGrid[pos[1]][pos[0]]);
                index--;
                pos = this.getPositionArray(index, { x: i, y: i }, isHorizontal);
            }

            pos = this.getPositionArray(i, position, isHorizontal);
            perpendicularWord.push(tempGrid[pos[0]][pos[1]]);

            index = startPosition + 1;
            pos = this.getPositionArray(index, { x: i, y: i }, isHorizontal);
            while (tempGrid[pos[1]][pos[0]] != null) {
                perpendicularWord.push(tempGrid[pos[1]][pos[0]]);
                index++;
                pos = this.getPositionArray(index, { x: i, y: i }, isHorizontal);
            }

            // Verify if word is in the dictionnary.
            if (!this.isInDictionary(this.letterArrayToString(perpendicularWord)) && perpendicularWord.length > 1) return false;

            perpendicularWord = []; // empty the array if there are no words on top or under
        }
        this.copyGrid(tempGrid, grid);
        return true;
    }

    private isInDictionary(wordToCheck: string) {
        // Making sure the word is being recognized whether or not there are capital letters and/or accents (or special characters).
        // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
        const foundWordIndex: number = this.binarySearch(
            wordToCheck
                .normalize('NFD')
                .replace(/\p{Diacritic}/gu, '')
                .toLowerCase(),
        );
        if (foundWordIndex !== CONSTANTS.INCORRECT_VALUE) {
            return true;
        }
        return false;
    }

    private initializeGrid(tempGrid: Letter[][]) {
        for (let i = 0; i <= CONSTANTS.NUMBER_OF_TILES + 1; i++) {
            tempGrid[i] = [];
        }
    }

    // source : https://gist.github.com/zzlalani/d3fbc4810089b583d97d7c8f30b52b19
    private binarySearch(wordToCheck: string): number {
        let start = 0;
        let end: number = this.dictionary.length - 1;
        let mid: number;
        let index = -1;
        while (start <= end) {
            mid = Math.floor((end + start) / 2);
            if (this.dictionary[mid] === wordToCheck) {
                index = mid;
                break;
            } else {
                if (this.dictionary[mid] < wordToCheck) {
                    start = mid + 1;
                } else {
                    end = mid - 1;
                }
            }
        }
        return index;
    }
}
