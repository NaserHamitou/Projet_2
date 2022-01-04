/* eslint-disable @typescript-eslint/naming-convention */

import { Component, OnInit } from '@angular/core';
import { VP } from '@app/classes/VP';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
    bestScore: string;
    mainPage: string;
    listJVD: VP[] = [];
    listJVE: VP[] = [];
    VPDname: string = '';
    VPEname: string = '';
    ID_debutant: string[] = [];
    ID_expert: string[] = [];
    isChangedD: boolean[] = [];
    isChangedE: boolean[] = [];

    constructor(public gameModeService: GameModeService, public socketService: SocketService) {
        gameModeService.isPlayingSolo = false;
        this.bestScore = 'none';
        this.mainPage = 'block';
    }

    ngOnInit(): void {
        this.gameModeService.isPlayingSolo = false;
        this.socketService.socket = io(environment.serverUrl);
        this.socketService.socket.on('connect', () => {
            /* Connection Made */
        });

        this.socketService.socket.on('listJV', (listJVDebutant, listJV_Expert) => {
            this.listJVD = listJVDebutant;
            this.listJVE = listJV_Expert;

            this.listJVD.forEach((element, index) => {
                this.ID_debutant.push(listJVDebutant[index].id.toString());
            });

            this.listJVE.forEach((element, index) => {
                this.ID_expert.push(listJV_Expert[index].id.toString());
            });
        });

        // this.socketService.socket.emit('listJV');
    }

    getListJV() {
        this.ID_debutant = [];
        this.ID_expert = [];
        this.listJVD = [];
        this.listJVE = [];

        this.socketService.socket.emit('listJV');
        this.bestScore = 'block';
        this.mainPage = 'none';
    }

    addVPD(): void {
        let isExsitD = false;
        let isExsitE = false;

        this.listJVD.forEach((element, index) => {
            this.isChangedD[index] = false;
            if (element.playerName.includes(this.VPDname)) {
                isExsitD = true;
            }
        });
        this.listJVE.forEach((element) => {
            if (element.playerName.includes(this.VPDname)) {
                isExsitE = true;
            }
        });
        if (!isExsitD && !isExsitE) {
            this.socketService.socket.emit('VPDname', this.VPDname);
            this.listJVD.push({ playerName: this.VPDname, level: 'Debutant' });
            alert('Le joueur : ' + this.VPDname + ' a bien été ajouté');
        } else alert('Ce nom existe deja   veuillez réessayer ');
    }

    addVPE(): void {
        let isExsitD = false;
        let isExsitE = false;
        this.listJVE.forEach((element, index) => {
            this.isChangedE[index] = false;
            if (element.playerName.includes(this.VPEname)) {
                isExsitE = true;
            }
        });

        this.listJVD.forEach((element) => {
            if (element.playerName.includes(this.VPEname)) {
                isExsitD = true;
            }
        });

        if (!isExsitD && !isExsitE) {
            this.socketService.socket.emit('VPEname', this.VPEname);
            this.listJVE.push({ playerName: this.VPEname, level: 'Expert' });
            alert('Le joueur : ' + this.VPEname + ' a bien été ajouté');
        } else alert('Ce nom existe deja   veuillez réessayer ');
    }

    deleteVPD(index: number, name: string): void {
        let isExsit = false;
        if (name === this.listJVD[0].playerName || name === this.listJVD[1].playerName || name === this.listJVD[2].playerName) {
            alert('Vous ne pouvez pas supprimer ce nom');
            isExsit = true;
        }
        if (!isExsit) {
            this.socketService.socket.emit('deleteJVD', name);
            this.listJVD.forEach((element) => {
                if (element.playerName === name) {
                    this.listJVD.splice(index, 1);
                }
            });
            alert('Le joueur : ' + name + ' a bien ete supprime');
        }
    }
    updateNameD(index: number, name: string) {
        let isExsit = false;
        if (name === this.listJVD[0].playerName || name === this.listJVD[1].playerName || name === this.listJVD[2].playerName) {
            isExsit = true;
            alert('Vous ne pouvez pas changer ce nom');
        }
        if (!isExsit) {
            this.isChangedD[index] = true;
        }
    }

    deleteVPE(index: number, name: string): void {
        let isExsit = false;
        if (name === this.listJVE[0].playerName || name === this.listJVE[1].playerName || name === this.listJVE[2].playerName) {
            alert('Vous ne pouvez pas supprimer ce nom');
            isExsit = true;
        }
        if (!isExsit) {
            this.socketService.socket.emit('deleteJVE', name);
            this.listJVE.forEach((element) => {
                if (element.playerName === name) {
                    this.listJVE.splice(index, 1);
                }
            });
            alert('Le joueur : ' + name + ' a bien ete supprime');
        }
    }

    updateNameE(index: number, name: string) {
        let isExsit = false;
        if (name === this.listJVE[0].playerName || name === this.listJVE[1].playerName || name === this.listJVE[2].playerName) {
            isExsit = true;
            alert('Vous ne pouvez pas changer ce nom');
        }
        if (!isExsit) {
            this.isChangedE[index] = true;
        }
    }

    cancelChangeD(index: number) {
        this.isChangedD[index] = false;
    }
    cancelChangeE(index: number) {
        this.isChangedE[index] = false;
    }

    confirmerNameD(index: number, id: string) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        this.listJVD[index].playerName = (<HTMLInputElement>document.getElementById('inputnameD')).value;
        this.socketService.socket.emit('updatNameD', this.listJVD[index].playerName, id);
        this.isChangedD[index] = false;
    }
    confirmerNameE(index: number, id: string) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        this.listJVE[index].playerName = (<HTMLInputElement>document.getElementById('inputnameE')).value;
        this.socketService.socket.emit('updatNameE', this.listJVE[index].playerName, id);
        this.isChangedE[index] = false;
    }

    updateJVD(id: string, name: string): void {
        this.socketService.socket.emit('updateJVD', id, name);
    }

    updateJVE(id: string, name: string): void {
        this.socketService.socket.emit('updateJVE', id, name);
    }
}
