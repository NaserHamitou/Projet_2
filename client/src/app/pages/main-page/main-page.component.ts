import { Component } from '@angular/core';
import { AudioManagerService } from '@app/services/audio/audio-manager.service';
import { GameModeService } from '@app/services/game-mode/game-mode.service';

enum Mode {
    Classique,
    Log2990,
}
@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(public gameModeService: GameModeService, readonly audioManager: AudioManagerService) {}

    setModeClassique() {
        // this.audioManager.buttonClick();
        this.gameModeService.gameMode = Mode.Classique;
    }

    setModeLog2990() {
        // this.audioManager.buttonClick();
        this.gameModeService.gameMode = Mode.Log2990;
    }
}
