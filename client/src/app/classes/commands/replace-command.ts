import * as CONSTANTS from '@app/constants';
import { Command } from '@app/interfaces/command';
import { Letter } from '@app/letter';
import { RackService } from '@app/services/rack/rack.service';

export class ReplaceCommand implements Command {
    parameter: string;
    positionRow: string;
    positionColumn: string;
    orientation: string;
    letters: string;
    letterArray: Letter[] = [];

    constructor(public rackService: RackService) {}

    executeCommand(param: string): string {
        this.letterArray = [];
        this.letters = param
            .split(' ')[0]
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '');

        let message: string;

        if (this.rackService.letterRack.length < CONSTANTS.SIZE_OF_RACK) {
            message = 'Chevalet contient moins de 7 lettres';
            return message;
        }
        if (this.letters.length === 0) {
            message = 'Aucune lettre à échanger';
            return message;
        }
        if (this.letters.length > CONSTANTS.SIZE_OF_RACK) {
            message = "Impossible d'échanger plus de 7 lettres";
            return message;
        }
        for (const char of this.letters) {
            const letterFound = this.rackService.letterRack.find((element) => element.getLetter() === char);
            if (typeof letterFound === 'undefined') {
                message = 'La lettre "' + char + '" ne se trouve pas dans le chevalet';
                return message;
            } else this.letterArray.push(letterFound);
        }

        for (const letter of this.letterArray) {
            this.rackService.takeFromRack(letter.getLetter());
            this.rackService.letterBank.putBackLetter(letter);
        }
        this.rackService.fillOutRack(this.rackService.letterRack);
        this.rackService.changeRack(this.rackService.letterRack);
        this.letterArray = [];

        this.rackService.noExchangeCounter = 0;

        message = 'Lettres "' + this.letters + '" échangées';
        return message;
    }
}
