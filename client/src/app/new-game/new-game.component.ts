import { Component } from '@angular/core';
import { AudioManagerService } from '@app/services/audio/audio-manager.service';
import { CommunicationBoxDataService } from '@app/services/communication-box-data.service';
import { GameParametersService } from '@app/services/game-parameters.service';
import { VirtualPlayerService } from '@app/services/virtual-player/virtual-player.service';

@Component({
    selector: 'app-new-game',
    templateUrl: './new-game.component.html',
    styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent {
    constructor(
        public virtualPlayerService: VirtualPlayerService,
        public gameParametersService: GameParametersService,
        public communicationBoxData: CommunicationBoxDataService,
        readonly audioManager: AudioManagerService,
    ) {
        this.communicationBoxData.playerName = '';
        this.virtualPlayerService.opponentName = this.virtualPlayerService.adversary[this.virtualPlayerService.opponentIndex];
    }

    playSound() {
        // this.audioManager.buttonClick();
    }
    changeVirtualPlayerName(event: Event) {
        const newLevel = (event.target as HTMLInputElement).value;
        this.virtualPlayerService.changeVPLevel(newLevel);
    }
}
