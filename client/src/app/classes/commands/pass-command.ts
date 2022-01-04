import { Command } from '@app/interfaces/command';
import { GameStateService } from '@app/services/game-state/game-state.service';

export class PassCommand implements Command {
    parameter: string;
    positionRow: string;
    positionColumn: string;
    orientation: string;
    letters: string;

    constructor(public gameStateService: GameStateService) {}

    executeCommand(param: string): string {
        this.parameter = param;
        this.gameStateService.emitReset();
        const message = 'Vous avez passé votre tour';
        return message;
    }
}
