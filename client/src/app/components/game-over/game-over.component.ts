import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AudioManagerService } from '@app/services/audio/audio-manager.service';
import { CommunicationBoxDataService } from '@app/services/communication-box-data.service';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { PointsCalculatorService } from '@app/services/points-calculator.service';
import { SocketService } from '@app/services/sockets/socket.service';

@Component({
    selector: 'app-game-over',
    templateUrl: './game-over.component.html',
    styleUrls: ['./game-over.component.scss'],
})
export class GameOverComponent implements OnInit {
    @Input() scores: number[] = [0, 0];
    winner: string = '';
    result: string = '';
    scoreP1: number = 0;
    scoreP2: number = 0;

    constructor(
        public pointCalculatorService: PointsCalculatorService,
        public communicationService: CommunicationBoxDataService,
        private location: Location,
        public socket: SocketService,
        readonly gameMode: GameModeService,
        readonly audioService: AudioManagerService,
    ) {}
    ngOnInit(): void {
        // this.audioService.endGameSound.volume = 0.2;
        // this.audioService.endGameSound.play().catch();
        this.scoreP1 = this.pointCalculatorService.totalPointsDisplay[0];
        this.scoreP2 = this.pointCalculatorService.totalPointsDisplay[1];
        this.displayWinner();
    }

    findWinner(): boolean {
        return this.scoreP1 > this.scoreP2;
    }

    displayWinner() {
        if (this.findWinner()) {
            this.winner = this.communicationService.playerName;
            this.result = 'Félicitaion vous avez gagné !';
        } else {
            this.winner = this.communicationService.opponentName;
            this.result = 'Vous avez perdu la partie, ' + this.winner + ' a gagné.';
        }
    }

    quitButton() {
        // this.audioService.buttonClick();
        try {
            this.socket.socket.emit('addBestScoreClassique', (this.scoreP1, this.communicationService.playerName));
        } catch {}
        try {
            this.socket.socket.emit('addBestScoreClassique', (this.scoreP2, this.communicationService.opponentName));
        } catch {}
        if (this.gameMode.gameMode === 1) {
            try {
                this.socket.socket.emit('addBestScoreLog', (this.scoreP1, this.communicationService.playerName));
            } catch {}
            try {
                this.socket.socket.emit('addBestScoreLog', (this.scoreP2, this.communicationService.opponentName));
            } catch {}
        }
        this.location.replaceState('/home');
        this.location.historyGo();
    }
}
