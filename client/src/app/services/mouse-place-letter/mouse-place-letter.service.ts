import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants';
import { Letter } from '@app/letter';
import { AudioManagerService } from '@app/services/audio/audio-manager.service';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';
import { LetterPlacementService } from '@app/services/letter-placement.service';
import { MousePositionService } from '@app/services/mouse-position/mouse-position.service';
import { PlaceLetterService } from '@app/services/place-letter/place-letter.service';
import { RackService } from '@app/services/rack/rack.service';

export const START_FROM_END = -1;
export const ONEPLUS_SECONDS = 1100;
export const CHAR_OFFSET = 96;

export interface Positions {
    posX: number;
    posY: number;
}

@Injectable({
    providedIn: 'root',
})
export class MousePlaceLetterService {
    mousePosition: Vec2 = { x: 0, y: 0 };
    initPosition: Vec2 = { x: 0, y: 0 };
    tilePosition: Vec2;
    keyOffset: number;
    index: number;
    letters: Letter[] = [];
    usedLetters: Letter[] = [];
    orientaion: string;
    word: string;
    isTyping: boolean;
    isClicked: boolean;

    constructor(
        public mousePositionService: MousePositionService,
        public placeLetterService: PlaceLetterService,
        public rackService: RackService,
        public gridCoord: GridCoordinateService,
        public letterPlacement: LetterPlacementService,
        readonly audioManager: AudioManagerService,
    ) {
        this.keyOffset = 0;
        this.isTyping = false;
        this.isClicked = false;
        this.word = '';
        this.tilePosition = { x: 0, y: 0 };
        this.index = 1;
    }

    eraseLetterOnBoard(hor: number, ver: number) {
        // this.audioManager.eraseSound.play();
        if (this.orientaion === 'v') this.backWardChecking(0, ver);
        this.keyOffset -= 40;
        if (this.orientaion === 'h') this.backWardChecking(hor, 0);
        if (this.keyOffset === 0) this.isTyping = false;
        const coordPixelDelete = { x: this.tilePosition.x + this.keyOffset * hor, y: this.tilePosition.y + this.keyOffset * ver };
        this.placeLetterService.eraseTile(coordPixelDelete.x, coordPixelDelete.y, this.orientaion);
        this.mousePositionService.mouseSelectCase(coordPixelDelete, this.orientaion, this.isTyping);
        this.placeLetterService.highLightCase(coordPixelDelete, this.orientaion);
        this.rackService.putOneInRack(this.usedLetters[this.usedLetters.length - 1]);
        this.usedLetters.pop();
        return;
    }

    positionOnGrid(h: number, v: number): Positions {
        const coordPixel = { x: this.tilePosition.x + this.keyOffset * h, y: this.tilePosition.y + this.keyOffset * v };
        const position = this.gridCoord.findColumAndRow(coordPixel);
        const positionX = position.x.toLowerCase().charCodeAt(0) - CHAR_OFFSET;
        const positionY = Number(position.y);
        return { posX: positionX, posY: positionY };
    }

    writeOnBoard(event: KeyboardEvent) {
        if (event.key.length > 1 && event.key !== 'Backspace') return;

        let hor = 0;
        let ver = 0;
        if (this.orientaion === 'h') hor = 1;
        else if (this.orientaion === 'v') ver = 1;

        if (event.key === 'Backspace' && this.keyOffset === 0) {
            this.isTyping = false;
            return;
        }

        // Backspace
        if (event.key === 'Backspace' && this.keyOffset > 0) {
            this.eraseLetterOnBoard(hor, ver);
        }

        // Write letters
        if (this.isClicked) {
            if (!this.verifyInRack(event.key.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) return;
            this.placeLetterService.highLightCase(
                { x: this.tilePosition.x + this.keyOffset * hor, y: this.tilePosition.y + this.keyOffset * ver },
                this.orientaion,
            );
            this.placeLetterService.drawOnTempCanvas(
                this.tilePosition.x + this.keyOffset * hor,
                this.tilePosition.y + this.keyOffset * ver,
                event.key.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
            );
            this.frontChecking(hor, ver);
            this.keyOffset += 40;
            const coordPixel = { x: this.tilePosition.x + this.keyOffset * hor, y: this.tilePosition.y + this.keyOffset * ver };
            this.isTyping = true;
            this.mousePositionService.mouseSelectCase(coordPixel, this.orientaion, this.isTyping);
            this.placeLetterService.highLightCase(coordPixel, this.orientaion);
            // this.audioManager.typeLetterSound.play();
        }
    }

    mouseSelect(event: MouseEvent) {
        if (this.keyOffset <= 0 && this.isTyping === true) {
            this.isTyping = false;
            return;
        }

        if (this.isTyping && this.keyOffset > 0) return;
        if (event.button === 0) {
            this.index = 1;
            const vec1 = { x: event.offsetX, y: event.offsetY };
            this.placeLetterService.removeLetterOnGrid();
            this.tilePosition = this.mousePositionService.calculatePosition(vec1);
            this.initPosition = this.mousePositionService.calculatePosition(vec1);
            if (!this.verifyPosition(this.initPosition)) return;
            this.mousePosition.x = event.offsetX;
            this.mousePosition.y = event.offsetY;
            this.orientaion = 'h';
            this.orientaion = this.mousePositionService.mouseSelectCase(this.mousePosition, this.orientaion, this.isTyping);
            this.isTyping = false;
            this.isClicked = true;
        }
    }

    verifyPosition(coord: Vec2): boolean {
        const position = this.gridCoord.findColumAndRow(coord);
        const posX = position.x.toLowerCase().charCodeAt(0) - CHAR_OFFSET;
        const posY = Number(position.y);
        if (this.letterPlacement.getGrid()[posX][posY] != null) return false;
        else return true;
    }

    frontChecking(h: number, v: number) {
        const positions = this.positionOnGrid(h, v);
        while (this.letterPlacement.getGrid()[positions.posX + this.index * v][positions.posY + this.index * h] != null) {
            this.letters.push(this.letterPlacement.getGrid()[positions.posX + this.index * v][positions.posY + this.index * h]);
            this.index++;
            this.tilePosition.x += CONSTANTS.TILE_PIXEL_SIZE * h;
            this.tilePosition.y += CONSTANTS.TILE_PIXEL_SIZE * v;
        }
    }

    backWardChecking(h: number, v: number) {
        const positions = this.positionOnGrid(h, v);
        if (this.letterPlacement.getGrid()[positions.posX - 1 * v][positions.posY - 1 * h] != null) {
            for (let i = 0; i < this.index; i++) this.letters.pop();
            this.tilePosition.x -= CONSTANTS.TILE_PIXEL_SIZE * h * (this.index - 1);
            this.tilePosition.y -= CONSTANTS.TILE_PIXEL_SIZE * v * (this.index - 1);
            this.index = 1;
        } else this.letters.pop();
    }

    verifyInRack(letter: string): boolean {
        if (this.rackService.letterRack.length > 0) {
            const tab = this.rackService.takeFromRack(letter[0]);
            if (tab.length === 0) return false;
            this.usedLetters.push(tab[0]);
            this.letters.push(tab[0]);
        } else {
            return false;
        }
        return this.letters.length !== 0;
    }
}
