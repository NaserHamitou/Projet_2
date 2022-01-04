import { LetterBankService } from '@app/services/letter-bank/letter-bank.service';
import { ReserveCommand } from './reserve-command';

fdescribe('ReserveCommand', () => {
    let reserve: ReserveCommand;
    let letterBankService: LetterBankService;

    beforeEach(() => {
        reserve = new ReserveCommand(letterBankService);
        reserve.letterBank = new LetterBankService();
    });

    it('should create an instance', () => {
        expect(new ReserveCommand(letterBankService)).toBeTruthy();
    });

    it('executeCommand should show the reserve in alphabetical order', () => {
        const reserveContent: string = reserve.executeCommand('');
        const reserveContentLines: string[] = reserveContent.split('\n');

        let isInOrder = true;
        let previousCharCode = 0;

        for (const line of reserveContentLines) {
            let letterCharCode = line.charCodeAt(0);
            const letter = line[0];
            if (letter === '*') letterCharCode = 'z'.charCodeAt(0) + 1;
            if (letterCharCode <= previousCharCode) {
                isInOrder = false;
                break;
            }
            previousCharCode = letterCharCode;
        }

        expect(isInOrder).toBeTruthy();
    });
});
