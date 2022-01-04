import { Injectable } from '@angular/core';
import { Objective } from '@app/interfaces/objective';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { RackService } from '@app/services/rack/rack.service';
@Injectable({
    providedIn: 'root',
})
export class NoExchange implements Objective {
    points: number;
    completed: string;
    isCompleted: boolean;
    description: string;
    name: string;

    constructor(public rackService: RackService, public gameState: GameStateService) {
        this.points = 30;
        this.completed = '';
        this.isCompleted = false;
        this.description = 'Jouer trois mots de suite sans échanger aucune lettre';
        this.name = 'Aucun échange';
    }
    verify(): boolean {
        if (this.isCompleted) return false;
        const value = this.rackService.noExchangeCounter === 3 || this.rackService.noExchangeP2 === 3;
        this.isCompleted = value;
        if (value) this.completed = 'line-through';
        return value;
    }
    activate(): void {
        this.rackService.noExchangeCounter = 0;
    }
}
