import { Component, HostListener, OnInit } from '@angular/core';
import { Letter } from '@app/letter';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { RackService } from '@app/services/rack/rack.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-letter-holder',
    templateUrl: './letter-holder.component.html',
    styleUrls: ['./letter-holder.component.scss'],
})
export class LetterHolderComponent implements OnInit {
    letterRack: Letter[] = [];
    clickEventSub: Subscription;
    buttonPressed = '';
    stillIn = false;

    constructor(
        public rackService: RackService,
        public gameStateService: GameStateService,
        public gameMode: GameModeService,
        public socketService: SocketService,
    ) {}

    @HostListener('wheel', ['$event'])
    swapLetters(event: WheelEvent) {
        this.rackService.wheelSwap(event.deltaY);
    }

    @HostListener('keydown', ['$event'])
    detectPressedKey(event: KeyboardEvent) {
        this.buttonPressed = event.key;
        if (this.rackService.isLetter(this.buttonPressed)) {
            this.rackService.keyboardSelectLetter(this.buttonPressed);
        } else {
            this.rackService.keyboardSwap(this.buttonPressed);
        }
    }
    exchange() {
        if (this.gameMode.isPlayingSolo || this.socketService.isHost) {
            this.rackService.exchangeLetters();
            this.rackService.noExchangeCounter = 0;
        } else {
            this.rackService.exchangeLetters();
            this.socketService.socket.emit('exchangeClicked');
        }
    }

    cancelExchange() {
        this.rackService.cancelExchange();
    }

    cancelAll() {
        this.rackService.unselectAll();
        this.cancelExchange();
    }

    ngOnInit(): void {
        if (this.gameMode.isPlayingSolo) this.rackService.initRack();
        this.rackService.currentRack.subscribe((rack) => (this.letterRack = rack));
    }
}
