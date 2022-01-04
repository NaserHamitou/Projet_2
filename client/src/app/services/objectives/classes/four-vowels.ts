import { Injectable } from '@angular/core';
import { Objective } from '@app/interfaces/objective';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';
@Injectable({
    providedIn: 'root',
})
export class FourVowels implements Objective {
    points: number;
    completed: string;
    isCompleted: boolean;
    description: string;
    name: string;
    wordToCheck: string = 'a';

    constructor(public gridCoordService: GridCoordinateService) {
        this.points = 45;
        this.completed = '';
        this.isCompleted = false;
        this.description = "Écrire un mot d'au moins 4 lettres qui contient 4 voyelles ou plus";
        this.name = 'Un mot, quatre voyelles';
    }
    verify(): boolean {
        if (this.isCompleted || this.wordToCheck.length === 0) return false;
        const minVowels = 4;
        const checkVowel = (this.wordToCheck.match(/[aeiou]/gi) as RegExpMatchArray).length >= minVowels;
        this.isCompleted = checkVowel;
        if (checkVowel) this.completed = 'line-through';
        return checkVowel;
    }
    activate(): void {
        this.gridCoordService.currentLetter.subscribe((word) => (this.wordToCheck = word));
        this.wordToCheck = 'a';
    }
}
