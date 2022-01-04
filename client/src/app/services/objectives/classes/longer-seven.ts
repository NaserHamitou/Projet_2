import { Injectable } from '@angular/core';
import { Objective } from '@app/interfaces/objective';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';
@Injectable({
    providedIn: 'root',
})
export class LongerSeven implements Objective {
    points: number;
    completed: string;
    isCompleted: boolean;
    description: string;
    name: string;
    wordToCheck: string;

    constructor(public gridCoordService: GridCoordinateService) {
        this.points = 25;
        this.completed = '';
        this.isCompleted = false;
        this.description = 'Écrire un mot qui contient plus de 7 lettres';
        this.name = 'Plus que 7';
    }
    verify(): boolean {
        if (this.isCompleted) return false;
        const minWordLength = 7;
        const value = this.wordToCheck.length > minWordLength;
        this.isCompleted = value;
        if (value) this.completed = 'line-through';
        return value;
    }
    activate(): void {
        this.gridCoordService.currentLetter.subscribe((word) => (this.wordToCheck = word));
    }
}
