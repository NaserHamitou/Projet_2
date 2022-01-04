import { Command } from '@app/interfaces/command';

export class DebugCommand implements Command {
    parameter: string;
    positionRow: string;
    positionColumn: string;
    orientation: string;
    letters: string;

    executeCommand(param: string): string {
        let message: string;
        if (param === 'true') message = 'Mode debug activé';
        else message = 'Mode debug désactivé';

        return message;
    }
}
