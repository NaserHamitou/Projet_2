/* eslint-disable */
import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants';
import { UserInput } from '@app/interfaces/user-input';
import { Letter } from '@app/letter';
import { EventService } from '@app/services/event/event.service';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';
import { LetterPlacementService } from '@app/services/letter-placement.service';
import { ObjectivesService } from '@app/services/objectives/objectives.service';
import { PointsCalculatorService } from '@app/services/points-calculator.service';
import { RackService } from '@app/services/rack/rack.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { WordValidatorService } from '@app/services/word-validator/word-validator.service';
import { Subscription } from 'rxjs';
import { AudioManagerService } from '../audio/audio-manager.service';

export const CENTER_TEXT_X = 12;
export const CENTER_TEXT_Y = 24;

@Injectable({
    providedIn: 'root',
})
export class PlaceLetterService {
    canvasContext: CanvasRenderingContext2D;
    tempCanvasContext: CanvasRenderingContext2D;
    lettersGrid: Letter[][] = [];
    usedLetters: Letter[];
    row: string;
    column: string;
    orientation: string;
    word: string;
    clickEventSub: Subscription;
    serverValidate: boolean;

    constructor(
        public placementService: LetterPlacementService,
        public rackService: RackService,
        public gridCoordService: GridCoordinateService,
        public eventService: EventService,
        public wordValidatorService: WordValidatorService,
        public pointsCalculatorService: PointsCalculatorService,
        public gameState: GameStateService,
        public socketService: SocketService,
        public gameModeService: GameModeService,
        public objectivesService: ObjectivesService,
        readonly audioManager: AudioManagerService,
    ) {
        this.gridCoordService.currentPosRow.subscribe((posR) => (this.row = posR));
        this.gridCoordService.currentPosCol.subscribe((posC) => (this.column = posC));
        this.gridCoordService.currentLetter.subscribe((letr) => (this.word = letr));
        this.gridCoordService.currentOrientation.subscribe((orient) => (this.orientation = orient));
        for (let i = 0; i <= CONSTANTS.NUMBER_OF_TILES + 1; i++) {
            this.lettersGrid[i] = [];
        }
        this.serverValidate = true;
        if (!this.gameModeService.isPlayingSolo) {
            this.multiplayerSockets();
        }
    }

    player2Validation(userInput: UserInput, rack: Letter[]) {
        const playerRack = this.rackService.reconstructLetterArray(rack);
        if (this.socketService.isHost) {
            const prePlacementGrid: Letter[][] = [];
            this.wordValidatorService.copyGrid(this.placementService.lettersGrid, prePlacementGrid);
            const isPlacementValid = this.placementService.validatePlacementV2(userInput);
            const isWordValid = this.wordValidatorService.validateWord(userInput, this.placementService.lettersGrid);
            const hasLetters = this.hasRequiredLetters(playerRack, this.wordValidatorService.missingLetters);
            this.serverValidation();
            if (isWordValid && isPlacementValid && hasLetters && this.serverValidate) {
                const earnedPoints = this.pointsCalculatorService.calculatePoints(userInput, prePlacementGrid);
                this.pointsCalculatorService.changePoints(earnedPoints, 1);
                this.changeWordInput(userInput);
                this.keepLetterOnBoard();
                this.updateVirtualPlayGrid(userInput);
                this.rackService.fillOutRack(playerRack);
                try {
                    this.socketService.socket.emit('player2Results', playerRack, earnedPoints);
                } catch {}
                this.gridCoordService.changeLetter(userInput.word);
                this.gridCoordService.changeOrientation(userInput.direction);
                this.objectivesService.setIsPlayValid(false);
            } else {
                try {
                    this.socketService.socket.emit('cancelPlayer2', playerRack, this.usedLetters);
                } catch {}
            }
        }
    }

    displayPlayer2(updatedRack: Letter[], earnedPoints: number) {
        if (!this.socketService.isHost) {
            this.keepLetterOnBoard();
            this.pointsCalculatorService.changePoints(earnedPoints, 0);
            this.rackService.letterRack = this.rackService.reconstructLetterArray(updatedRack);
            this.rackService.changeRack(this.rackService.letterRack);
        }
    }

    displayPlayer1(earnedPoints: number, userInput: UserInput) {
        if (!this.socketService.isHost) {
            this.changeWordInput(userInput);
            this.keepLetterOnBoard();
            this.pointsCalculatorService.changePoints(earnedPoints, 1);
        }
    }

    cancelPlayer2(playerRack: Letter[], usedLetters: Letter[]) {
        if (!this.socketService.isHost) {
            this.rackService.letterRack = this.rackService.reconstructLetterArray(playerRack);
            this.rackService.changeRack(this.rackService.letterRack);
            this.waitAndCancel(this.rackService.reconstructLetterArray(usedLetters));
        }
    }

    multiplayerSockets() {
        try {
            this.socketService.socket.on('validatePlayer2Word', async (userInput: UserInput, rack: Letter[]) => {
                this.player2Validation(userInput, rack);
            });

            this.socketService.socket.on('displayPlayer2Play', (updatedRack, earnedPoints) => {
                this.displayPlayer2(updatedRack, earnedPoints);
            });

            this.socketService.socket.on('displayPlayer1Play', (earnedPoints: number, userInput: UserInput) => {
                this.displayPlayer1(earnedPoints, userInput);
            });

            this.socketService.socket.on('canceledPlay', (playerRack, usedLetters) => {
                this.cancelPlayer2(playerRack, usedLetters);
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('Server not connected');
        }
    }

    playTheWord() {
        const userInput: UserInput = {
            row: this.row,
            col: Number(this.column),
            direction: this.orientation,
            word: this.word,
        };

        this.placeLettersOnBoard(); // both players place the word locally temporarily (animation)
        if (this.socketService.isHost || this.gameModeService.isPlayingSolo) {
            const prePlacementGrid: Letter[][] = [];
            this.wordValidatorService.copyGrid(this.placementService.lettersGrid, prePlacementGrid);
            const isPlacementValid = this.placementService.validatePlacementV2(userInput);
            const isWordValid = this.wordValidatorService.validateWord(userInput, this.placementService.lettersGrid);
            const hasLetters = this.hasRequiredLetters(this.rackService.letterRack, this.wordValidatorService.missingLetters);
            // eslint-disable-next-line no-console
            this.serverValidation();
            if (isWordValid && isPlacementValid && hasLetters && this.serverValidate) {
                const earnedPoints = this.pointsCalculatorService.calculatePoints(userInput, prePlacementGrid);
                this.pointsCalculatorService.changePoints(earnedPoints, 0);
                this.keepLetterOnBoard();
                this.rackService.fillOutRack(this.rackService.letterRack);
                this.rackService.changeRack(this.rackService.letterRack);
                // this.updateVirtualPlayGrid(userInput);
                // // console.log pour les lettres avec leur position dans la map
                // this.gameState.lettersOnGrid.forEach((value: string, key: string) => {
                //     console.log(key + ' ; ' + value);
                // });
                //this.audioManager.approvedSound.play().finally(() => (this.audioManager.approvedSound.preload = '0'));
                if (!this.gameModeService.isPlayingSolo) {
                    try {
                        this.socketService.socket.emit('Player1Input', earnedPoints, userInput);
                    } catch {}
                }
                this.objectivesService.setIsPlayValid(true);
            } else {
                this.waitAndCancel(this.usedLetters);
            }
        } else {
            try {
                this.socketService.socket.emit('Player2Input', userInput, this.rackService.letterRack);
            } catch {}
        }
    }

    virtualPlay(userInput: UserInput) {
        this.wordValidatorService.validateWord(userInput, this.placementService.lettersGrid);
        this.changeWordInput(userInput);
        this.placeLettersOnBoard();
        this.keepLetterOnBoard();
    }

    serverValidation() {
        let word = '';
        for (const letter of this.wordValidatorService.formedWord) word += letter.getLetter();
        if (this.gameModeService.isPlayingSolo) {
            this.serverValidate = true;
            return;
        }

        try {
            this.socketService.socket.emit('validationRequest', word);
        } catch {
            this.serverValidate = true;
        }
        try {
            this.socketService.socket.on('serverValidation', (response) => {
                this.serverValidate = response;
            });
        } catch {
            this.serverValidate = true;
        }
    }

    placeLettersOnBoard() {
        let horz = 0;
        let vert = 0;
        if (this.orientation === 'v') vert = CONSTANTS.TILE_SIZE;
        if (this.orientation === 'h') horz = CONSTANTS.TILE_SIZE;
        const coord = this.gridCoordService.findPosition(this.row, Number(this.column));
        for (let i = 0; i < this.word.length; i++) this.drawOnTempCanvas(coord.x + horz * i, coord.y + vert * i, this.word[i]);
    }

    keepLetterOnBoard() {
        let horz = 0;
        let vert = 0;
        if (this.orientation === 'v') vert = CONSTANTS.TILE_SIZE;
        if (this.orientation === 'h') horz = CONSTANTS.TILE_SIZE;
        const coord = this.gridCoordService.findPosition(this.row, Number(this.column));
        for (let i = 0; i < this.word.length; i++) this.drawLettersOnGrid(coord.x + horz * i, coord.y + vert * i, this.word[i]);
        this.removeLetterOnGrid();
    }

    removeLetterOnGrid() {
        this.tempCanvasContext.clearRect(0, 0, CONSTANTS.DEFAULT_WIDTH_BOARD, CONSTANTS.DEFAULT_WIDTH_BOARD);
    }

    waitAndCancelVirtual() {
        setTimeout(() => {
            this.removeLetterOnGrid();
        }, CONSTANTS.THREE_SECONDS);
    }

    waitAndCancel(letters: Letter[]) {
        setTimeout(() => {
            this.removeLetterOnGrid();
            this.rackService.putBackInRack(letters);
            //this.audioManager.wrongSound.play().catch();
        }, CONSTANTS.THREE_SECONDS);
    }

    drawLettersOnGrid(posX: number, posY: number, lettre: string) {
        this.canvasContext.fillStyle = 'rgb(255,250,232)';
        this.canvasContext.strokeStyle = 'rgb(215,199,179)';
        this.canvasContext.fillRect(posX + 3, posY + 3, CONSTANTS.DRAWING_TILE, CONSTANTS.DRAWING_TILE);
        this.canvasContext.lineWidth = 3;
        this.canvasContext.strokeRect(posX + 3, posY + 3, CONSTANTS.DRAWING_TILE, CONSTANTS.DRAWING_TILE);

        this.canvasContext.fillStyle = 'rgb(19,42,19)';
        this.canvasContext.font = '20px Arial';
        this.canvasContext.fillText(lettre, posX + CENTER_TEXT_X, posY + CONSTANTS.CENTER_TILE);
    }

    drawOnTempCanvas(posX: number, posY: number, lettre: string) {
        this.tempCanvasContext.shadowBlur = 0;
        this.tempCanvasContext.fillStyle = 'rgb(255,250,232)';
        this.tempCanvasContext.strokeStyle = 'rgb(215,199,179)';
        this.tempCanvasContext.fillRect(posX + 3, posY + 3, CONSTANTS.DRAWING_TILE, CONSTANTS.DRAWING_TILE);
        this.tempCanvasContext.lineWidth = 3;
        this.tempCanvasContext.strokeRect(posX + 3, posY + 3, CONSTANTS.DRAWING_TILE, CONSTANTS.DRAWING_TILE);

        this.tempCanvasContext.fillStyle = 'rgb(19,42,19)';
        this.tempCanvasContext.font = '20px Arial';
        this.tempCanvasContext.fillText(lettre, posX + CENTER_TEXT_X, posY + CENTER_TEXT_Y);
    }

    highLightCase(coord: Vec2, orientation: string) {
        if (orientation === 'h') {
            this.tempCanvasContext.beginPath();
            this.tempCanvasContext.strokeStyle = '#ccff33';
            this.tempCanvasContext.shadowBlur = 20;
            this.tempCanvasContext.shadowColor = '#ffd60a';
            this.tempCanvasContext.lineWidth = 5;
            this.tempCanvasContext.lineCap = 'round';
            this.tempCanvasContext.strokeRect(coord.x, coord.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
            this.tempCanvasContext.closePath();
        }
        if (orientation === 'v') {
            this.tempCanvasContext.beginPath();
            this.tempCanvasContext.strokeStyle = '#ccff33';
            this.tempCanvasContext.shadowBlur = 20;
            this.tempCanvasContext.shadowColor = '#ffd60a';
            this.tempCanvasContext.lineWidth = 5;
            this.tempCanvasContext.lineCap = 'round';
            this.tempCanvasContext.strokeRect(coord.x, coord.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
            this.tempCanvasContext.closePath();
        }
    }

    eraseTile(posX: number, posY: number, orientation: string) {
        if (orientation === 'h') this.tempCanvasContext.clearRect(posX, 0, CONSTANTS.DEFAULT_WIDTH, CONSTANTS.DEFAULT_WIDTH);
        if (orientation === 'v') this.tempCanvasContext.clearRect(0, posY, CONSTANTS.DEFAULT_WIDTH, CONSTANTS.DEFAULT_WIDTH);
    }
    hasRequiredLetters(letterRack: Letter[], missingLetters: Letter[]): boolean {
        // Check if the player has the required letters to form the word
        this.usedLetters = [];
        for (const letter of missingLetters) {
            if (letterRack.some((letterToCheck) => letterToCheck.getLetter() === letter.getLetter())) {
                const idx = letterRack.findIndex((letterToFind) => letterToFind.getLetter() === letter.getLetter());
                this.usedLetters.push(letter);
                letterRack.splice(idx, 1);
            } else {
                return false;
            }
        }
        return true;
    }

    updateVirtualPlayGrid(userInput: UserInput) {
        let key: string = userInput.row + userInput.col;
        for (let i of userInput.word) {
            this.gameState.lettersOnGrid.set(key, i);
            key = this.changeKey(userInput.direction, key);
        }
    }

    changeKey(direction: string, previousKey: string): string {
        if (direction === 'h') {
            let verticalPos = Number(previousKey.substring(1)) + 1;
            const newKey: string = previousKey[0] + verticalPos;
            return newKey;
        } else {
            let row = previousKey[0];
            let col = Number(previousKey.substring(1));
            let vecKey: Vec2 = this.wordValidatorService.tileToCoordinates(row, col);
            let u = vecKey.x + CONSTANTS.LETTER_OFFSET_ASCII + 1; // ;
            let verticalPos = String.fromCharCode(u);
            const newKey: string = verticalPos + col;
            return newKey;
        }
    }

    private changeWordInput(userInput: UserInput) {
        this.row = userInput.row;
        this.column = userInput.col.toString();
        this.orientation = userInput.direction;
        this.word = userInput.word;
    }
}
