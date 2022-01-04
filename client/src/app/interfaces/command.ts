export interface Command {
    parameter: string;
    positionRow: string;
    positionColumn: string;
    orientation: string;
    letters: string;
    executeCommand(param: string): string;
}
