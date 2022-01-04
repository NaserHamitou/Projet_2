/* eslint-disable no-empty */
import { Injectable, Input } from '@angular/core';
import { Letter } from '@app/letter';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { Subject } from 'rxjs';
const DEFAULT_TIMER_TIME = 60;
const TIMER_CONSTANT = 1000;

@Injectable({
    providedIn: 'root',
})
export class GameStateService {
    @Input() inputName: string;
    player = [{ name: '' }, { name: '' }];
    timeLeftChange: Subject<number> = new Subject<number>();
    timeLeft: number;
    timerTime: number;
    interval: unknown;
    isPlayingChange: Subject<boolean> = new Subject<boolean>();
    isPlaying: boolean;
    isGameBegin: boolean;
    virtualRack: Letter[] = [];
    lettersOnGrid: Map<string, string> = new Map();
    passedCounter: number;

    constructor(public socketService: SocketService, public gameMode: GameModeService) {
        this.timeLeft = DEFAULT_TIMER_TIME;
        this.timerTime = DEFAULT_TIMER_TIME;
        this.isPlaying = true;
        this.passedCounter = 0;
    }

    init() {
        const WAIT_TIME = 500;
        setTimeout(() => {
            this.isPlaying = this.socketService.isHost;
        }, WAIT_TIME);
    }

    startTimer() {
        this.interval = setInterval(() => {
            this.timer();
        }, TIMER_CONSTANT);
    }

    resetTimer() {
        clearInterval(this.interval as number);
        this.timeLeft = this.timerTime;
        this.timeLeftChange.next(this.timeLeft);
        this.isPlaying = !this.isPlaying;
        this.isPlayingChange.next(this.isPlaying);
        this.startTimer();
    }

    clearTimer() {
        clearInterval(this.interval as number);
        this.timeLeft = DEFAULT_TIMER_TIME;
        this.timerTime = DEFAULT_TIMER_TIME;
    }

    emitReset() {
        try {
            this.socketService.socket.emit('TimerReset');
        } catch {}

        this.resetTimer();
    }

    timer(): void {
        if (this.timeLeft > 0) {
            this.timeLeft--;
        } else {
            this.resetTimer();
        }
        this.timeLeftChange.next(this.timeLeft);
    }

    multiplayerOn() {
        this.socketService.socket.on('resetTimer', () => {
            this.resetTimer();
            this.isPlaying = true;
        });
        this.init();
    }

    /* endGame() {
        if (this.gameMode.isPlayingSolo) {
            window.location.replace('/game-over');
            return;
        }
        if (this.socketService.isHost) {
            this.socketService.socket.emit('gameEnded');
            window.location.replace('/game-over');
            return;
        }

        this.socketService.socket.on('endGameReceive', () => {
            window.location.replace('/game-over');
        });
    } */

    passedRound() {
        this.passedCounter++;
    }
}
