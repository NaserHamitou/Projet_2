import { Injectable } from '@angular/core';
import { Objective } from '@app/interfaces/objective';
import { LetterPlacementService } from '@app/services/letter-placement.service';

@Injectable({
    providedIn: 'root',
})
export class FourCorners implements Objective {
    points: number;
    completed: string;
    isCompleted: boolean;
    description: string;
    name: string;

    constructor(public letterPlacementService: LetterPlacementService) {
        this.points = 30;
        this.completed = '';
        this.isCompleted = false;
        this.description = "Placer au moins une lettre dans l'un des coins du plateau";
        this.name = 'Les quatres coins';
    }
    verify(): boolean {
        if (this.isCompleted) return false;
        const isCornerTouched = this.checkBoard();
        this.isCompleted = isCornerTouched;
        if (isCornerTouched) this.completed = 'line-through';
        return isCornerTouched;
    }

    checkBoard(): boolean {
        if (this.letterPlacementService.getGrid()[1][1] != null) return true;
        if (this.letterPlacementService.getGrid()[15][1] != null) return true;
        if (this.letterPlacementService.getGrid()[1][15] != null) return true;
        if (this.letterPlacementService.getGrid()[15][15] != null) return true;
        return false;
    }

    activate(): void {
        this.isCompleted = false;
    }
}
