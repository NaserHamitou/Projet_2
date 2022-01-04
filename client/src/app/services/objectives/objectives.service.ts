import { Injectable } from '@angular/core';
import { Objective } from '@app/interfaces/objective';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';
import { LetterPlacementService } from '@app/services/letter-placement.service';
import { PointsCalculatorService } from '@app/services/points-calculator.service';
import { RackService } from '@app/services/rack/rack.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FastPlacement } from './classes/fast-placement';
import { FirstLetter } from './classes/first-letter';
import { FourCorners } from './classes/four-corners';
import { FourVowels } from './classes/four-vowels';
import { LongerSeven } from './classes/longer-seven';
import { NoExchange } from './classes/no-exchange';
import { Palindrome } from './classes/palindrome';
import { SameDirection } from './classes/same-direction';
enum Mode {
    Classique,
    Log2990,
}
@Injectable({
    providedIn: 'root',
})
export class ObjectivesService {
    objectivesList: Objective[] = [];
    publicBonus: Objective[] = [];
    privateBonus: Objective;
    secondPlayerBonus: Objective;
    whoIsPlayer: boolean;

    currentPlay: Observable<boolean>;
    currentCompleted: Observable<void>;
    private isPlayValid = new BehaviorSubject<boolean>(false);

    constructor(
        public pointsCalculatorService: PointsCalculatorService,
        public placement: LetterPlacementService,
        public gridService: GridCoordinateService,
        public gameState: GameStateService,
        public rackService: RackService,
        public socketService: SocketService,
        public gameMode: GameModeService,
    ) {
        this.currentPlay = this.isPlayValid.asObservable();
        this.init();
    }

    init() {
        if ((this.socketService.isHost || this.gameMode.isPlayingSolo) && this.gameMode.gameMode === Mode.Log2990) this.createAllObjectives();
    }

    pickPrivateObjective() {
        const index = Math.floor(Math.random() * this.objectivesList.length);
        this.privateBonus = this.objectivesList.splice(index, 1)[0];
        this.privateBonus.activate();
    }

    pickSecondPrivate() {
        const index = Math.floor(Math.random() * this.objectivesList.length);
        this.secondPlayerBonus = this.objectivesList.splice(index, 1)[0];
        this.secondPlayerBonus.activate();
    }

    pickPublicObjectives() {
        let index = Math.floor(Math.random() * this.objectivesList.length);
        this.publicBonus.push(this.objectivesList.splice(index, 1)[0]);
        index = Math.floor(Math.random() * this.objectivesList.length);
        this.publicBonus.push(this.objectivesList.splice(index, 1)[0]);
        this.publicBonus[0].activate();
        this.publicBonus[1].activate();
    }

    setIsPlayValid(valid: boolean) {
        this.whoIsPlayer = valid;
        if (valid) this.rackService.noExchangeCounter++;
        if (!valid) this.rackService.noExchangeP2++;
        this.isPlayValid.next(valid);
    }

    createAllObjectives() {
        this.objectivesList.push(new FirstLetter(this.gridService));
        this.objectivesList.push(new Palindrome(this.gridService));
        this.objectivesList.push(new FastPlacement(this.gridService, this.gameState));
        this.objectivesList.push(new LongerSeven(this.gridService));
        this.objectivesList.push(new NoExchange(this.rackService, this.gameState));
        this.objectivesList.push(new FourVowels(this.gridService));
        this.objectivesList.push(new SameDirection(this.gridService, this));
        this.objectivesList.push(new FourCorners(this.placement));
    }
}
