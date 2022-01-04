import { Injectable } from '@angular/core';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    socket: Socket;
    isHost: boolean;
    nameGame: string;
    readonly uri: string = environment.serverUrl;

    constructor(public gameModeService: GameModeService) {}

    initializeSocket() {
        this.socket = io(this.uri);
        this.socket.on('connect_error', async () => {
            this.gameModeService.isPlayingSolo = true;
        });

        this.socket.on('connect', () => {
            /* Connection Made */
        });

        this.socket.on('hostValue', (value) => {
            this.isHost = value;
        });
    }
}
