import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GameModeService {
    isPlayingSolo = false;
    gameMode: number;
}
