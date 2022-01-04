import { Component, OnInit } from '@angular/core';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { ObjectivesService } from '@app/services/objectives/objectives.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { WriteToBoxService } from '@app/services/write-to-box.service';

export interface ObjectiveDisplay {
    name: string;
    description: string;
    completed: string;
    isCompleted: boolean;
    points: number;
}

@Component({
    selector: 'app-bonus-display',
    templateUrl: './bonus-display.component.html',
    styleUrls: ['./bonus-display.component.scss'],
})
export class BonusDisplayComponent implements OnInit {
    privateObjective: ObjectiveDisplay;
    publicObjectives: ObjectiveDisplay[];

    constructor(
        public objectivesService: ObjectivesService,
        public gameMode: GameModeService,
        public socketService: SocketService,
        public writeToBoxService: WriteToBoxService,
    ) {
        this.privateObjective = {
            name: '',
            description: '',
            completed: '',
            isCompleted: false,
            points: 0,
        };
        this.publicObjectives = [
            { name: '', description: '', completed: '', isCompleted: false, points: 0 },
            { name: '', description: '', completed: '', isCompleted: false, points: 0 },
        ];
    }

    ngOnInit(): void {
        if (this.socketService.isHost || this.gameMode.isPlayingSolo) {
            this.objectivesService.pickPublicObjectives();
            this.objectivesService.pickPrivateObjective();
            this.objectivesService.pickSecondPrivate();
            this.mainClientSetUp();
            this.verificationSteps();
        } else this.secondClientSetUp();
    }

    mainClientSetUp() {
        this.privateObjective = this.objectivesService.privateBonus;
        for (let i = 0; i < 2; i++) {
            this.publicObjectives[i] = this.objectivesService.publicBonus[i];
        }
        if (this.gameMode.isPlayingSolo) return;
        const objectPrivate = {
            name: this.objectivesService.secondPlayerBonus.name,
            description: this.objectivesService.secondPlayerBonus.description,
            completed: '',
            isCompleted: false,
            points: this.objectivesService.secondPlayerBonus.points,
        };
        const objectPublic = {
            name: this.publicObjectives[0].name,
            description: this.publicObjectives[0].description,
            completed: '',
            isCompleted: false,
            points: this.publicObjectives[0].points,
        };
        const objectPublic2 = {
            name: this.publicObjectives[1].name,
            description: this.publicObjectives[1].description,
            completed: '',
            isCompleted: false,
            points: this.publicObjectives[1].points,
        };
        try {
            this.socketService.socket.emit('sendPublic', objectPublic, objectPublic2);
            this.socketService.socket.emit('sendPrivate', objectPrivate);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }

    secondClientSetUp() {
        // Player 2 receives objectives
        this.socketService.socket.on('ReceivePrivateObjective', (privateObj) => {
            this.privateObjective = privateObj;
        });

        this.socketService.socket.on('ReceivePublicObjective', (publicObj, publicObj2) => {
            this.publicObjectives[0] = publicObj;
            this.publicObjectives[1] = publicObj2;
        });

        // Player 2 completes objectives
        this.socketService.socket.on('privateCompletedP2', (points) => {
            this.objectivesService.pointsCalculatorService.changePoints(points, 0);
            this.privateObjective.completed = 'line-through';
            this.privateObjective.isCompleted = true;
        });

        this.socketService.socket.on('public1CompletedP2', (points) => {
            this.objectivesService.pointsCalculatorService.changePoints(points, 0);
            this.publicObjectives[0].completed = 'line-through';
            this.publicObjectives[0].isCompleted = true;
        });

        this.socketService.socket.on('public2CompletedP2', (points) => {
            this.objectivesService.pointsCalculatorService.changePoints(points, 0);
            this.publicObjectives[1].completed = 'line-through';
            this.publicObjectives[1].isCompleted = true;
        });

        // Player 1 completes objectives
        this.socketService.socket.on('updateP1score', (points, name) => {
            this.objectivesService.pointsCalculatorService.changePoints(points, 1);
            this.writeToBoxService.write.emit("L'adversaire a complété son objectif privé: " + name + '!');
        });

        this.socketService.socket.on('public1CompletedP1', (points) => {
            this.objectivesService.pointsCalculatorService.changePoints(points, 1);
            this.publicObjectives[0].completed = 'line-through';
            this.publicObjectives[0].isCompleted = true;
        });

        this.socketService.socket.on('public2CompletedP1', (points) => {
            this.objectivesService.pointsCalculatorService.changePoints(points, 1);
            this.publicObjectives[1].completed = 'line-through';
            this.publicObjectives[1].isCompleted = true;
        });
    }

    verificationSteps() {
        this.objectivesService.currentPlay.subscribe((value) => {
            // Objectif private
            if (value && this.objectivesService.privateBonus.verify()) {
                this.objectivesService.pointsCalculatorService.changePoints(this.objectivesService.privateBonus.points, 0);
                this.privateObjective.completed = this.objectivesService.privateBonus.completed;
                this.socketService.socket.emit('sendP1score', this.objectivesService.privateBonus.points, this.objectivesService.privateBonus.name);
            } else if (!value && this.objectivesService.secondPlayerBonus.verify()) {
                this.objectivesService.pointsCalculatorService.changePoints(this.objectivesService.privateBonus.points, 1);
                this.socketService.socket.emit('privateCompletPlayer2', this.objectivesService.privateBonus.points);
                this.writeToBoxService.write.emit(
                    "L'adversaire a complété son objectif privé: " + this.objectivesService.secondPlayerBonus.name + '!',
                );
            }

            // Objectif Public 1
            if (this.objectivesService.publicBonus[0].verify()) {
                if (value) {
                    this.objectivesService.pointsCalculatorService.changePoints(this.objectivesService.publicBonus[0].points, 0);
                    this.publicObjectives[0].completed = this.objectivesService.publicBonus[0].completed;
                    this.socketService.socket.emit('publicCompletPlayer1', this.objectivesService.publicBonus[0].points);
                } else {
                    this.objectivesService.pointsCalculatorService.changePoints(this.objectivesService.publicBonus[0].points, 1);
                    this.publicObjectives[0].completed = this.objectivesService.publicBonus[0].completed;
                    this.socketService.socket.emit('publicCompletPlayer2', this.objectivesService.publicBonus[0].points);
                }
            }

            // Objectif Public 2
            if (this.objectivesService.publicBonus[1].verify()) {
                if (value) {
                    this.objectivesService.pointsCalculatorService.changePoints(this.objectivesService.publicBonus[1].points, 0);
                    this.publicObjectives[1].completed = this.objectivesService.publicBonus[1].completed;
                    this.socketService.socket.emit('public2CompletPlayer1', this.objectivesService.publicBonus[1].points);
                } else {
                    this.objectivesService.pointsCalculatorService.changePoints(this.objectivesService.publicBonus[1].points, 1);
                    this.publicObjectives[1].completed = this.objectivesService.publicBonus[1].completed;
                    this.socketService.socket.emit('public2CompletPlayer2', this.objectivesService.publicBonus[1].points);
                }
            }
        });
    }
}
