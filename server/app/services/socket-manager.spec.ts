/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Server } from '@app/server';
import { assert } from 'chai';
import * as ioClient from 'socket.io-client';
import { Container } from 'typedi';

describe('Socket tests', () => {
    let clientSocket: ioClient.Socket;

    before(async () => {
        const server: Server = Container.get(Server);
        server.init();
        clientSocket = ioClient.connect('http://localhost:3000/');
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- To connect, nothing is received
        clientSocket.on('connect', () => {});
    });

    after(() => {
        clientSocket.close();
    });
    it('should listen to createRoom, emit showRoomCreated and hostValue', async () => {
        await new Promise<void>((resolve) => {
            clientSocket.emit('createRoom', 'Room 1');
            clientSocket.on('showRoomCreated', (roomName) => {
                assert.equal(roomName, 'Room 1');
                resolve();
            });
            clientSocket.on('hostValue', (hostValue) => {
                assert.equal(hostValue, true);
                resolve();
            });
        });
        clientSocket.removeListener('showRoomCreated');
        clientSocket.removeListener('hostValue');
    });
    it('should listen to joinTheRoom, emit removeRoom, startGame and hostValue', async () => {
        await new Promise<void>((resolve) => {
            clientSocket.emit('joinTheRoom', 'Room 1');
            clientSocket.on('removeRoom', (name) => {
                assert.equal(name, 'Room 1');
                resolve();
            });
            clientSocket.on('startGame', () => {
                resolve();
            });
            clientSocket.on('hostValue', (hostValue) => {
                assert.equal(hostValue, false);
                resolve();
            });
        });
        clientSocket.removeListener('removeRoom');
        clientSocket.removeListener('startGame');
        clientSocket.removeListener('hostValue');
    });

    it('should listen to sendMessage, emit receiveMessage', () => {
        new Promise<void>((resolve) => {
            clientSocket.emit('sendMessage', 'Message 1');
            clientSocket.on('receiveMessage', (message) => {
                assert.equal(message, 'Message 1');
                resolve();
            });
        });
        clientSocket.removeListener('receiveMessage');
    });

    it('should listen to TimerReset and emit resetTimer', () => {
        new Promise<void>((resolve) => {
            clientSocket.emit('TimerReset');
            clientSocket.on('resetTimer', (name) => {
                assert.equal(name, 'RECUE DU SERVER');
                resolve();
            });
        });
    });

    it('should listen to Player1Input, emit displayPlayer1Play', () => {
        const EARNED_POINTS = 5;
        const mockUserInput = 'a1h abc';
        new Promise<void>((resolve) => {
            clientSocket.emit('Player1Input', EARNED_POINTS, mockUserInput);
            clientSocket.on('displayPlayer1Play', (earnedPoints, userInput) => {
                assert.equal(earnedPoints, 5);
                assert.equal(userInput, 'a1h abc');
                resolve();
            });
        });
        clientSocket.removeListener('displayPlayer1Play');
    });

    it('should listen to Player2Input, emit validatePlayer2Word', () => {
        const mockRack = 'abcdefg';
        const mockUserInput = 'a1h abc';
        new Promise<void>((resolve) => {
            clientSocket.emit('Player2Input', mockUserInput, mockRack);
            clientSocket.on('validatePlayer2Word', (userInput, rack) => {
                assert.equal(userInput, 'a1h abc');
                assert.equal(rack, 'abcdefg');
                resolve();
            });
        });
        clientSocket.removeListener('validatePlayer2Word');
    });

    it('should listen to player2Results, emit displayPlayer2Play', () => {
        const mockRack = 'abcdefg';
        const EARNED_POINTS = 5;
        new Promise<void>((resolve) => {
            clientSocket.emit('player2Results', mockRack, EARNED_POINTS);
            clientSocket.on('displayPlayer2Play', (rack, earnedPoints) => {
                assert.equal(rack, 'abcdefg');
                assert.equal(earnedPoints, 5);
                resolve();
            });
        });
        clientSocket.removeListener('displayPlayer2Play');
    });

    it('should listen to cancelPlayer2, emit canceledPlay', () => {
        const mockRack = 'abcdefg';
        const mockUsedLetters = 'abc';
        new Promise<void>((resolve) => {
            clientSocket.emit('cancelPlayer2', mockRack, mockUsedLetters);
            clientSocket.on('canceledPlay', (rack, usedLetters) => {
                assert.equal(rack, 'abcdefg');
                assert.equal(usedLetters, 'abc');
                resolve();
            });
        });
        clientSocket.removeListener('canceledPlay');
    });

    it('should listen to GetInitialRack, emit GetRackFromBank', () => {
        new Promise<void>((resolve) => {
            clientSocket.emit('GetInitialRack');
            clientSocket.on('GetRackFromBank', () => {
                resolve();
            });
        });
        clientSocket.removeListener('GetRackFromBank');
    });

    it('should listen to InitialRack, emit ReceiveRack', () => {
        const mockRack = 'abcdefg';
        new Promise<void>((resolve) => {
            clientSocket.emit('InitialRack', mockRack);
            clientSocket.on('ReceiveRack', (rack) => {
                assert.equal(rack, 'abcdefg');
                resolve();
            });
        });
        clientSocket.removeListener('ReceiveRack');
    });

    it('should listen to SendName, emit ReceiveOpponentName', () => {
        const name = 'Bob';
        new Promise<void>((resolve) => {
            clientSocket.emit('SendName', name);
            clientSocket.on('ReceiveOpponentName', (playerName) => {
                assert.equal(playerName, 'Bob');
                resolve();
            });
        });
        clientSocket.removeListener('ReceiveOpponentName');
    });

    /* it('should listen to validationRequest, emit serverValidation', () => {
        const wordToValidate = 'pomme';
        new Promise<void>((resolve) => {
            clientSocket.emit('validationRequest', wordToValidate);
            clientSocket.on('serverValidation', (isValidWord) => {
                assert.equal(isValidWord, true);
                resolve();
            });
        });
        clientSocket.removeListener('serverValidation');
    }); */

    it('should reset', () => {
        new Promise<void>((resolve) => {
            clientSocket.emit('sendMessage', 'Message 1');
            clientSocket.on('receiveMessage', (message) => {
                assert.equal(message, 'Message 1');
                resolve();
            });
        });
        clientSocket.removeListener('receiveMessage');
    });
});
