/* eslint-disable no-empty */
/*
Code line 34-42 source : https://stackoverflow.com/questions/50455347/how-to-do-a-timer-in-angular-5
*/
import { Location } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as CONSTANTS from '@app/constants';
import { Players } from '@app/interfaces/players';
import { AudioManagerService } from '@app/services/audio/audio-manager.service';
import { CommunicationBoxDataService } from '@app/services/communication-box-data.service';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { PointsCalculatorService } from '@app/services/points-calculator.service';
import { RackService } from '@app/services/rack/rack.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { VirtualPlayerService } from '@app/services/virtual-player/virtual-player.service';

@Component({
    selector: 'app-panneau-info',
    templateUrl: './panneau-info.component.html',
    styleUrls: ['./panneau-info.component.scss'],
})
export class PanneauInfoComponent implements AfterViewInit, OnInit, OnDestroy {
    @Input() players: Players[] = [
        {
            name: 'Utilisateur',
            score: 0,
            letterHolderAmount: 7,
        },
        {
            name: 'Joueur Adverse',
            score: 0,
            letterHolderAmount: 7,
        },
    ];

    timeLeft: number = CONSTANTS.TIMER_TIME;
    isPlaying = true;
    player1: string;
    player2: string;
    quitBox: string = 'none';
    playerToCredit: number;

    constructor(
        public communicationBoxDataService: CommunicationBoxDataService,
        public virtualPlayerService: VirtualPlayerService,
        public pointsCalculatorService: PointsCalculatorService,
        public gameStateService: GameStateService,
        public rackService: RackService,
        public socketService: SocketService,
        public gameModeService: GameModeService,
        public location: Location,
        readonly audioManager: AudioManagerService,
    ) {
        this.timeLeft = gameStateService.timeLeft;

        gameStateService.timeLeftChange.subscribe((time) => {
            this.timeLeft = time;
        });

        gameStateService.isPlayingChange.subscribe((value) => {
            this.isPlaying = value;
            if (value) {
                this.player1 = '';
                this.player2 = 'none';
            } else {
                this.player1 = 'none';
                this.player2 = '';
            }
        });
        this.pointsCalculatorService.playerToCredit.subscribe((player) => {
            this.playerToCredit = player;
        });
        this.pointsCalculatorService.currentPoints.subscribe((points) => (this.players[this.playerToCredit].score += points));
        this.rackService.currentRack.subscribe((rack) => (this.players[0].letterHolderAmount = rack.length));
    }
    ngOnDestroy(): void {
        this.gameStateService.clearTimer();
    }
    ngOnInit(): void {
        this.players[0].name = this.communicationBoxDataService.playerName;
        if (!this.socketService.gameModeService.isPlayingSolo) {
            this.players[1].name = this.communicationBoxDataService.opponentName;
        } else {
            this.players[1].name = this.virtualPlayerService.getOpponentName();
        }

        if (this.socketService.isHost || this.gameModeService.isPlayingSolo) {
            this.player1 = '';
            this.player2 = 'none';
        } else {
            this.player1 = 'none';
            this.player2 = '';
        }
    }

    ngAfterViewInit(): void {
        this.gameStateService.startTimer();
        this.communicationBoxDataService.playerName = this.players[0].name;
        this.communicationBoxDataService.opponentName = this.players[1].name;
    }

    resetTimer() {
        this.gameStateService.emitReset();
    }

    quitGameWindow() {
        // this.audioManager.buttonClick();
        this.quitBox = '';
    }

    cancelQuit() {
        // this.audioManager.backSound.play().then().catch();
        this.quitBox = 'none';
    }

    async quitGame() {
        // this.audioManager.buttonClick();
        try {
            await this.socketService.socket.disconnect();
        } catch (err) {
            // Mode Sole
        }
        this.location.go('/home');
        this.location.historyGo();
    }
}
