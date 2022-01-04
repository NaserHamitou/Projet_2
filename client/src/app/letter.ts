export class Letter {
    letter: string;
    value: number;
    isSelected = false;
    isSelectedExchange = false;

    constructor(letter: string, value: number) {
        this.letter = letter;
        this.value = value;
    }

    getLetter() {
        return this.letter;
    }
    getValue() {
        return this.value;
    }
}
