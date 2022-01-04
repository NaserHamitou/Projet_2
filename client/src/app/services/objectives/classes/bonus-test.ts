import { Objective } from '@app/interfaces/objective';

export class BonusTest implements Objective {
    points: number;
    completed: string;
    isCompleted: boolean;
    description: string;
    name: string;

    constructor() {
        this.points = 10;
        this.completed = '';
        this.isCompleted = false;
        this.description = 'Le joueur doit ...';
        this.name = 'Nom du bonus';
    }
    verify(): boolean {
        /* MOCK */
        return false;
    }
    activate(): void {
        // this.completed = 'line-through';
        this.isCompleted = false;
        // do something
    }
}
