/* eslint-disable no-empty */
import { Injectable } from '@angular/core';
import * as CONSTANTS from '@app/constants';
import { Letter } from '@app/letter';
import { AudioManagerService } from '@app/services/audio/audio-manager.service';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { LetterBankService } from '@app/services/letter-bank/letter-bank.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { WriteToBoxService } from '@app/services/write-to-box.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RackService {
    letterRack: Letter[] = [];

    letterSelected = '';
    letterIndex = CONSTANTS.INCORRECT_VALUE;
    currentRack: Observable<Letter[]>;
    selectedLetters: Letter[] = [];
    noExchangeCounter: number = 0;
    noExchangeP2: number = 0;
    private rack = new BehaviorSubject<Letter[]>([]);

    constructor(
        public writeToBoxService: WriteToBoxService,
        public letterBank: LetterBankService,
        public socketService: SocketService,
        public gameStateService: GameStateService,
        public gameModeService: GameModeService,
        readonly audioManager: AudioManagerService,
    ) {
        this.currentRack = this.rack.asObservable();
    }

    async initRack() {
        if (this.socketService.isHost || this.gameModeService.isPlayingSolo) {
            this.fillOutRack(this.letterRack);
            this.changeRack(this.letterRack);
            this.fillOutRack(this.gameStateService.virtualRack);
        } else {
            this.socketService.socket.emit('GetInitialRack');
        }

        if (!this.gameModeService.isPlayingSolo) {
            this.socketService.socket.on('GetRackFromBank', () => {
                if (this.socketService.isHost) {
                    const initialRack: Letter[] = [];
                    this.fillOutRack(initialRack);
                    this.socketService.socket.emit('InitialRack', initialRack);
                }
            });
            this.socketService.socket.on('ReceiveRack', (initialRack) => {
                if (!this.socketService.isHost) {
                    this.letterRack = this.reconstructLetterArray(initialRack);
                    this.changeRack(this.letterRack);
                }
            });

            this.socketService.socket.on('exchangeP2Clicked', () => {
                this.noExchangeP2 = 0;
            });
        }
    }

    wheelSwap(scrollDirection: number) {
        if (this.letterIndex !== CONSTANTS.INCORRECT_VALUE && this.letterRack[this.letterIndex].isSelected === true) {
            if (scrollDirection > 0) {
                this.swapWithRight(this.letterIndex);
                this.letterIndex++;
                if (this.letterIndex >= CONSTANTS.SIZE_OF_RACK) this.letterIndex = 0;
            } else if (scrollDirection < 0) {
                this.swapWithLeft(this.letterIndex);
                this.letterIndex--;
                if (this.letterIndex < 0) this.letterIndex = 6;
            }
        }
        this.changeRack(this.letterRack);
    }

    keyboardSelectLetter(buttonPressed: string) {
        if (buttonPressed === this.letterSelected) {
            this.letterIndex = this.findNextOccurence(buttonPressed, this.letterIndex);
            this.exchangeUnselectAll();
            this.unselectAll();
            this.letterRack[this.letterIndex].isSelected = true;
        } else if (this.findPressedKeyInRack(buttonPressed) !== CONSTANTS.INCORRECT_VALUE) {
            this.letterIndex = this.findPressedKeyInRack(buttonPressed);
            this.exchangeUnselectAll();
            this.unselectAll();
            this.letterRack[this.letterIndex].isSelected = true;
            this.letterSelected = buttonPressed;
        } else {
            this.letterSelected = '';
            this.exchangeUnselectAll();
            this.unselectAll();
        }
    }
    keyboardSwap(buttonPressed: string) {
        if (this.letterIndex !== CONSTANTS.INCORRECT_VALUE && this.letterRack[this.letterIndex].isSelected === true) {
            if (buttonPressed === 'ArrowRight') {
                this.swapWithRight(this.letterIndex);
                this.letterIndex++;
                if (this.letterIndex >= CONSTANTS.SIZE_OF_RACK) {
                    this.letterIndex = 0;
                }
                this.changeRack(this.letterRack);
            } else if (buttonPressed === 'ArrowLeft') {
                this.swapWithLeft(this.letterIndex);
                this.letterIndex--;
                if (this.letterIndex < 0) {
                    this.letterIndex = 6;
                }
                this.changeRack(this.letterRack);
            } else {
                this.unselectAll();
            }
        }
        return buttonPressed;
    }

    findPressedKeyInRack(buttonPressed: string) {
        for (let i = 0; i < this.letterRack.length; i++) {
            if (this.letterRack[i].getLetter() === buttonPressed) return i;
        }
        return CONSTANTS.INCORRECT_VALUE;
    }

    findNextOccurence(letter: string, index: number) {
        for (let i = index + 1; i < CONSTANTS.SIZE_OF_RACK; i++) {
            if (letter === this.letterRack[i].getLetter()) return i;
        }
        for (let i = 0; i < index; i++) {
            if (letter === this.letterRack[i].getLetter()) return i;
        }
        return index;
    }

    fillOutRack(rackToFill: Letter[]) {
        while (rackToFill.length < CONSTANTS.SIZE_OF_RACK && this.letterBank.bank.length > 1) rackToFill.push(this.letterBank.getLetter());
    }

    findLetterInRack(letter: Letter) {
        for (let i = 0; i < this.letterRack.length; i++) {
            if (this.letterRack[i] === letter) return i;
        }
        return CONSTANTS.INCORRECT_VALUE;
    }
    isLetter(buttonPressed: string) {
        if (buttonPressed === '*') {
            return true;
        }
        return buttonPressed.length === 1 && buttonPressed.match(/[a-z]/i);
    }
    swapWithRight(index: number) {
        const tempLetter = this.letterRack[index];
        if (index === CONSTANTS.SIZE_OF_RACK - 1) {
            this.letterRack[index] = this.letterRack[0];
            this.letterRack[0] = tempLetter;
        } else {
            this.letterRack[index] = this.letterRack[index + 1];
            this.letterRack[index + 1] = tempLetter;
        }
    }

    swapWithLeft(index: number) {
        const tempLetter = this.letterRack[index];
        if (index === 0) {
            this.letterRack[index] = this.letterRack[6];
            this.letterRack[6] = tempLetter;
        } else {
            this.letterRack[index] = this.letterRack[index - 1];
            this.letterRack[index - 1] = tempLetter;
        }
    }

    selectLetter(letter: Letter) {
        this.unselectAll();
        this.exchangeUnselectAll();
        letter.isSelected = !letter.isSelected;
        letter.isSelectedExchange = false;
        this.letterSelected = letter.getLetter();
        this.letterIndex = this.findLetterInRack(letter);
    }

    takeFromRack(letters: string): Letter[] {
        const word: Letter[] = [];
        for (const char of letters.replace(/[A-Z]/g, '*')) {
            for (let i = 0; i < this.letterRack.length; i++) {
                if (char === this.letterRack[i].getLetter() && this.letterRack[i].getLetter()) {
                    word.push(new Letter(char, this.letterRack[i].getValue()));
                    this.letterRack.splice(i, 1);
                    break;
                }
            }
        }
        this.changeRack(this.letterRack);
        return word;
    }

    unselectAll() {
        for (const letter of this.letterRack) {
            letter.isSelected = false;
        }
    }

    exchangeUnselectAll() {
        for (const letter of this.letterRack) {
            letter.isSelectedExchange = false;
        }
        this.selectedLetters = [];
    }

    putBackInRack(letters: Letter[]) {
        for (const letter of letters) {
            this.letterRack.push(letter);
        }
        this.changeRack(this.letterRack);
    }

    putOneInRack(letter: Letter) {
        this.letterRack.push(new Letter(letter.getLetter(), letter.getValue()));
        this.changeRack(this.letterRack);
    }

    changeRack(rack: Letter[]) {
        this.rack.next(rack);
    }

    reconstructLetterArray(letterArray: Letter[]) {
        const newArray = [];
        for (let i = 0; i < letterArray.length; i++) {
            newArray[i] = new Letter(letterArray[i].letter, letterArray[i].value);
        }
        return newArray;
    }

    // Exchange letter functions:

    selectForExchange(letter: Letter, event: MouseEvent) {
        event.preventDefault();
        // cancel other types of selection
        this.unselectAll();
        letter.isSelectedExchange = !letter.isSelectedExchange;
        if (letter.isSelectedExchange) this.selectedLetters.push(letter);
        if (!letter.isSelectedExchange) {
            const index = this.selectedLetters.findIndex((element) => element === letter);
            this.selectedLetters.splice(index, 1);
        }

        // this.audioManager.selectTileSound.play().catch();
    }

    exchangeLetters() {
        let word = '';
        for (const letter of this.selectedLetters) {
            letter.isSelectedExchange = false;
            letter.isSelected = false;
            this.letterBank.putBackLetter(letter);
            this.takeFromRack(letter.getLetter());
            this.changeRack(this.letterRack);
            word += letter.getLetter();
        }
        this.fillOutRack(this.letterRack);
        this.changeRack(this.letterRack);

        // this.audioManager.swapSound.play().catch();

        this.selectedLetters = [];
        this.writeToBoxService.write.emit('Mots "' + word + '" échangés');
    }

    cancelExchange() {
        for (const letter of this.selectedLetters) {
            letter.isSelectedExchange = false;
            letter.isSelected = false;
        }
        this.selectedLetters = [];
    }
}
