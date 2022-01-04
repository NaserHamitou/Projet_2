import { Injectable } from '@angular/core';
import * as CONSTANTS from '@app/constants';
import { UserInput } from '@app/interfaces/user-input';
import { Letter } from '@app/letter';
import { GameStateService } from '@app/services/game-state/game-state.service';

const CHAR_OFFSET = 96;

@Injectable({
    providedIn: 'root',
})
export class LetterPlacementService {
    gridOfLetters: string[][];
    placementValid: boolean;
    isGameBegin: boolean;
    lettersGrid: Letter[][] = [];

    constructor(public gameState: GameStateService) {
        for (let i = 0; i <= CONSTANTS.NUMBER_OF_TILES + 1; i++) {
            this.lettersGrid[i] = [];
        }
    }

    getGrid(): Letter[][] {
        return this.lettersGrid;
    }

    validatePlacementV2(userInput: UserInput): boolean {
        const row = userInput.row;
        const column = String(userInput.col);
        const orientation = userInput.direction;
        const letters = userInput.word;
        let isValid = false;
        // First Play
        const pos = row + column;
        if (pos === 'h8') {
            return true;
        }

        // Verification for vertical word
        if (orientation === 'v') isValid = this.checkVerticalWord(letters, row, column);
        // Verification for horizontal word
        if (orientation === 'h') isValid = this.checkHorizontalWord(letters, row, column);
        return isValid;
    }

    checkVerticalWord(letters: string, row: string, column: string): boolean {
        const posX = row.toLowerCase().charCodeAt(0) - CHAR_OFFSET;
        const posY = Number(column);
        const wordLength = letters.length;

        // Check the sides
        for (let i = 0; i < wordLength; i++) {
            if (this.lettersGrid[posX + i][posY + 1] != null || this.lettersGrid[posX + i][posY - 1] != null) {
                return true;
            }
        }
        // Check the edges
        if (this.lettersGrid[posX - 1][posY] != null || this.lettersGrid[posX + wordLength][posY] != null) {
            return true;
        }
        return false;
    }

    checkHorizontalWord(letters: string, row: string, column: string): boolean {
        const posX = row.toLowerCase().charCodeAt(0) - CHAR_OFFSET;
        const posY = Number(column);

        // Check the sides
        for (let i = 0; i < letters.length; i++) {
            if (this.lettersGrid[posX + 1][posY + i] != null || this.lettersGrid[posX - 1][posY + i] != null) {
                return true;
            }
        }
        // Check the edges
        if (this.lettersGrid[posX][posY - 1] != null || this.lettersGrid[posX][posY + letters.length] != null) {
            return true;
        }
        return false;
    }
}
