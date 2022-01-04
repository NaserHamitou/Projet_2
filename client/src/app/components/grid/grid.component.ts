import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as CONSTANTS from '@app/constants';
import { AudioManagerService } from '@app/services/audio/audio-manager.service';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { GameParametersService } from '@app/services/game-parameters.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';
import { GridService } from '@app/services/grid/grid.service';
import { LetterBankService } from '@app/services/letter-bank/letter-bank.service';
import { MousePlaceLetterService } from '@app/services/mouse-place-letter/mouse-place-letter.service';
import { MousePositionService } from '@app/services/mouse-position/mouse-position.service';
import { PlaceLetterService } from '@app/services/place-letter/place-letter.service';
import { PointsCalculatorService } from '@app/services/points-calculator.service';
import { RackService } from '@app/services/rack/rack.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { WordValidatorService } from '@app/services/word-validator/word-validator.service';
import { WriteToBoxService } from '@app/services/write-to-box.service';
import { Subscription } from 'rxjs';

export const START_FROM_END = -1;
export const ONEPLUS_SECONDS = 1100;
export const CHAR_OFFSET = 96;
@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements AfterViewInit, OnInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('mouseCanvas', { static: false }) private mouseCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('selectCanvas', { static: false }) private selectCanvas!: ElementRef<HTMLCanvasElement>;

    font: number = CONSTANTS.DEFAULT_FONT_SIZE;
    subscription: Subscription;
    passedCount: number;
    displayEndGameComponent: boolean;
    private canvasSize = { x: CONSTANTS.DEFAULT_WIDTH, y: CONSTANTS.DEFAULT_WIDTH };

    constructor(
        readonly gridService: GridService,
        public mousePositionService: MousePositionService,
        public gridCoord: GridCoordinateService,
        public gameStateService: GameStateService,
        public placeLetterService: PlaceLetterService,
        public rackService: RackService,
        public gameParametersService: GameParametersService,
        public pointCalculator: PointsCalculatorService,
        public writeToBoxService: WriteToBoxService,
        public mousePlaceLetter: MousePlaceLetterService,
        public socketService: SocketService,
        public wordValidator: WordValidatorService,
        public gameModeService: GameModeService,
        public router: Router,
        public bankService: LetterBankService,
        readonly audioManager: AudioManagerService,
    ) {
        this.displayEndGameComponent = false;
    }
    ngOnInit(): void {
        this.gameStateService.isPlayingChange.subscribe((playing) => {
            if (!playing && this.mousePlaceLetter.isTyping) {
                this.cancelPlay();
                this.mousePositionService.clearSelectCanvas();
            }
        });
        this.setUpDictionary();
        this.passedCount = 0;
    }

    setUpDictionary() {
        this.socketService.socket.on('sendDictionary', (words: string[] | null) => {
            if (words === null) {
                /* this.socketService.socket.disconnect();
                alert('Le dictionnaire a été supprimé avant le démarage de la partie, retour au menu principal');
                this.router.navigateByUrl('/home'); */
                console.log('Dictio supprimer');
                return;
            }
            this.wordValidator.dictionary = words;
        });
        if (this.gameModeService.isPlayingSolo || this.socketService.isHost)
            this.socketService.socket.emit('setDictionary', this.gameParametersService.dictionaryName);
    }

    buttonDetect(event: KeyboardEvent) {
        if (!this.gameStateService.isPlaying) return;
        if (event.key === 'Escape') this.cancelPlay();
        if (event.key === 'Enter') this.confirmPlay();
        if (this.gameStateService.isPlaying && event.key !== 'Escape') this.mousePlaceLetter.writeOnBoard(event);
    }

    ngAfterViewInit(): void {
        const num: number = CONSTANTS.THREE_HUNDRED_FIFTY / CONSTANTS.TILE_PIXEL_SIZE;
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.generateSpecialCases(this.gameParametersService.isRandomBonus);
        this.pointCalculator.initializeColorGrid();
        this.gridService.drawGrid();
        this.gridService.drawWord(String(Math.floor(num)));
        this.gridService.drawSpecialCases(this.font);
        this.gridCanvas.nativeElement.focus();
        this.mousePositionService.positionContext = this.mouseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.mousePositionService.selectContext = this.selectCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    mouseHighlight(event: MouseEvent) {
        this.mousePlaceLetter.mousePosition.x = event.offsetX;
        this.mousePlaceLetter.mousePosition.y = event.offsetY;
        this.mousePositionService.mouseHightlight(this.mousePlaceLetter.mousePosition);
    }

    confirmPlay() {
        // this.audioManager.playSound.play().catch();
        setTimeout(() => {
            const position = this.gridCoord.findColumAndRow(this.mousePlaceLetter.initPosition);
            if (this.gameStateService.isGameBegin && position.x !== 'h' && position.y !== '8') return;
            this.gameStateService.isGameBegin = false;
            this.getWord();
            this.resetBoard();
            this.gridCoord.changeLetter(this.mousePlaceLetter.word);
            this.gridCoord.changeOrientation(this.mousePlaceLetter.orientaion);
            this.gridCoord.changePosRow(position.x);
            this.gridCoord.changePosCol(position.y);
            this.mousePositionService.selectContext.clearRect(0, 0, CONSTANTS.DEFAULT_WIDTH_BOARD, CONSTANTS.DEFAULT_WIDTH_BOARD);
            this.placeLetterService.playTheWord();
            this.gameStateService.emitReset();
            this.writeToBoxService.write.emit('Mot "' + this.mousePlaceLetter.word + '" placé');
        }, ONEPLUS_SECONDS);
    }

    getWord() {
        this.mousePlaceLetter.word = '';
        for (const letter of this.mousePlaceLetter.letters) this.mousePlaceLetter.word += letter.getLetter();
    }

    cancelPlay() {
        this.resetBoard();
    }

    resetBoard() {
        this.rackService.putBackInRack(this.mousePlaceLetter.usedLetters);
        this.mousePlaceLetter.usedLetters = [];
        this.mousePlaceLetter.letters = [];
        this.placeLetterService.removeLetterOnGrid();
        this.mousePlaceLetter.keyOffset = 0;
        this.mousePlaceLetter.isTyping = false;
        this.mousePositionService.mouseSelectCase(
            this.mousePlaceLetter.tilePosition,
            this.mousePlaceLetter.orientaion,
            this.mousePlaceLetter.isTyping,
        );
        this.mousePositionService.selectContext.clearRect(0, 0, CONSTANTS.DEFAULT_WIDTH_BOARD, CONSTANTS.DEFAULT_WIDTH_BOARD);
    }

    changeFont(event: MouseEvent) {
        this.gridService.drawSpecialCases(this.font);
        return event;
    }

    changeState() {
        this.gameStateService.passedRound();
        // this.audioManager.buttonClick();
        this.gameStateService.emitReset();
        if (this.gameStateService.passedCounter === 3) this.endOfGame();
    }

    endOfGame() {
        this.displayEndGameComponent = true;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
