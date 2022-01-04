import { Injectable } from '@angular/core';
import * as CONSTANTS from '@app/constants';
import { Letter } from '@app/letter';

const SHUFFLINGVALUE = 0.5;

@Injectable({
    providedIn: 'root',
})
export class LetterBankService {
    bank: Letter[];

    constructor() {
        this.initializeAllLetters();
    }

    initializeAllLetters() {
        this.bank = [];
        for (let index = 0; index < CONSTANTS.allLettersMaxOccurences.length; index++) {
            const maxOcc = CONSTANTS.allLettersMaxOccurences[index];
            for (let i = 1; i <= maxOcc; i++) {
                this.bank.push(new Letter(CONSTANTS.alphabet[index].getLetter(), CONSTANTS.alphabet[index].getValue()));
            }
        }

        this.bank.sort(() => Math.random() - SHUFFLINGVALUE);
    }

    putBackLetter(letter: Letter) {
        this.bank.push(letter);
    }

    getLetter(): Letter {
        const position = Math.floor(Math.random() * this.bank.length);
        const letterToReturn: Letter[] = this.bank.splice(position, 1);
        return letterToReturn[0];
    }

    changeLetter(letterTochange: Letter): Letter {
        const randomValue = Math.random() * this.bank.length;
        const position = Math.floor(randomValue);
        const newLetter = this.bank.splice(position, 1, letterTochange)[0];
        return newLetter;
    }
}
