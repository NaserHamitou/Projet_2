import { Injectable } from '@angular/core';
import { Objective } from '@app/interfaces/objective';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';

@Injectable({
    providedIn: 'root',
})
export class FirstLetter implements Objective {
    points: number;
    completed: string;
    isCompleted: boolean;
    description: string;
    name: string;
    letters: string[];
    wordToCheck: string;
    letterToStart: string;

    constructor(public gridCoordService: GridCoordinateService) {
        this.points = 35;
        this.completed = '';
        this.isCompleted = false;
        this.description = 'Écrire un mot qui commence par la lettre ';
        this.name = 'Première lettre';
        this.letters = ['q', 'w', 'k', 'z'];
    }
    activate(): void {
        this.gridCoordService.currentLetter.subscribe((word) => (this.wordToCheck = word));
        this.letterToStart = this.letters[Math.floor(Math.random() * this.letters.length)];
        this.description += this.letterToStart;
    }

    verify(): boolean {
        if (this.isCompleted) return false;
        const value = this.wordToCheck[0] === this.letterToStart;
        this.isCompleted = value;
        if (value) this.completed = 'line-through';
        return value;
    }
}
