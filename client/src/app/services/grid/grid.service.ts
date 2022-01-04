import { Injectable } from '@angular/core';
import { SpecialCase } from '@app/classes/special-case';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants';

export const CANVAS_SIZE = 600;
const WORD_TRIPLE_CASES_NUMBER = 8;
const LETTER_DOUBLE_CASES_NUMBER = 24;
const WORD_DOUBLE_CASES_NUMBER = 16;
const LETTER_TRIPLE_CASES_NUMBER = 12;
const TOTAL_SPECIAL_CASES_NUMBER = 61;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    specialCaseArray: SpecialCase[] = [];
    private canvasSize: Vec2 = { x: CANVAS_SIZE, y: CANVAS_SIZE };
    private positions: Vec2[] = [
        { x: 120, y: 0 },
        { x: 440, y: 0 },
        { x: 240, y: 80 },
        { x: 320, y: 80 },
        { x: 0, y: 120 },
        { x: 280, y: 120 },
        { x: 560, y: 120 },
        { x: 80, y: 240 },
        { x: 240, y: 240 },
        { x: 320, y: 240 },
        { x: 480, y: 240 },
        { x: 120, y: 280 },
        { x: 440, y: 280 },
        { x: 80, y: 320 },
        { x: 240, y: 320 },
        { x: 320, y: 320 },
        { x: 480, y: 320 },
        { x: 0, y: 440 },
        { x: 280, y: 440 },
        { x: 560, y: 440 },
        { x: 240, y: 480 },
        { x: 320, y: 480 },
        { x: 120, y: 560 },
        { x: 440, y: 560 },
    ];

    constructor() {
        this.specialCaseArray = new Array<SpecialCase>(TOTAL_SPECIAL_CASES_NUMBER);
        for (let i = 0; i < TOTAL_SPECIAL_CASES_NUMBER; i++) this.specialCaseArray[i] = new SpecialCase();
    }

    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;

        for (let i = 0; i < CONSTANTS.NUMBER_OF_TILES + 1; i++) {
            this.gridContext.moveTo(0, i * (CANVAS_SIZE / CONSTANTS.NUMBER_OF_TILES));
            this.gridContext.lineTo(CANVAS_SIZE, i * (CANVAS_SIZE / CONSTANTS.NUMBER_OF_TILES));
        }

        for (let i = 0; i < CONSTANTS.NUMBER_OF_TILES + 1; i++) {
            this.gridContext.moveTo(i * (CANVAS_SIZE / CONSTANTS.NUMBER_OF_TILES), 0);
            this.gridContext.lineTo(i * (CANVAS_SIZE / CONSTANTS.NUMBER_OF_TILES), CANVAS_SIZE);
        }
        this.gridContext.stroke();
    }

    specialCases(fontSize: number, x: number, y: number, type: string, multip: string, color: string) {
        this.gridContext.fillStyle = color;
        this.gridContext.fillRect(x, y, CONSTANTS.TILE_PIXEL_SIZE, CONSTANTS.TILE_PIXEL_SIZE);

        this.gridContext.fillStyle = 'white';
        this.gridContext.font = String(fontSize) + 'px Tahoma';
        this.gridContext.textAlign = 'center';
        this.gridContext.fillText(type, x + CONSTANTS.CENTER_TILE, y + CONSTANTS.CENTER_TILE);
        this.gridContext.fillText(multip, x + CONSTANTS.CENTER_TILE, y + CONSTANTS.DRAWING_TILE_SIZE);
    }

    drawSpecialCases(fontSize: number): void {
        let index = 0;
        // Word Triple (orange)
        for (let i = 0; i <= CONSTANTS.NUMBER_OF_TILES; i += CONSTANTS.CENTER_POSITION) {
            for (let j = 0; j <= CONSTANTS.NUMBER_OF_TILES; j += CONSTANTS.CENTER_POSITION) {
                if (j === CONSTANTS.CENTER_POSITION && i === CONSTANTS.CENTER_POSITION) continue;
                this.specialCases(
                    fontSize,
                    CONSTANTS.TILE_PIXEL_SIZE * i,
                    CONSTANTS.TILE_PIXEL_SIZE * j,
                    this.specialCaseArray[index].type,
                    this.specialCaseArray[index].multip,
                    this.specialCaseArray[index].color,
                );
                index++;
            }
        }

        // Letter Double (light blue)
        for (const pos of this.positions) {
            this.specialCases(
                fontSize,
                pos.x,
                pos.y,
                this.specialCaseArray[index].type,
                this.specialCaseArray[index].multip,
                this.specialCaseArray[index].color,
            );
            index++;
        }

        // Word Double (pink)
        for (let i = CONSTANTS.TILE_PIXEL_SIZE; i < CONSTANTS.LANE_6; i += CONSTANTS.TILE_PIXEL_SIZE) {
            this.specialCases(
                fontSize,
                i,
                i,
                this.specialCaseArray[index].type,
                this.specialCaseArray[index].multip,
                this.specialCaseArray[index].color,
            );
            index++;
            this.specialCases(
                fontSize,
                CONSTANTS.DEFAULT_WIDTH - CONSTANTS.TILE_PIXEL_SIZE - i,
                i,
                this.specialCaseArray[index].type,
                this.specialCaseArray[index].multip,
                this.specialCaseArray[index].color,
            );
            index++;
            this.specialCases(
                fontSize,
                i,
                CONSTANTS.DEFAULT_WIDTH - CONSTANTS.TILE_PIXEL_SIZE - i,
                this.specialCaseArray[index].type,
                this.specialCaseArray[index].multip,
                this.specialCaseArray[index].color,
            );
            index++;
            this.specialCases(
                fontSize,
                CONSTANTS.DEFAULT_WIDTH - CONSTANTS.TILE_PIXEL_SIZE - i,
                CONSTANTS.DEFAULT_WIDTH - CONSTANTS.TILE_PIXEL_SIZE - i,
                this.specialCaseArray[index].type,
                this.specialCaseArray[index].multip,
                this.specialCaseArray[index].color,
            );
            index++;
        }
        // Letter Triple (dark blue)
        this.gridContext.fillStyle = 'rgba(0, 0, 255, 0.9)';
        const numberOfSpecial = 4;
        for (let i = 0; i < numberOfSpecial; i++) {
            this.specialCases(
                fontSize,
                CONSTANTS.LANE_6,
                CONSTANTS.TILE_PIXEL_SIZE + i * CONSTANTS.LANE_5,
                this.specialCaseArray[index].type,
                this.specialCaseArray[index].multip,
                this.specialCaseArray[index].color,
            );
            index++;
            this.specialCases(
                fontSize,
                CONSTANTS.LANE_10,
                CONSTANTS.TILE_PIXEL_SIZE + i * CONSTANTS.LANE_5,
                this.specialCaseArray[index].type,
                this.specialCaseArray[index].multip,
                this.specialCaseArray[index].color,
            );
            index++;
        }

        for (let i = 0; i < 2; i++) {
            this.specialCases(
                fontSize,
                CONSTANTS.TILE_PIXEL_SIZE,
                CONSTANTS.LANE_6 + i * CONSTANTS.LANE_5,
                this.specialCaseArray[index].type,
                this.specialCaseArray[index].multip,
                this.specialCaseArray[index].color,
            );
            index++;
            this.specialCases(
                fontSize,
                CONSTANTS.LANE_14,
                CONSTANTS.LANE_6 + i * CONSTANTS.LANE_5,
                this.specialCaseArray[index].type,
                this.specialCaseArray[index].multip,
                this.specialCaseArray[index].color,
            );
            index++;
        }

        // Middle Case
        this.specialCases(
            fontSize,
            CONSTANTS.LANE_8,
            CONSTANTS.LANE_8,
            this.specialCaseArray[index].type,
            this.specialCaseArray[index].multip,
            this.specialCaseArray[index].color,
        );
        this.gridContext.stroke();
    }

    drawWord(word: string) {
        const font = 14;
        const centerWord = 22.5;
        const startPosition: Vec2 = { x: centerWord - font / 2, y: centerWord };
        const step = CONSTANTS.NUMBER_OF_TILES / CONSTANTS.NUMBER_OF_TILES;
        this.gridContext.font = String(font) + 'px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.gridContext.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    generateSpecialCases(isRandom: boolean): void {
        let index = 0;

        // Word Triple (orange)
        for (let i = 0; i < WORD_TRIPLE_CASES_NUMBER; i++) {
            this.specialCaseArray[index].type = 'MOT';
            this.specialCaseArray[index].multip = 'x3';
            this.specialCaseArray[index].color = 'rgba(255, 128, 0, 0.7)';
            index++;
        }

        // Letter Double (light blue)
        for (let i = 0; i < LETTER_DOUBLE_CASES_NUMBER; i++) {
            this.specialCaseArray[index].type = 'Lettre';
            this.specialCaseArray[index].multip = 'x2';
            this.specialCaseArray[index].color = 'rgba(8, 177, 248, 0.7)';
            index++;
        }

        // Word Double (pink)
        for (let i = 0; i < WORD_DOUBLE_CASES_NUMBER; i++) {
            this.specialCaseArray[index].type = 'MOT';
            this.specialCaseArray[index].multip = 'x2';
            this.specialCaseArray[index].color = 'rgba(255, 51, 255, 0.7)';
            index++;
        }

        // Letter Triple (dark blue)
        for (let i = 0; i < LETTER_TRIPLE_CASES_NUMBER; i++) {
            this.specialCaseArray[index].type = 'Lettre';
            this.specialCaseArray[index].multip = 'x3';
            this.specialCaseArray[index].color = 'rgba(0, 76, 153, 0.7)';
            index++;
        }

        // Middle Case
        this.specialCaseArray[index].type = 'STAR';
        this.specialCaseArray[index].multip = '';
        this.specialCaseArray[index].color = 'rgba(0, 204, 0, 0.9)';

        if (isRandom) {
            let currentIndex: number = this.specialCaseArray.length;
            let randomIndex: number;

            // While there remain elements to shuffle...
            while (currentIndex !== 0) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                // And swap it with the current element.
                [this.specialCaseArray[currentIndex], this.specialCaseArray[randomIndex]] = [
                    this.specialCaseArray[randomIndex],
                    this.specialCaseArray[currentIndex],
                ];
            }
        }
    }
}
