import { Injectable } from '@angular/core';
import { Objective } from '@app/interfaces/objective';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';
@Injectable({
    providedIn: 'root',
})
export class Palindrome implements Objective {
    points: number;
    completed: string;
    isCompleted: boolean;
    description: string;
    name: string;
    letters: string[];
    wordToCheck: string;
    letterToStart: string;

    constructor(public gridCoordService: GridCoordinateService) {
        this.points = 30;
        this.completed = '';
        this.isCompleted = false;
        this.description = 'Écrire un palindrome ';
        this.name = 'Palindrome';
    }
    activate(): void {
        this.gridCoordService.currentLetter.subscribe((word) => (this.wordToCheck = word));
    }

    verify(): boolean {
        if (this.isCompleted) return false;
        const value = this.checkPalindrome() && this.wordToCheck.length >= 2;
        this.isCompleted = value;
        if (value) this.completed = 'line-through';
        return value;
    }

    checkPalindrome(): boolean {
        const length = this.wordToCheck.length - 1;
        for (let i = 0; i < (length + 1) / 2; i++) {
            if (this.wordToCheck[i] !== this.wordToCheck[length - i]) return false;
        }
        return true;
    }
}
