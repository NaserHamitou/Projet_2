import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { GameParametersService } from '@app/services/game-parameters.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { io } from 'socket.io-client';

const DEFAULT_TIMER_SECONDS = 60;
const TIMER_INCREMENT = 30;
const MAX_TIMER_TIME = 300;
const DEFAULT_DICTIONARY_TITLE = 'Mon dictionnaire';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements AfterViewChecked, OnInit, OnDestroy {
    @ViewChild('turnTime') turnTimeElement: ElementRef;
    @Input() isInvalid = false as boolean | null;
    selectedOptions: string[];
    map: Map<string, string> = new Map();

    turnTime: number = DEFAULT_TIMER_SECONDS;
    isBonusChecked = false;
    constructor(
        public gameParametersService: GameParametersService,
        public gameStateService: GameStateService,
        public gameModeService: GameModeService,
        public socketService: SocketService,
    ) {
        this.selectedOptions = new Array<string>();
    }
    ngAfterViewChecked(): void {
        if (this.gameModeService.isPlayingSolo) this.gameStateService.isPlaying = true;
        this.turnTimeElement.nativeElement.textContent = this.printTurnTime();
    }

    ngOnInit() {
        if (this.gameModeService.isPlayingSolo) {
            this.socketService.socket = io(this.socketService.uri);
        }
        this.socketService.socket.emit('info');
        this.socketService.socket.on('getDictionariesInfo', (map) => {
            let dictionaryName = '';
            let isDeleted = false;
            if (this.selectedOptions.length > 0) {
                dictionaryName = this.selectedOptions[0];
                isDeleted = true;
            }
            this.map.clear();
            new Map<string, string>(map).forEach((value: string, key: string) => {
                this.map.set(key, value);
                if (dictionaryName === key) isDeleted = false;
            });
            if (isDeleted) {
                alert('Le dictionnaire sélectionné a été supprimé');
                this.selectedOptions.pop();
                this.gameParametersService.dictionaryName = DEFAULT_DICTIONARY_TITLE;
            }
        });
    }

    ngOnDestroy() {
        this.socketService.socket.off('getDictionariesInfo');
    }

    printTurnTime(): string {
        const minutes: string = Math.floor(this.turnTime / DEFAULT_TIMER_SECONDS).toString();
        let seconds: string;
        if (this.turnTime % DEFAULT_TIMER_SECONDS === 0) seconds = '00';
        else seconds = '30';
        return minutes + ':' + seconds;
    }

    incrementTurnTime(): void {
        if (this.turnTime + TIMER_INCREMENT <= MAX_TIMER_TIME) this.turnTime += 30;
        this.turnTimeElement.nativeElement.textContent = this.printTurnTime();
        this.socketService.socket.emit('info');
    }

    decrementTurnTime(): void {
        if (this.turnTime - TIMER_INCREMENT >= TIMER_INCREMENT) this.turnTime -= 30;
        this.turnTimeElement.nativeElement.textContent = this.printTurnTime();
    }

    confirmParameters(): void {
        this.gameStateService.timerTime = this.turnTime;
        this.gameStateService.timeLeft = this.turnTime;
        this.gameParametersService.isRandomBonus = this.isBonusChecked;
        if (this.selectedOptions.length > 0) this.gameParametersService.dictionaryName = this.selectedOptions[0];
    }
}
