import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioManagerService } from '@app/services/audio/audio-manager.service';
import { CommunicationBoxDataService } from '@app/services/communication-box-data.service';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { SocketService } from '@app/services/sockets/socket.service';

export interface Room {
    nameOfhost: string;
    nameOfRoom: string;
}
@Component({
    selector: 'app-room-manager',
    templateUrl: './room-manager.component.html',
    styleUrls: ['./room-manager.component.scss'],
})
export class RoomManagerComponent implements OnInit {
    roomName: string = '';
    rooms: Room[] = [];
    createRoomBox: string;
    listRoomBox: string;
    waitingRoom: string;
    joinDisplay: string;
    roomNameValid: boolean;

    constructor(
        public socketService: SocketService,
        public commicationData: CommunicationBoxDataService,
        public router: Router,
        public location: Location,
        public gameModeService: GameModeService,
        readonly audioManager: AudioManagerService,
    ) {
        this.createRoomBox = 'none';
        this.listRoomBox = 'block';
        this.waitingRoom = 'none';
        this.joinDisplay = 'none';
        this.roomNameValid = true;
    }

    createRoom(roomName: string) {
        if (!this.rooms.find((val) => val.nameOfRoom === roomName)) {
            this.socketService.socket.emit('createRoom', roomName, this.commicationData.playerName);
            this.rooms.push({ nameOfRoom: roomName, nameOfhost: this.commicationData.playerName });
            this.waitingRoom = 'block';
            this.createRoomBox = 'none';
            this.listRoomBox = 'none';
        } else window.alert('Ce nom de parti est deja pris ! Veuillez choisir un autre nom');
    }

    createBox() {
        // this.audioManager.buttonClick();
        this.createRoomBox = 'block';
        this.listRoomBox = 'none';
    }

    cancelCreatioon() {
        // this.audioManager.backSound.play().catch();
        this.createRoomBox = 'none';
        this.listRoomBox = 'block';
        this.roomName = '';
        this.commicationData.playerName = '';
    }

    goBack() {
        // this.audioManager.backSound.play().catch();
        this.location.replaceState('/home');
        this.location.historyGo();
    }

    joinRoom(userName: string) {
        // this.audioManager.buttonClick();
        this.commicationData.playerName = userName;
        this.socketService.socket.emit('joinTheRoom', this.roomName, this.commicationData.playerName);
    }

    joinBox(roomName: string) {
        // this.audioManager.buttonClick();
        this.joinDisplay = 'block';
        this.roomName = roomName;
    }

    playSolo() {
        // this.audioManager.buttonClick();
        this.socketService.socket.emit('deconnectClient');
        this.gameModeService.isPlayingSolo = true;
        this.router.navigate(['/new-game']);
    }

    verifyRoomName(name: string) {
        for (const room of this.rooms) {
            if (name === room.nameOfRoom) {
                this.roomNameValid = false;
                return;
            }
        }
        this.roomNameValid = true;
    }

    joinRandom() {
        // this.audioManager.buttonClick();
        const randIndex = Math.floor(Math.random() * this.rooms.length);
        const randomRoom = this.rooms[randIndex].nameOfRoom;
        this.joinBox(randomRoom);
    }

    ngOnInit() {
        this.socketService.initializeSocket();

        this.socketService.socket.on('currentRoomList', (mapEntries) => {
            for (const [key, value] of mapEntries) {
                this.rooms.push({ nameOfhost: value, nameOfRoom: key });
            }
        });

        this.socketService.socket.on('showRoomCreated', (roomName, playerName) => {
            this.rooms.push({ nameOfhost: playerName, nameOfRoom: roomName });
        });

        this.socketService.socket.on('removeRoom', (roomName) => {
            this.rooms = this.rooms.filter((room) => {
                return room.nameOfRoom !== roomName;
            });
        });

        this.socketService.socket.on('startGame', () => {
            this.router.navigate(['/connection']);
        });
    }
}
