import { Component } from '@angular/core';
import { GameModeService } from '@app/services/game-mode/game-mode.service';

export const DEFAULT_WIDTH = 600;
export const DEFAULT_HEIGHT = 700;

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    constructor(readonly gameModeService: GameModeService) {}
}
