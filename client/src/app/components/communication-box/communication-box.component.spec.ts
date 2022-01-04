/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DebugCommand } from '@app/classes/commands/debug-command';
import { PassCommand } from '@app/classes/commands/pass-command';
import { PlaceCommand } from '@app/classes/commands/place-command';
import { ReplaceCommand } from '@app/classes/commands/replace-command';
import { SocketMock } from '@app/classes/socket-test-helper';
import { SocketService } from '@app/services/sockets/socket.service';
import { CommunicationBoxComponent } from './communication-box.component';

fdescribe('CommunicationBoxComponent', () => {
    let component: CommunicationBoxComponent;
    let fixture: ComponentFixture<CommunicationBoxComponent>;
    let socketMock: SocketMock;

    beforeEach(async () => {
        socketMock = new SocketMock();
        const socketService = jasmine.createSpyObj('SocketService', {}, { isHost: false, socket: socketMock });
        await TestBed.configureTestingModule({
            declarations: [CommunicationBoxComponent],
            imports: [FormsModule],
            providers: [{ provide: SocketService, useValue: socketService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CommunicationBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.communicationBoxDataService.opponentName = 'opponent';
        component.communicationBoxDataService.playerName = 'player';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('changeVariables should update user input variables', () => {
        const spy = spyOn(component.gridCoordService, 'changePosRow').and.callFake(() => {});
        component.changeVariables();
        expect(spy).toHaveBeenCalled();
    });

    it('should receive messages', () => {
        component.ngOnInit();
        socketMock.emit('receiveMessage', 'salut');
    });

    it('should execture command and change variables', () => {
        const spy = spyOn<any>(component, 'changeVariables');
        spyOn<any>(component.eventService, 'sendClickEvent').and.callFake(() => {});
        spyOn<any>(component.gameState, 'emitReset').and.callFake(() => {});
        component.userInput = '!placer h8h a';
        component.commandHandler();
        expect(spy).toHaveBeenCalled();
    });

    it('should not execture command', () => {
        const spy = spyOn<any>(component, 'writeMessage');
        spyOn<any>(component.eventService, 'sendClickEvent').and.callFake(() => {});
        spyOn<any>(component.gameState, 'emitReset').and.callFake(() => {});
        component.userInput = '!placer h8h a';
        component.gameState.isPlaying = false;
        component.commandHandler();
        expect(spy).toHaveBeenCalled();
    });

    it('should initialize commands in the commandList', () => {
        const passComd = new PassCommand(component.gameState);
        const debugComd = new DebugCommand();
        const replaceComd = new ReplaceCommand(component.rackService);
        const placeComd = new PlaceCommand(component.gameState, component.writeToBoxService);

        const testPassCmd = component.commandList.get('!passer');
        const testdebugComd = component.commandList.get('!debug');
        const testreplaceComd = component.commandList.get('!echanger');
        const testplaceComd = component.commandList.get('!placer');
        expect(testPassCmd).toEqual(passComd);
        expect(testdebugComd).toEqual(debugComd);
        expect(testreplaceComd).toEqual(replaceComd);
        expect(testplaceComd).toEqual(placeComd);
    });

    it('should display the correct player name and message', () => {
        component.userInput = 'a message';
        component.boxInput();
        const message = component.boxOutput.nativeElement.lastChild.previousSibling as HTMLSpanElement;
        const playerName = message.previousSibling as HTMLSpanElement;
        expect(playerName.innerText + message.innerText).toEqual('player: a message');
    });

    it('should not write anything in the box if the input is empty', () => {
        component.userInput = '';
        const outputBeforeMessage = component.boxOutput.nativeElement.innerText;
        component.boxInput();
        const outputAfterMessage = component.boxOutput.nativeElement.innerText;
        expect(outputBeforeMessage).toEqual(outputAfterMessage);
    });

    it('should write the player name in aqua', () => {
        component.userInput = 'a message';
        component.boxInput();
        const playerName = component.boxOutput.nativeElement.lastChild?.previousSibling.previousSibling as HTMLSpanElement;
        expect(playerName.style.color).toEqual('aqua');
    });

    it("should not write the message in the box if it's a command", () => {
        component.userInput = '!command';
        component.boxInput();
        const message = component.boxOutput.nativeElement.lastChild.previousSibling.previousSibling.previousSibling as HTMLSpanElement;
        expect(message.innerText).not.toEqual('!command');
    });

    it('should write a message into the box using writeToBoxService', () => {
        component.writeToBoxService.write.emit('a message');
        const message = component.boxOutput.nativeElement.lastChild.previousSibling as HTMLSpanElement;
        expect(message.innerText).toEqual('a message');
    });

    it('should write correct error if player tries to enter pass command and its not his turn', () => {
        component.userInput = '!passer';
        component.gameState.isPlaying = false;
        component.boxInput();
        const message = component.boxOutput.nativeElement.lastChild.previousSibling as HTMLSpanElement;
        expect(message.innerText).toEqual("Ce n'est pas votre tour de jouer !");
    });

    it('should change isInDebugMode if debug command is called', () => {
        component.userInput = '!debug';
        const valueBefore = component.isInDebugMode;
        component.boxInput();
        const valueAfter = component.isInDebugMode;
        expect(valueBefore).not.toEqual(valueAfter);
    });

    it('should change the value of askingHelp back to false after command !aide is used', () => {
        component.userInput = '!aide ';
        component.boxInput();
        expect(component.askedForHelp).toBe(false);
    });
});
