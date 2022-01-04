import * as CONSTANTS from '@app/constants';
import { Command } from '@app/interfaces/command';
import { LetterBankService } from '@app/services/letter-bank/letter-bank.service';

export class ReserveCommand implements Command {
    parameter: string;
    positionRow: string;
    positionColumn: string;
    orientation: string;
    letters: string;

    constructor(public letterBank: LetterBankService) {}

    executeCommand(param: string): string {
        this.parameter = param;
        const letterMap = new Map<string, number>();
        for (const letter of CONSTANTS.alphabet) letterMap.set(letter.letter, 0);
        for (const letter of this.letterBank.bank) {
            const occurrences = letterMap.get(letter.letter) || 0;
            letterMap.set(letter.letter, occurrences + 1);
        }
        let outputString = '';
        for (const letter of CONSTANTS.alphabet) {
            outputString += letter.letter;
            outputString += ': ';
            outputString += letterMap.get(letter.letter);
            if (letter.letter !== '*') outputString += '\n';
        }
        return outputString;
    }
}
