import { Component, OnInit } from '@angular/core';
import * as CONSTANTS from '@app/constants';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { LetterBankService } from '@app/services/letter-bank/letter-bank.service';
import { RackService } from '@app/services/rack/rack.service';
import { VirtualPlayerService } from '@app/services/virtual-player/virtual-player.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-virtual-player',
    templateUrl: './virtual-player.component.html',
    styleUrls: ['./virtual-player.component.scss'],
})
export class VirtualPlayerComponent implements OnInit {
    subscription: Subscription;
    isPlaying: boolean;

    constructor(
        public gameStateService: GameStateService,
        public virtualPlayerService: VirtualPlayerService,
        public bank: LetterBankService,
        public rackService: RackService,
        public gameModeService: GameModeService,
    ) {}

    ngOnInit(): void {
        this.subscription = this.gameStateService.isPlayingChange.subscribe((value) => {
            if (!value && this.gameModeService.isPlayingSolo) this.virtualPlayingF();
        });
    }

    virtualPlayingF() {
        setTimeout(() => {
            this.virtualPlayerService.virtualPlaying();
        }, CONSTANTS.FOUR_SECONDS);
        setTimeout(() => {
            this.gameStateService.resetTimer();
        }, CONSTANTS.SIX_SECONDS + CONSTANTS.THREE_SECONDS);
    }
}
