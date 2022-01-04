import { FileInfo } from '@app/classes/file-info';
import { Score } from '@app/classes/score';
import { VP } from '@app/classes/VP';
import * as fs from 'fs';
import * as http from 'http';
import * as io from 'socket.io';
import { DictionaryValidatorService } from './dictionary-validator.service';
import { ScoresService } from './scores.service';
import { WordValidator } from './word-validator.service';

const DEFAULT_DICTIONARY_TITLE = 'Mon dictionnaire';
const DICTIONARY_PATH = 'app/assets';
export const START_COUNT = -1;
export class SocketManager {
    count: number = START_COUNT;
    roomeNames = [''];
    roomlast: [];
    sizeRoomServer: number;
    roomContainer: Map<string, string>;
    displayedRoom: Map<string, string>;
    score: Promise<Score[]>;

    fileInfoMap: Map<string, FileInfo>;
    dictionariesUsedMap: Map<string, string>;

    isHost: boolean = false;
    private sio: io.Server;
    constructor(
        server: http.Server,
        public wordValid: WordValidator,
        public dictionaryValidatorService: DictionaryValidatorService,
        public scoresService: ScoresService,
    ) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.roomContainer = new Map();
        this.displayedRoom = new Map();
        this.fileInfoMap = new Map();
        this.dictionariesUsedMap = new Map();
    }
    //
    handleSockets(): void {
        this.sio.on('connect', (socket) => {
            const serializedMap = [...this.displayedRoom.entries()];
            socket.emit('currentRoomList', serializedMap);

            //* ***************************Room Handling*************************************** */

            /* **********************************Room Handling 2.0***************************************** */

            socket.on('disconnecting', (reason) => {
                const room = this.roomContainer.get(socket.id) as string;
                if (reason === 'client namespace disconnect') {
                    socket.to(room).emit('playerLeft');
                } else if (reason === 'transport close') {
                    socket.to(room).emit('playerClosed');
                }
            });

            socket.on('disconnect', () => {
                const room = this.roomContainer.get(socket.id) as string;
                const dictionaryName = this.dictionariesUsedMap.get(room) as string;
                this.dictionariesUsedMap.delete(room);
                let isUsed = false;
                for (const dictionaryN of this.dictionariesUsedMap.values()) {
                    if (dictionaryN === dictionaryName) {
                        isUsed = true;
                        break;
                    }
                }
                if (!isUsed && dictionaryName !== DEFAULT_DICTIONARY_TITLE) this.wordValid.dictionaryMap.delete(dictionaryName);
                socket.leave(room);
                this.sio.emit('removeRoom', room);
                this.roomContainer.delete(socket.id);
                this.displayedRoom.delete(room);
            });
            /* **********************************Room Handling 2.0***************************************** */
            socket.on('createRoom', async (roomName, playerName) => {
                await socket.join(roomName);
                this.roomContainer.set(socket.id, roomName);
                this.displayedRoom.set(roomName, playerName);
                socket.broadcast.emit('showRoomCreated', roomName, playerName);
                socket.emit('hostValue', true);
            });

            socket.on('joinTheRoom', async (roomName) => {
                await this.sio.emit('removeRoom', roomName);
                await socket.join(roomName);
                this.roomContainer.set(socket.id, roomName);
                this.displayedRoom.delete(roomName);
                this.sio.to(roomName).emit('startGame');
                socket.emit('hostValue', false);
            });

            /* ***************************Chat Sockets********************************* */

            socket.on('sendMessage', (message) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('receiveMessage', message);
            });

            //* ***************************MultiPlayer Sockets********************************* */

            socket.on('TimerReset', () => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('resetTimer', 'RECUE DU SERVER');
            });

            socket.on('Player1Input', (earnedPoints, userInput) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('displayPlayer1Play', earnedPoints, userInput);
            });

            socket.on('Player2Input', (userInput, rack) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('validatePlayer2Word', userInput, rack);
            });

            socket.on('player2Results', (updatedRack, earnedPoints) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('displayPlayer2Play', updatedRack, earnedPoints);
            });

            socket.on('cancelPlayer2', (playerRack, usedLetters) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('canceledPlay', playerRack, usedLetters);
            });

            socket.on('GetInitialRack', () => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('GetRackFromBank');
            });

            socket.on('InitialRack', (initialRack) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('ReceiveRack', initialRack);
            });

            socket.on('SendName', (name) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('ReceiveOpponentName', name);
            });

            socket.on('validationRequest', (word) => {
                const room = this.roomContainer.get(socket.id) as string;
                const validation = this.wordValid.isInDictionary(word, this.dictionariesUsedMap.get(room) as string);
                socket.emit('serverValidation', validation);
            });
            /** *****************************Gett Top 5 scores ******************************* */
            /** *****************************DB  DB DB  DB  ******************************* */
            socket.on('askbestScore', async () => {
                await this.scoresService.getAllScores();
                socket.emit('bestScore', this.scoresService.scoreClassique, this.scoresService.scoreLOG2990);
            });

            socket.on('addBestScoreClassique', (score, name) => {
                const scoreClassique = { playerName: name, score: score } as Score;
                this.scoresService.addScoreClassque(scoreClassique);
            });

            socket.on('addBestScoreLog', (score, name) => {
                const scoreLog = { playerName: name, score: score } as Score;
                this.scoresService.addScoreLOG2990(scoreLog);
            });

            socket.on('listJV', async () => {
                await this.scoresService.getAlistVJ();
                this.sio.emit('listJV', this.scoresService.JV_Debutant, this.scoresService.JV_Expert);
                this.sio.emit('listJV', this.scoresService.JV_Debutant, this.scoresService.JV_Expert);
            });

            socket.on('deleteJVD', async (name: string) => {
                await this.scoresService.deleteVPD(name);
            });

            socket.on('deleteJVE', async (name: string) => {
                await this.scoresService.deleteVPE(name);
            });

            socket.on('VPDname', async (name: string) => {
                await this.scoresService.addJVD(name);
            });

            socket.on('VPEname', async (name: string) => {
                await this.scoresService.addJVE(name);
            });

            socket.on('updatNameD', async (name, ide) => {
                const vpd: VP = {
                    id: ide,
                    playerName: name,
                    level: 'Debutant',
                };

                await this.scoresService.modifyVPD(vpd);
            });

            socket.on('updatNameE', async (name, ide) => {
                const vpe: VP = {
                    id: ide,
                    playerName: name,
                    level: 'Debutant',
                };

                await this.scoresService.modifyVPE(vpe);
            });

            /** *****************************DB  DB DB  DB  ******************************* */
            /** *****************************DB  DB DB  DB  ******************************* */

            /** *****************************Dictionary sockets******************************* */
            socket.on('uploadStart', (fileSize) => {
                const fileName = this.dictionaryValidatorService.getRandomFileName();
                this.fileInfoMap.set(socket.id, new FileInfo(fileName, fileSize));
                const fileInfo = this.fileInfoMap.get(socket.id);
                if (fileInfo === undefined) return;
                fileInfo.writer = fs.createWriteStream(DICTIONARY_PATH + '/' + fileName, {
                    encoding: 'base64',
                });
            });

            socket.on('writeFileChunk', (message) => {
                const fileInfo = this.fileInfoMap.get(socket.id);
                if (fileInfo === undefined) return;
                fileInfo.writer.write(message, () => {
                    const stats = fs.statSync(DICTIONARY_PATH + '/' + fileInfo.fileName);
                    if (stats.size === fileInfo.fileSize) {
                        const error = this.dictionaryValidatorService.checkValidity(fileInfo.fileName);
                        fileInfo.writer.end();
                        this.fileInfoMap.delete(socket.id);
                        socket.emit('fileUploadDone', error);
                    }
                });
            });

            socket.on('info', () => {
                this.sio.emit('getDictionariesInfo', Array.from(this.dictionaryValidatorService.sendDictionaryList()));
            });

            socket.on('fileDelete', (title) => {
                const error = this.dictionaryValidatorService.deleteDictionary(title);
                socket.emit('fileDeleteDone', error);
            });

            socket.on('updateDictionaryValue', (isTitle, newValue, title) => {
                const error = this.dictionaryValidatorService.updateDictionary(isTitle, newValue, title);
                socket.emit('updateDone', error);
            });

            socket.on('resetData', () => {
                this.dictionaryValidatorService.resetDictionaries();
                socket.emit('resetDone');
            });

            socket.on('setDictionary', (name) => {
                const room = this.roomContainer.get(socket.id);
                const words = this.dictionaryValidatorService.getDictionaryWords(name);
                socket.emit('sendDictionary', words);

                // if multiplayer
                if (room !== undefined) {
                    socket.to(room).emit('sendDictionary', words);
                    // if dictionnary not deleted
                    if (words !== null) {
                        this.dictionariesUsedMap.set(room, name);
                        if (!this.wordValid.dictionaryMap.has(name)) this.wordValid.dictionaryMap.set(name, words);
                    }
                }
            });

            /** *****************************Bonus sockets******************************* */

            socket.on('sendPublic', (objective, objective2) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('ReceivePublicObjective', objective, objective2);
            });

            socket.on('sendPrivate', (objective) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('ReceivePrivateObjective', objective);
            });

            socket.on('exchangeClicked', () => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('exchangeP2Clicked');
            });

            // Results sent to player2
            // // // of Player 2
            socket.on('sendP1score', (points, name) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('updateP1score', points, name);
            });

            socket.on('privateCompletPlayer2', (points) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('privateCompletedP2', points);
            });

            socket.on('publicCompletPlayer2', (points) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('public1CompletedP2', points);
            });

            socket.on('public2CompletPlayer2', (points) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('public2CompletedP2', points);
            });
            // // // of Player 1
            socket.on('publicCompletPlayer1', (points) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('public1CompletedP1', points);
            });

            socket.on('public2CompletPlayer1', (points) => {
                const room = this.roomContainer.get(socket.id) as string;
                socket.to(room).emit('public2CompletedP1', points);
            });
        });
    }
}
