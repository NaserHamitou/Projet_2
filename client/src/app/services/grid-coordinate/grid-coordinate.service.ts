import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GridCoordinateService {
    coordX: number[] = [];
    map: Map<string, number> = new Map([
        ['a', 0],
        ['b', CONSTANTS.LANE_2],
        ['c', CONSTANTS.LANE_3],
        ['d', CONSTANTS.LANE_4],
        ['e', CONSTANTS.LANE_5],
        ['f', CONSTANTS.LANE_6],
        ['g', CONSTANTS.LANE_7],
        ['h', CONSTANTS.LANE_8],
        ['i', CONSTANTS.LANE_9],
        ['j', CONSTANTS.LANE_10],
        ['k', CONSTANTS.LANE_11],
        ['l', CONSTANTS.LANE_12],
        ['m', CONSTANTS.LANE_13],
        ['n', CONSTANTS.LANE_14],
        ['o', CONSTANTS.LANE_15],
    ]);
    currentPosRow: Observable<string>;
    currentPosCol: Observable<string>;
    currentLetter: Observable<string>;
    currentOrientation: Observable<string>;

    private posRow = new BehaviorSubject<string>('');
    private posCol = new BehaviorSubject<string>('');
    private letter = new BehaviorSubject<string>('');
    private orientation = new BehaviorSubject<string>('');

    constructor() {
        for (let i = 0; i < CONSTANTS.NUMBER_OF_TILES; i++) {
            this.coordX.push(i * CONSTANTS.TILE_PIXEL_SIZE);
        }
        this.currentPosRow = this.posRow.asObservable();
        this.currentPosCol = this.posCol.asObservable();
        this.currentLetter = this.letter.asObservable();
        this.currentOrientation = this.orientation.asObservable();
    }

    findPosition(letter: string, number: number): Vec2 {
        const x = this.coordX[number - 1];
        const y = Number(this.map.get(letter));
        const coord: Vec2 = { x, y };
        return coord;
    }

    findColumAndRow(coord: Vec2): { x: string; y: string } {
        const row = [...this.map.entries()].filter(({ 1: v }) => v === coord.y).map(([k]) => k);
        const col = this.coordX.findIndex((element) => element === coord.x) + 1;
        return { x: row[0], y: String(col) };
    }

    changePosRow(posR: string) {
        this.posRow.next(posR);
    }

    changePosCol(posCol: string) {
        this.posCol.next(posCol);
    }

    changeLetter(letter: string) {
        this.letter.next(letter);
    }

    changeOrientation(orient: string) {
        this.orientation.next(orient);
    }
}
