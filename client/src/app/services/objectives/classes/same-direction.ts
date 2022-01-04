import { Objective } from '@app/interfaces/objective';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';
import { ObjectivesService } from '@app/services/objectives/objectives.service';

export class SameDirection implements Objective {
    points: number;
    completed: string;
    isCompleted: boolean;
    description: string;
    name: string;
    currentDirection: string = '';
    previousDirection: string = '';
    directionCounter: number;

    currentDirectionP2: string = '';
    previousDirectionP2: string = '';
    directionCounterP2: number;
    direction: string;

    constructor(public gridCoordService: GridCoordinateService, public objectiveService: ObjectivesService) {
        this.points = 20;
        this.completed = '';
        this.isCompleted = false;
        this.description = 'Écrire un mot dans la même direction, 3x de suite';
        this.name = 'Une direction';
    }
    verify(): boolean {
        if (this.isCompleted) return false;
        let checkDirection = false;
        if (this.objectiveService.whoIsPlayer) checkDirection = this.checkDirection();
        else checkDirection = this.checkDirectionP2();
        this.isCompleted = checkDirection;
        if (checkDirection) this.completed = 'line-through';
        return checkDirection;
    }
    activate(): void {
        this.gridCoordService.currentOrientation.subscribe((dir) => {
            this.direction = dir;
        });
        this.directionCounter = 0;
        this.directionCounterP2 = 0;
        this.previousDirection = this.currentDirection;
        this.previousDirectionP2 = this.currentDirectionP2;
    }

    checkDirection(): boolean {
        this.currentDirection = this.direction;
        if (this.currentDirection === this.previousDirection) this.directionCounter++;
        else {
            this.previousDirection = this.currentDirection;
            this.directionCounter = 1;
        }
        if (this.directionCounter === 3) return true;
        return false;
    }

    checkDirectionP2(): boolean {
        this.currentDirectionP2 = this.direction;
        if (this.currentDirectionP2 === this.previousDirectionP2) this.directionCounterP2++;
        else {
            this.previousDirectionP2 = this.currentDirectionP2;
            this.directionCounterP2 = 1;
        }
        if (this.directionCounterP2 === 3) return true;
        return false;
    }
}
