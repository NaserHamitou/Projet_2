/* eslint-disable @angular-eslint/contextual-lifecycle */
import { Component, ElementRef, Injectable, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DebugCommand } from '@app/classes/commands/debug-command';
import { HelpCommandService } from '@app/classes/commands/help-command';
import { PassCommand } from '@app/classes/commands/pass-command';
import { PlaceCommand } from '@app/classes/commands/place-command';
import { ReplaceCommand } from '@app/classes/commands/replace-command';
import { ReserveCommand } from '@app/classes/commands/reserve-command';
import { Command } from '@app/interfaces/command';
import { CommunicationBoxDataService } from '@app/services/communication-box-data.service';
import { EventService } from '@app/services/event/event.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';
import { LetterBankService } from '@app/services/letter-bank/letter-bank.service';
import { RackService } from '@app/services/rack/rack.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { WriteToBoxService } from '@app/services/write-to-box.service';

export const COMMAND_SIZE = 7;
export const ROW_PART = 8;
export const COLUM_PART = 9;
export const WORD_PART = 11;
export const ORIENTATION_PART = 10;
export const MAX_COLUM = 5;
export const PASS_COMMAND = '!passer';
export const RESERVE_COMMAND = '!reserve';
export const EXCHANGE_COMMAND = '!echanger';
export const PLACE_COMMAND = '!placer';
export const DEBUG_COMMAND = '!debug';
export const HELP_COMMAND = '!aide';

@Injectable({
    providedIn: 'root',
})
@Component({
    selector: 'app-communication-box',
    templateUrl: './communication-box.component.html',
    styleUrls: ['./communication-box.component.scss'],
})
export class CommunicationBoxComponent implements OnInit {
    @ViewChild('boxOutput', { read: ElementRef }) boxOutput: ElementRef;
    letters: string;
    positionRow: string;
    positionColum: string;
    orientation: string;
    isInDebugMode: boolean = false;
    askedForHelp: boolean = false;
    commandList: Map<string, Command> = new Map();
    userInput: string = '';

    constructor(
        public gridCoordService: GridCoordinateService,
        public communicationBoxDataService: CommunicationBoxDataService,
        public gameState: GameStateService,
        public eventService: EventService,
        public rackService: RackService,
        public socketService: SocketService,
        public letterBankService: LetterBankService,
        public writeToBoxService: WriteToBoxService,
        private renderer: Renderer2,
    ) {
        this.commandList
            .set(PASS_COMMAND, new PassCommand(gameState))
            .set(EXCHANGE_COMMAND, new ReplaceCommand(rackService))
            .set(PLACE_COMMAND, new PlaceCommand(gameState, writeToBoxService))
            .set(DEBUG_COMMAND, new DebugCommand())
            .set(RESERVE_COMMAND, new ReserveCommand(letterBankService))
            .set(HELP_COMMAND, new HelpCommandService());
        this.writeToBoxService.write.subscribe((message) => {
            this.writeMessage(message, true);
        });
    }

    boxInput(): void {
        if (this.userInput.length === 0) return;
        if (this.userInput[0] === '!') this.commandHandler();
        else {
            this.writeMessage(this.communicationBoxDataService.playerName + ': ', false, 'aqua');
            this.writeMessage(this.userInput, true);

            // Send a message
            try {
                this.socketService.socket.emit('sendMessage', this.userInput);
            } catch (err) {
                // Mode Solo
            }
        }

        this.resetScrollBar();
        this.userInput = '';
    }

    ngOnInit(): void {
        this.gridCoordService.currentPosRow.subscribe((pos) => (this.positionRow = pos));
        this.gridCoordService.currentPosCol.subscribe((pos) => (this.positionColum = pos));
        this.gridCoordService.currentLetter.subscribe((letr) => (this.letters = letr));
        this.gridCoordService.currentOrientation.subscribe((orient) => (this.orientation = orient));
        try {
            this.socketService.socket.on('receiveMessage', (message) => {
                this.writeMessage(this.communicationBoxDataService.opponentName + ': ', false, 'red');
                this.writeMessage(message, true);
                this.resetScrollBar();
            });
        } catch (err) {
            // console.log('Connection au server non etablie');
        }
    }

    commandHandler(): void {
        const command = this.userInput
            .split(' ')[0]
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '');

        if (this.commandList.get(command) === undefined) {
            this.writeMessage('Commande non existante', true);
            return;
        }
        if (
            !this.gameState.isPlaying &&
            (command === PASS_COMMAND || command === PLACE_COMMAND || (command === RESERVE_COMMAND && !this.isInDebugMode))
        ) {
            this.writeMessage("Ce n'est pas votre tour de jouer !", true);
            return;
        }
        let param = this.userInput.slice(this.userInput.indexOf(' ') + 1);

        if (param.normalize('NFD').replace(/\p{Diacritic}/gu, '') === command) param = '';
        if (command === DEBUG_COMMAND) {
            this.isInDebugMode = !this.isInDebugMode;
            param = this.isInDebugMode.toString();
        }
        if (command === HELP_COMMAND) {
            this.askedForHelp = true;
        }

        const executeMessage = this.commandList.get(command)?.executeCommand(param);

        if (executeMessage === '') {
            this.letters = this.commandList.get(PLACE_COMMAND)?.letters as string;
            this.positionRow = this.commandList.get(PLACE_COMMAND)?.positionRow as string;
            this.positionColum = this.commandList.get(PLACE_COMMAND)?.positionColumn as string;
            this.orientation = this.commandList.get(PLACE_COMMAND)?.orientation as string;
            this.changeVariables();
            this.eventService.sendClickEvent();
            this.gameState.emitReset();
        } else {
            this.writeMessage(executeMessage as string, true);
        }
    }

    changeVariables() {
        this.gridCoordService.changePosRow(this.positionRow);
        this.gridCoordService.changePosCol(this.positionColum);
        this.gridCoordService.changeLetter(this.letters);
        this.gridCoordService.changeOrientation(this.orientation);
    }

    private resetScrollBar(): void {
        this.boxOutput.nativeElement.scrollTop = this.boxOutput.nativeElement.scrollHeight;
    }

    private writeMessage(message: string, isLineBreak: boolean, color: string = 'white'): void {
        if (this.askedForHelp) {
            color = 'cyan';
            this.askedForHelp = false;
        }
        const newMessage = this.renderer.createElement('span');
        const messageText = this.renderer.createText(message);
        this.renderer.setStyle(newMessage, 'color', color);
        this.renderer.appendChild(newMessage, messageText);
        this.renderer.appendChild(this.boxOutput.nativeElement, newMessage);

        if (isLineBreak) {
            const br = this.renderer.createElement('br');
            this.renderer.appendChild(this.boxOutput.nativeElement, br);
        }
    }
}
