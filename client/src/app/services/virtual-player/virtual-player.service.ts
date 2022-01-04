import { Injectable, Input } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants';
import { UserInput } from '@app/interfaces/user-input';
import { Letter } from '@app/letter';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { LetterBankService } from '@app/services/letter-bank/letter-bank.service';
import { LetterPlacementService } from '@app/services/letter-placement.service';
import { PlaceLetterService } from '@app/services/place-letter/place-letter.service';
import { PointsCalculatorService } from '@app/services/points-calculator.service';
import { WordValidatorService } from '@app/services/word-validator/word-validator.service';
import { WriteToBoxService } from '@app/services/write-to-box.service';

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    @Input() playerName: string;
    opponentIndex: number;
    adversary = ['Mark', 'Tom', 'John'];
    levels = ['Débutant', 'Expert'];
    opponentsBasic = ['Samir', 'Adam', 'Yassine'];
    opponentsExpert = ['Elon', 'Jeff', 'Bill'];
    opponentName: string;
    opponentLevel: string;
    possiblePlacements: Map<string, number> = new Map();
    isInDebugMode: boolean;
    virtualInput: UserInput;

    constructor(
        public gameStateService: GameStateService,
        public placeLetterService: PlaceLetterService,
        public letterBankService: LetterBankService,
        public wordValidatorService: WordValidatorService,
        public pointsCalculatorService: PointsCalculatorService,
        public letterPlacementService: LetterPlacementService,
        public writeToBoxService: WriteToBoxService,
    ) {
        this.opponentIndex = Math.floor(Math.random() * (this.adversary.length + 1));
        this.adversary = this.opponentsBasic;
        this.opponentName = this.adversary[this.opponentIndex];
        this.opponentLevel = this.levels[0];
    }

    changeVPLevel(newLevel: string) {
        if (newLevel === 'Expert' && this.adversary !== this.opponentsExpert) this.adversary = this.opponentsExpert;
        else if (newLevel === 'Débutant' && this.adversary !== this.opponentsBasic) this.adversary = this.opponentsBasic;
        this.opponentName = this.adversary[this.opponentIndex];
        this.opponentLevel = newLevel;
    }
    getOpponentName() {
        if (this.playerName !== this.opponentName) return this.adversary[this.opponentIndex];
        else {
            this.changeOpponentIndex();
            this.opponentName = this.adversary[this.opponentIndex];
            return this.opponentName;
        }
    }

    changeOpponentIndex() {
        if (this.opponentIndex === this.opponentsBasic.length - 1) this.opponentIndex = 0;
        else this.opponentIndex++;
    }
    findBestPlacements() {
        const grid = this.letterPlacementService.lettersGrid;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] !== null && grid[i][j] !== undefined) {
                    const verticalPos = String.fromCharCode(i + CONSTANTS.LETTER_OFFSET_ASCII);
                    const positionH = this.wordValidatorService.tileToCoordinates(verticalPos, j);
                    const positionV = this.wordValidatorService.tileToCoordinates(verticalPos, j);
                    const horizontalWord = this.detectWord(grid, positionH, true);
                    const verticalWord = this.detectWord(grid, positionV, false);
                    const possibleWordsH = this.findPotentialWords(horizontalWord);
                    const possibleWordsV = this.findPotentialWords(verticalWord);
                    for (const possibleWord of possibleWordsH) {
                        this.virtualInput = {
                            row: verticalPos,
                            col: positionH.y - possibleWord.indexOf(horizontalWord),
                            direction: 'h',
                            word: possibleWord,
                        };
                        if (this.virtualInput.col > 0 && this.virtualInput.col + possibleWord.length <= CONSTANTS.NUMBER_OF_TILES)
                            this.setPossiblePlacements(this.virtualInput, grid, possibleWord);
                    }
                    for (const possibleWord of possibleWordsV) {
                        const beginningRow = positionV.x - possibleWord.indexOf(verticalWord);
                        this.virtualInput = {
                            row: String.fromCharCode(beginningRow + CONSTANTS.LETTER_OFFSET_ASCII),
                            col: j,
                            direction: 'v',
                            word: possibleWord,
                        };
                        if (beginningRow > 0 && beginningRow + possibleWord.length <= CONSTANTS.NUMBER_OF_TILES)
                            this.setPossiblePlacements(this.virtualInput, grid, possibleWord);
                    }
                }
            }
        }
        this.findFirstPlacement();
    }
    findFirstPlacement() {
        if (this.possiblePlacements.size !== 0) return;
        const probability = Math.floor(Math.random() * CONSTANTS.MAX_PERCENTAGE);
        this.virtualInput = {
            row: 'h',
            col: 8,
            direction: 'h',
            word: '',
        };
        if (probability > CONSTANTS.HALF_MAXPERCENTAGE) this.virtualInput.direction = 'v';
        const possibleWords = this.findPossibleWords(this.virtualInput.word, this.copyRack(this.gameStateService.virtualRack));
        for (const word of possibleWords) {
            this.virtualInput.word = word;
            this.setPossiblePlacements(this.virtualInput, this.letterPlacementService.lettersGrid, word);
        }
    }
    setPossiblePlacements(virtualInput: UserInput, grid: Letter[][], possibleWord: string) {
        const tempGrid: Letter[][] = [];
        this.wordValidatorService.copyGrid(grid, tempGrid);
        if (this.wordValidatorService.validateWord(virtualInput, tempGrid)) {
            const points = this.pointsCalculatorService.calculatePoints(virtualInput, tempGrid);
            const vinput = virtualInput.row + virtualInput.col.toString() + virtualInput.direction + ' ' + possibleWord;
            this.possiblePlacements.set(vinput, points);
        }
    }
    findPotentialWords(word: string) {
        const availableLetters = this.copyRack(this.gameStateService.virtualRack);
        const placedLetters = this.wordValidatorService.stringArrayToLetterArray(word);
        for (const letter of placedLetters) availableLetters.push(letter);
        return this.findPossibleWords(word, availableLetters);
    }
    copyRack(rackToCopy: Letter[]) {
        const rack = [];
        for (const letter of rackToCopy) {
            rack.push(new Letter(letter.getLetter(), letter.getValue()));
        }
        return rack;
    }
    detectWord(grid: Letter[][], position: Vec2, isHorizontal: boolean) {
        const formedWord: Letter[] = [];
        const initialPosition = isHorizontal ? position.y : position.x;
        let index = initialPosition;
        index--;
        let pos = this.wordValidatorService.getPositionArray(index, position, isHorizontal);
        while (grid[pos[0]][pos[1]] != null) {
            formedWord.unshift(grid[pos[0]][pos[1]]);
            index--;
            pos = this.wordValidatorService.getPositionArray(index, position, isHorizontal);
        }
        const startIndex = index + 1;
        index = initialPosition;
        pos = this.wordValidatorService.getPositionArray(index, position, isHorizontal);
        while (grid[pos[0]][pos[1]] != null) {
            formedWord.push(grid[pos[0]][pos[1]]);
            index++;
            pos = this.wordValidatorService.getPositionArray(index, position, isHorizontal);
        }
        if (isHorizontal) position.y = startIndex;
        else position.x = startIndex;
        return this.wordValidatorService.letterArrayToString(formedWord);
    }

    playBestMove() {
        const WORD_POSITION = 4;
        if (this.possiblePlacements.size !== 0) {
            let bestMove = '';
            let bestPoints = 0;
            if (this.opponentLevel === 'Débutant') {
                do {
                    bestMove = this.chooseRandomPlay(this.possiblePlacements);
                } while (bestMove === '');
                const valueTest = this.possiblePlacements.get(bestMove);
                if (valueTest !== undefined) bestPoints = valueTest;
            } else {
                const sortedMoves = this.sortMoves();
                [bestMove] = sortedMoves.keys();
                [bestPoints] = sortedMoves.values();
            }
            const columnValue = this.decodeColumnValue(bestMove);
            const directionValue = this.decodeDirection(bestMove, columnValue);
            this.virtualInput = {
                row: bestMove.charAt(0),
                col: columnValue,
                direction: directionValue,
                word: this.wordValidatorService.removeUnnecessarySpaces(bestMove.substring(WORD_POSITION)),
            };
            if (this.virtualInput.col !== CONSTANTS.INCORRECT_VALUE && (this.virtualInput.direction === 'h' || this.virtualInput.direction === 'v')) {
                this.placeLetterService.virtualPlay(this.virtualInput);
                const message =
                    // eslint-disable-next-line prettier/prettier
                    'Mot "' +
                    this.virtualInput.word +
                    '" joué au ' +
                    this.virtualInput.row +
                    this.virtualInput.col +
                    ' en ' +
                    this.virtualInput.direction;
                this.writeToBoxService.write.emit(message + ' par le joueur virtuel');
                if (bestPoints !== undefined) this.pointsCalculatorService.changePoints(bestPoints, 1);
            }
            if (this.isInDebugMode) this.displayAltMoves();
            this.possiblePlacements = new Map();
        } else {
            this.exchangeAllLetters();
        }
    }

    sortMoves() {
        return new Map([...this.possiblePlacements.entries()].sort((placement, bestPlacement) => bestPlacement[1] - placement[1]));
    }

    chooseRandomPlay(sortedMoves: Map<string, number>): string {
        let chosenWord = '';
        const MAX_FIRST_LEVEL = 30;
        const MAX_SECOND_LEVEL = 70;
        const FIRST_MAX_RANGE = 6;
        const SECOND_MIN_RANGE = 7;
        const SECOND_MAX_RANGE = 12;
        const THIRD_MIN_RANGE = 13;
        const THIRD_MAX_RANGE = 18;
        const probaOfMove = Math.floor(Math.random() * CONSTANTS.MAX_PERCENTAGE);
        if (probaOfMove >= 0 && probaOfMove <= MAX_FIRST_LEVEL) {
            for (const [key, value] of sortedMoves) {
                if (value >= SECOND_MAX_RANGE && value >= SECOND_MIN_RANGE) {
                    chosenWord = key;
                    return chosenWord;
                }
            }
        } else if (probaOfMove > MAX_FIRST_LEVEL && probaOfMove <= MAX_SECOND_LEVEL) {
            for (const [key, value] of sortedMoves) {
                if (value >= 0 && value <= FIRST_MAX_RANGE) {
                    chosenWord = key;
                    return chosenWord;
                }
            }
        } else {
            for (const [key, value] of sortedMoves) {
                if (value <= THIRD_MAX_RANGE && value >= THIRD_MIN_RANGE) {
                    chosenWord = key;
                    return chosenWord;
                }
            }
        }
        return chosenWord;
    }
    decodeColumnValue(bestMove: string) {
        const patt1 = /[0-9]/g;
        const colonnes: string[] | null = bestMove.match(patt1);
        if (colonnes != null) {
            if (colonnes.length > 1) return CONSTANTS.TWO_NUMBERS_COLUMN + Number(colonnes[1]);
            else return Number(colonnes);
        } else return CONSTANTS.INCORRECT_VALUE;
    }

    decodeDirection(bestMove: string, column: number) {
        let offset: number;
        if (column >= CONSTANTS.TWO_NUMBERS_COLUMN) offset = 2;
        else if (column === CONSTANTS.INCORRECT_VALUE) return '';
        else offset = 1;
        const pos = bestMove.indexOf(column.toString()) + offset;
        return bestMove[pos];
    }

    findPossibleWords(wordToFind: string, availableLetters: Letter[]) {
        const possibleWords = [];
        const formableWords = [];
        for (const word of this.wordValidatorService.dictionary) {
            if (word.search(wordToFind) !== CONSTANTS.INCORRECT_VALUE) formableWords.push(word);
        }
        for (const word of formableWords) {
            if (this.hasRequiredLetters(word, availableLetters)) possibleWords.push(word);
        }
        return possibleWords;
    }

    hasRequiredLetters(word: string, letters: Letter[]) {
        const lettersCopy = [];
        for (const letter of letters) {
            lettersCopy.push(new Letter(letter.getLetter(), letter.getValue()));
        }
        return this.placeLetterService.hasRequiredLetters(lettersCopy, this.wordValidatorService.stringArrayToLetterArray(word));
    }
    findLetterIndex(letter: string, word: string) {
        for (let i = 0; i < word.length; i++) if (letter === word[i]) return i;
        return CONSTANTS.INCORRECT_VALUE;
    }

    updateRack() {
        for (const i of this.wordValidatorService.missingLetters) {
            this.gameStateService.virtualRack.forEach((element, index, array) => {
                if (element.getLetter() === i.getLetter()) array.splice(index, 1);
            });
        }
        while (this.gameStateService.virtualRack.length !== CONSTANTS.SIZE_OF_RACK)
            this.gameStateService.virtualRack.push(this.letterBankService.getLetter());
    }
    exchangeAllLetters() {
        const exchangedLetters = [];
        while (this.gameStateService.virtualRack.length > 0) {
            const letter = this.gameStateService.virtualRack.pop();
            if (letter !== undefined) {
                this.letterBankService.putBackLetter(letter);
                exchangedLetters.push(letter);
            }
        }
        while (this.gameStateService.virtualRack.length !== CONSTANTS.SIZE_OF_RACK && this.letterBankService.bank.length !== 0)
            this.gameStateService.virtualRack.push(this.letterBankService.getLetter());
        const message = 'Lettres "' + this.wordValidatorService.letterArrayToString(exchangedLetters) + '" échangées';
        this.writeToBoxService.write.emit(message + ' par le joueur virtuel');
        this.gameStateService.resetTimer();
    }
    virtualAction() {
        if (this.opponentLevel === 'Débutant') {
            const MAX_FIRST_LEVEL = 10;
            const MAX_SECOND_LEVEL = 20;
            const probaOfTurn = Math.floor(Math.random() * CONSTANTS.MAX_PERCENTAGE);
            if (probaOfTurn <= MAX_FIRST_LEVEL) this.gameStateService.resetTimer();
            else if (probaOfTurn > MAX_FIRST_LEVEL && probaOfTurn <= MAX_SECOND_LEVEL) {
                this.exchangeAllLetters();
            } else this.virtualPlaying();
        } else this.virtualPlaying();
    }
    getAltMoves() {
        const sortedMoves = this.sortMoves();
        const bestMovesMessage = [];
        let i = 0;
        for (const [key, value] of sortedMoves) {
            bestMovesMessage.push('Placement alternatif ' + i++ + ': ' + key + ' : ' + value);
            if (i > 3) return bestMovesMessage;
        }
        return bestMovesMessage;
    }
    displayAltMoves() {
        const altMoves = this.getAltMoves();
        for (let i = 1; i <= 3; i++) {
            this.writeToBoxService.write.emit(altMoves[i]);
        }
    }
    virtualPlaying() {
        this.findBestPlacements();
        this.playBestMove();
        this.updateRack();
    }
}
