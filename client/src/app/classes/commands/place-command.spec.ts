import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlaceCommand } from './place-command';

fdescribe('PlaceCommand', () => {
    let place: PlaceCommand;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [RouterTestingModule.withRoutes([])] });
        place = TestBed.inject(PlaceCommand);
    });

    it('should create an instance', () => {
        expect(place).toBeTruthy();
    });

    it('executeCommand should  separate the command in 2', () => {
        place.executeCommand('a1v test');
        const param = 'a1v';
        const letter = 'test';
        expect(place.parameter).toBe(param);
        expect(place.letters).toBe(letter);
    });

    it('executeCommand should  return Position errone if position is invalid', () => {
        const expected = 'Position erronée';
        expect(place.executeCommand('z0v test')).toBe(expected);
    });

    it('executeCommand should  return Orientation erronée if orientation is invalid', () => {
        const expected = 'Orientation erronée';
        expect(place.executeCommand('a1x test')).toBe(expected);
    });

    it('executeCommand should  return  if beginningOfGame and not position H8', () => {
        const expected = '';
        place.isGameBegin = true;
        expect(place.executeCommand('a1v test')).toBe(expected);
    });

    it('executeCommand should  return  if beginningOfGame and not position H8', () => {
        const expected = 'Veuillez ne pas inclure de ponctuation';
        place.isGameBegin = true;
        expect(place.executeCommand('a1v !!!')).toBe(expected);
    });

    it('executeCommand should set isGameBegin to true after the first letter were not placed', () => {
        place.gameState.isGameBegin = true;
        place.executeCommand('g9v am');
        expect(place.gameState.isGameBegin).toBe(true);
    });

    it('executeCommand should set isGameBegin to false after the first letter were placed', () => {
        place.gameState.isGameBegin = true;
        place.executeCommand('h8v am');
        expect(place.gameState.isGameBegin).toBe(false);
    });

    it('verifyOrientation should set letters to the right size depending on position and orientation', () => {
        place.isGameBegin = false;
        spyOn(place, 'verifyOrientation').and.callThrough();
        place.executeCommand('h13h test');
        expect(place.letters).toBe('tes');
        place.executeCommand('n8v test');
        expect(place.letters).toBe('te');
    });

    it('executeCommand should return Commande erronée if length of command is > 4 or the second character of command is not a number', () => {
        const superiorTo4 = 'h8eev am';
        const returnValue1 = place.executeCommand(superiorTo4);
        const notANbr = 'hh8v am';
        const returnValue2 = place.executeCommand(notANbr);
        expect(returnValue1).toBe('Commande erronée');
        expect(returnValue2).toBe('Commande erronée');
    });

    it('verifyPosition should set position to the number is finds in parameter', () => {
        place.parameter = 'h8v';
        const returnValue = place.verifyPosition('h');
        expect(place.positionColumn).toBe('8');
        expect(returnValue).toBe(true);
    });
});
