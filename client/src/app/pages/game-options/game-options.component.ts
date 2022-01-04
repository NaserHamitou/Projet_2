/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { Component, OnInit } from '@angular/core';
import { AudioManagerService } from '@app/services/audio/audio-manager.service';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
export interface Score {
    playerName: string;
    score: number;
}
@Component({
    selector: 'app-game-options',
    templateUrl: './game-options.component.html',
    styleUrls: ['./game-options.component.scss'],
})
export class GameOptionsComponent implements OnInit {
    bestScore: string;
    mainPage: string;
    nameClassique: string[] = [];
    scorClassique: number[] = [];
    scorLOG: number[] = [];
    listClassique: string[][] = [[]];
    listLog: string[][] = [[]];

    constructor(public gameModeService: GameModeService, public socketService: SocketService, readonly audioManager: AudioManagerService) {
        gameModeService.isPlayingSolo = false;
        this.bestScore = 'none';
        this.mainPage = 'block';
    }
    ngOnInit(): void {
        for (let i = 0; i < 5; i++) {
            this.listClassique[i] = [];
            this.listLog[i] = [];
        }
    }

    setClassicScore(scoresClassique: Score[]) {
        scoresClassique.forEach((element: any, index: any) => {
            this.scorClassique.push(element['_id']);
            element.docs.forEach((elementname: any) => {
                this.listClassique[index].push(elementname['playerName']);
            });
        });
    }

    setLogScore(scoresLOG2990: Score[]) {
        scoresLOG2990.forEach((element: any, index: any) => {
            this.scorLOG.push(element['_id']);
            element.docs.forEach((elementname: any) => {
                this.listLog[index].push(elementname['playerName']);
            });
        });
    }

    setSingleplayer() {
        // this.audioManager.buttonClick();
        this.gameModeService.isPlayingSolo = true;
    }

    setMultiplayer() {
        // this.audioManager.buttonClick();
        this.gameModeService.isPlayingSolo = false;
    }

    getBestScores() {
        this.socketService.socket = io(environment.serverUrl);
        this.socketService.socket.on('connect', () => {
            /* Connection Made */
            console.log('conect to server');
        });
        this.socketService.socket.on('bestScore', (scoresClassique, scoresLOG2990) => {
            this.setClassicScore(scoresClassique);
            this.setLogScore(scoresLOG2990);
            console.log('receive socket');
        });
        // this.audioManager.buttonClick();
        this.socketService.socket.emit('askbestScore');
        this.bestScore = 'block';
        this.mainPage = 'none';
    }
    clearscores(): void {
        this.reload();
        this.scorClassique = [];
        this.nameClassique = [];
        this.scorLOG = [];
        this.scorLOG = [];
        for (let i = 0; i < 5; i++) {
            this.listClassique[i] = [];
            this.listLog[i] = [];
        }
    }

    reload() {
        window.location.reload();
    }
}
