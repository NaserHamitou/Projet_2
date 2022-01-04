import { Injectable } from '@angular/core';
import { Objective } from '@app/interfaces/objective';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';

@Injectable({
    providedIn: 'root',
})
export class FastPlacement implements Objective {
    points: number;
    completed: string;
    isCompleted: boolean;
    description: string;
    name: string;
    timeLeft: number;

    constructor(public gridCoordService: GridCoordinateService, public gameStateService: GameStateService) {
        this.points = 10;
        this.completed = '';
        this.isCompleted = false;
        this.description = 'Jouer un mot en bas de 5 secondes';
        this.name = 'Placement rapide';
    }
    verify(): boolean {
        if (this.isCompleted) return false;
        const minimumTimeLeft = 55;
        const value = this.timeLeft >= minimumTimeLeft;
        this.isCompleted = value;
        if (value) this.completed = 'line-through';
        return value;
    }
    activate(): void {
        const resetTime = 60;
        this.gameStateService.timeLeftChange.subscribe((time) => {
            if (time !== resetTime) this.timeLeft = time;
        });
    }
}
