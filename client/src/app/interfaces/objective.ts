export interface Objective {
    points: number;
    completed: string;
    isCompleted: boolean;
    description: string;
    name: string;
    activate(): void;
    verify(): boolean;
}
