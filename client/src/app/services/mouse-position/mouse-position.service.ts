import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants';

const MOVING_OFFSET_15 = 15;
const MOVING_OFFSET_20 = 20;
const MOVING_OFFSET_25 = 25;

@Injectable({
    providedIn: 'root',
})
export class MousePositionService {
    positionContext: CanvasRenderingContext2D;
    selectContext: CanvasRenderingContext2D;
    swtchSide: boolean = false;
    private previousPos: Vec2 = { x: 0, y: 0 };
    private previousSelect: Vec2 = { x: 0, y: 0 };
    private canvasSize: Vec2 = { x: CONSTANTS.MOUSEPOSDEFAULT_WIDTH, y: CONSTANTS.MOUSEPOS_DEFAULT_HEIGHT };

    mouseHightlight(coord: Vec2) {
        this.positionContext.clearRect(this.previousPos.x, this.previousPos.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
        this.positionContext.fillStyle = 'rgba(255, 51, 51, 0.3)';
        const mousePos = this.calculatePosition(coord);
        this.positionContext.fillRect(mousePos.x, mousePos.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
        this.previousPos = mousePos;
    }

    mouseSelectCase(coord: Vec2, orientation: string, isTyping: boolean): string {
        this.selectContext.clearRect(0, 0, CONSTANTS.DEFAULT_WIDTH_BOARD, CONSTANTS.DEFAULT_WIDTH_BOARD);
        this.selectContext.fillStyle = 'rgba(255, 255, 63, 0.7)';
        const mousePos = this.calculatePosition(coord);
        this.selectContext.fillRect(mousePos.x, mousePos.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
        if (this.previousSelect.x === mousePos.x && this.previousSelect.y === mousePos.y && !isTyping) {
            this.swtchSide = !this.swtchSide;
        } else if (!isTyping) this.swtchSide = false;

        if (!this.swtchSide) {
            this.selectContext.beginPath();
            this.selectContext.moveTo(mousePos.x + MOVING_OFFSET_15, mousePos.y + MOVING_OFFSET_15);
            this.selectContext.lineTo(mousePos.x + MOVING_OFFSET_20, mousePos.y + MOVING_OFFSET_20);
            this.selectContext.lineTo(mousePos.x + MOVING_OFFSET_15, mousePos.y + MOVING_OFFSET_25);
            this.selectContext.closePath();
            this.selectContext.lineWidth = 3;
            this.selectContext.stroke();
            this.selectContext.fillStyle = 'black';
            this.selectContext.fill();
            orientation = 'h';
        }

        if (this.swtchSide) {
            this.selectContext.beginPath();
            this.selectContext.moveTo(mousePos.x + MOVING_OFFSET_15, mousePos.y + MOVING_OFFSET_15);
            this.selectContext.lineTo(mousePos.x + MOVING_OFFSET_20, mousePos.y + MOVING_OFFSET_20);
            this.selectContext.lineTo(mousePos.x + MOVING_OFFSET_25, mousePos.y + MOVING_OFFSET_15);
            this.selectContext.closePath();
            this.selectContext.lineWidth = 3;
            this.selectContext.stroke();
            this.selectContext.fillStyle = 'black';
            this.selectContext.fill();
            orientation = 'v';
        }

        this.previousSelect = mousePos;
        return orientation;
    }

    calculatePosition(coord: Vec2): Vec2 {
        const posx = Math.floor(coord.x / CONSTANTS.TILE_SIZE) * CONSTANTS.TILE_SIZE;
        const posy = Math.floor(coord.y / CONSTANTS.TILE_SIZE) * CONSTANTS.TILE_SIZE;

        return { x: posx, y: posy };
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    clearSelectCanvas() {
        this.selectContext.clearRect(0, 0, CONSTANTS.DEFAULT_WIDTH_BOARD, CONSTANTS.DEFAULT_WIDTH_BOARD);
    }
}
