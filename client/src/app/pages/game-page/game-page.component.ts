/* eslint-disable no-console */
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { PanneauInfoComponent } from '@app/components/info-pannel/panneau-info.component';
import { CommunicationBoxDataService } from '@app/services/communication-box-data/communication-box-data.service';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { VirtualPlayerService } from '@app/services/virtual-player/virtual-player.service';
import { WriteToBoxService } from '@app/services/write-to-box.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements AfterViewInit {
    @ViewChild('panel') panel: PanneauInfoComponent;

    isPlaying: string = 'block';
    gameOver: string = 'none';
    virtualPlayerName = '';
    constructor(
        public socketService: SocketService,
        public gameModeService: GameModeService,
        public communicationBoxDataService: CommunicationBoxDataService,
        public virtualPlayer: VirtualPlayerService,
        public messageBox: WriteToBoxService,
        public gameStateService: GameStateService,
    ) {
        this.isPlaying = 'block';
        this.gameOver = 'none';
    }
    ngAfterViewInit(): void {
        try {
            this.socketService.socket.on('playerClosed', () => {
                const WAIT_TIME = 5000;
                setTimeout(() => {
                    this.setToSoloMode();
                }, WAIT_TIME);
            });
        } catch (err) {
            // console.log('Connection au server non etablie');
        }

        try {
            this.socketService.socket.on('playerLeft', () => {
                this.setToSoloMode();
            });
        } catch (err) {
            console.log('Connection au server non etablie');
        }
    }

    setToSoloMode() {
        this.messageBox.write.emit(this.panel.players[1].name + ' a quitté la partie !');
        this.socketService.isHost = true;
        this.gameModeService.isPlayingSolo = true;
        this.panel.players[1].name = this.virtualPlayer.getOpponentName();
        this.messageBox.write.emit(this.panel.players[1].name + ' prend sa place.');
        this.gameStateService.resetTimer();
    }
}
