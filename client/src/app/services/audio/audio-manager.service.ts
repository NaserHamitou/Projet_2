/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AudioManagerService {
    audio = new Audio('assets/main-music.mp3');
    buttonSound = new Audio('assets/click_sound.mp3');
    swapSound = new Audio('assets/swap_sound.mp3');
    selectTileSound = new Audio('assets/tile_sound.mp3');
    typeLetterSound = new Audio('assets/letter_sound.mp3');
    approvedSound = new Audio('assets/success_sound.mp3');
    playSound = new Audio('assets/play_sound.mp3');
    wrongSound = new Audio('assets/wrong_sound.mp3');
    backSound = new Audio('assets/back_sound.mp3');
    eraseSound = new Audio('assets/erase_sound.mp3');
    endGameSound = new Audio('assets/end_game_sound.mp3');

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}
}
