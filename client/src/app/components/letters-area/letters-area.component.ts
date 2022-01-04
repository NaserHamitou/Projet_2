import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as CONSTANTS from '@app/constants';
import { Letter } from '@app/letter';
import { EventService } from '@app/services/event/event.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';
import { LetterPlacementService } from '@app/services/letter-placement.service';
import { PlaceLetterService } from '@app/services/place-letter/place-letter.service';
import { PointsCalculatorService } from '@app/services/points-calculator.service';
import { RackService } from '@app/services/rack/rack.service';
import { WordValidatorService } from '@app/services/word-validator/word-validator.service';
import { Subscription } from 'rxjs';

export const CENTER_TEXT_X = 12;
export const CENTER_TEXT_Y = 24;

@Component({
    selector: 'app-letters-area',
    templateUrl: './letters-area.component.html',
    styleUrls: ['./letters-area.component.scss'],
})
export class LettersAreaComponent implements OnInit, AfterViewInit {
    @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('tempCanvas', { static: false }) tempCanvas!: ElementRef<HTMLCanvasElement>;

    postR: string;
    posC: string;
    word: string;
    orientation: string;
    clickEventSub: Subscription;
    isGameBegin: boolean;
    gridOfLetters: string[][];
    letterGrid: Letter[][];
    horizontal: number;
    vertical: number;

    letters: Letter[];

    constructor(
        public gridCoordService: GridCoordinateService,
        public placementService: LetterPlacementService,
        public gameState: GameStateService,
        public validatorService: WordValidatorService,
        public pointsService: PointsCalculatorService,
        public eventService: EventService,
        public rackService: RackService,
        public placeLetterService: PlaceLetterService,
    ) {
        this.letterGrid = [];
        for (let i = 0; i <= CONSTANTS.NUMBER_OF_TILES; i++) {
            this.letterGrid[i] = [];
        }
        this.gridOfLetters = placementService.gridOfLetters;
        this.isGameBegin = true;
    }

    ngAfterViewInit(): void {
        this.placeLetterService.canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.placeLetterService.tempCanvasContext = this.tempCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    ngOnInit(): void {
        this.gridCoordService.currentPosRow.subscribe((pos) => (this.postR = pos));
        this.gridCoordService.currentPosCol.subscribe((pos) => (this.posC = pos));
        this.gridCoordService.currentLetter.subscribe((letr) => (this.word = letr));
        this.gridCoordService.currentOrientation.subscribe((orient) => (this.orientation = orient));
        this.clickEventSub = this.eventService.getClickEvent().subscribe(() => {
            if (this.word !== '') {
                this.placeOnTheBoard();
            }
        });
    }

    placeOnTheBoard() {
        if (this.gameState.isPlaying) this.placeLetterService.playTheWord();
    }
}
