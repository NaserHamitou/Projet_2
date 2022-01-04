import { Injectable } from '@angular/core';
import * as CONSTANTS from '@app/constants';
import { arrayOfNumber, arrayOfRows } from '@app/constants';
import { Command } from '@app/interfaces/command';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { WriteToBoxService } from '@app/services/write-to-box.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceCommand implements Command {
    parameter: string;
    positionRow: string;
    positionColumn: string;
    orientation: string;
    letters: string;
    commandValid: boolean;
    isGameBegin: boolean;

    constructor(public gameState: GameStateService, public writeToBoxService: WriteToBoxService) {}

    executeCommand(param: string): string {
        let message: string;

        if (param === '' || param.split(' ').length < 2) {
            message = 'Paramètre(s) manquant';
            return message;
        }
        this.parameter = param.split(' ')[0];
        this.letters = param
            .split(' ')[1]
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '');
        this.positionRow = '';
        this.positionColumn = '';
        this.orientation = '';
        this.commandValid = false;

        if (this.letters.match(/[.,:!?]/)) return 'Veuillez ne pas inclure de ponctuation';

        if (!this.verifyPosition(param[0])) return 'Position erronée';

        if (this.parameter.length > CONSTANTS.PARAM_LENGHT || isNaN(Number(this.parameter[1]))) {
            message = 'Commande erronée';
            return message;
        }

        if (!this.verifyOrientation()) {
            message = 'Orientation erronée';
            return message;
        }

        const startPosition: string = this.parameter[0] + this.parameter[1];

        if (this.gameState.isGameBegin) {
            if (startPosition !== 'h8') return 'Veuillez debuter le jeu sur la case h8';
        }

        this.gameState.isGameBegin = false;

        message = 'Lettre(s) "' + this.letters + '" jouée(s) au ' + this.positionRow + this.positionColumn + ' en ' + this.orientation;
        this.writeToBoxService.write.emit(message);
        return '';
    }

    verifyOrientation(): boolean {
        let commandValid = true;

        if (this.parameter.charAt(this.parameter.length - 1) === 'h' && this.letters) {
            this.letters = this.letters.substring(0, CONSTANTS.NUMBER_OF_TILES + 1 - Number(this.positionColumn));
            this.orientation = 'h';
        } else if (this.parameter.charAt(this.parameter.length - 1) === 'v' && this.letters) {
            this.letters = this.letters.substring(0, CONSTANTS.NUMBER_OF_TILES - arrayOfRows.indexOf(this.positionRow));
            this.orientation = 'v';
        } else commandValid = false;
        return commandValid;
    }

    verifyPosition(row: string): boolean {
        let commandValid = false;
        for (const letter of arrayOfRows) {
            if (row === letter) {
                this.positionRow = row;
                commandValid = true;
                break;
            }
        }

        if (!commandValid) return false;

        commandValid = false;
        for (const num of arrayOfNumber) {
            if (this.parameter.replace(/[^0-9]/g, '') === String(num)) {
                this.positionColumn = String(num);
                commandValid = true;
                break;
            }
        }

        return commandValid;
    }
}
