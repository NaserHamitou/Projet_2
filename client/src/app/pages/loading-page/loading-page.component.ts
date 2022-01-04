import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicationBoxDataService } from '@app/services/communication-box-data.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { RackService } from '@app/services/rack/rack.service';
import { SocketService } from '@app/services/sockets/socket.service';

@Component({
    selector: 'app-loading-page',
    templateUrl: './loading-page.component.html',
    styleUrls: ['./loading-page.component.scss'],
})
export class LoadingPageComponent implements OnInit {
    goToPage: boolean = false;

    constructor(
        public socketService: SocketService,
        public rackService: RackService,
        public gameStateService: GameStateService,
        public communicationBoxDataService: CommunicationBoxDataService,
        private readonly location: Router,
    ) {}

    ngOnInit() {
        const TIME = 2000;
        this.init();
        setTimeout(() => {
            this.goToGamePage();
        }, TIME);
    }

    init() {
        this.rackService.initRack();
        this.gameStateService.isPlaying = this.socketService.isHost;
        this.socketService.socket.emit('SendName', this.communicationBoxDataService.playerName);
        this.socketService.socket.on('ReceiveOpponentName', (opponentName) => {
            this.communicationBoxDataService.opponentName = opponentName;
        });
        this.gameStateService.multiplayerOn();
    }

    goToGamePage() {
        this.location.navigate(['/game']);
    }
}
