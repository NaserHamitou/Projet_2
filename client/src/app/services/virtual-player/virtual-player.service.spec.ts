/* eslint-disable  */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Letter } from '@app/letter';
import { VirtualPlayerService } from '@app/services/virtual-player/virtual-player.service';

fdescribe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;
    let ctxStub: CanvasRenderingContext2D;
    let ctxTempoStub: CanvasRenderingContext2D;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VirtualPlayerService);
        service.pointsCalculatorService.initializeColorGrid();
        ctxStub = CanvasTestHelper.createCanvas(600, 600).getContext('2d') as CanvasRenderingContext2D;
        ctxTempoStub = CanvasTestHelper.createCanvas(600, 600).getContext('2d') as CanvasRenderingContext2D;
        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change the names when the level is changed', () => {
        const newLevel = 'Débutant';
        service.opponentIndex = 0;
        service.changeVPLevel(newLevel);
        expect(service.opponentName).toEqual('Samir');
        expect(service.adversary).toEqual(service.opponentsBasic);
    });
    it('should chave different names for Expert level', () => {
        const newLevel = 'Expert';
        service.opponentIndex = 0;
        service.changeVPLevel(newLevel);
        expect(service.opponentName).toEqual('Elon');
        expect(service.adversary).not.toEqual(service.opponentsBasic);
    });

    it('should not change the name if different ', () => {
        service.opponentIndex = 0;
        service.opponentName = service.opponentsBasic[service.opponentIndex];
        service.playerName = 'bdeuxobea';
        service.getOpponentName();
        expect(service.opponentName).toEqual(service.opponentsBasic[service.opponentIndex]);
    });

    it('should change the name if similar ', () => {
        service.opponentIndex = 0;
        service.opponentName = service.opponentsBasic[service.opponentIndex];
        service.playerName = service.opponentsBasic[service.opponentIndex];
        const changeOpponentIndexSpy = spyOn(service, 'changeOpponentIndex').and.callThrough();
        service.getOpponentName();
        expect(changeOpponentIndexSpy).toHaveBeenCalled();
        expect(service.opponentName).toEqual('Adam');
    });

    it('should reset index if at the end of array ', () => {
        service.opponentIndex = 2;
        service.changeOpponentIndex();
        expect(service.opponentIndex).toEqual(0);
    });

    it('should change index if not at the end of array ', () => {
        service.opponentIndex = 1;
        service.changeOpponentIndex();
        expect(service.opponentIndex).toEqual(2);
    });

    it('should copy rack for the VP', () => {
        const rackToCopy = [
            new Letter('a', 1),
            new Letter('b', 1),
            new Letter('c', 1),
            new Letter('d', 1),
            new Letter('e', 1),
            new Letter('f', 1),
            new Letter('g', 1),
        ];
        const rackTest = service.copyRack(rackToCopy);
        expect(rackTest).toEqual(rackToCopy);
    });

    it('should decode the column of te userInput', () => {
        const testMove = 'h8h hier';
        const returnedValue = service.decodeColumnValue(testMove);
        const returnedDirection = service.decodeDirection(testMove, returnedValue);
        expect(returnedValue).toEqual(8);
        expect(returnedDirection).toEqual('h');
    });

    it('should not decode the column of the userInput if does not contain numbers', () => {
        const testMove = ' hhuith hier';
        const returnedValue = service.decodeColumnValue(testMove);
        const returnedDirection = service.decodeDirection(testMove, returnedValue);
        expect(returnedValue).toEqual(-1);
        expect(returnedDirection).toEqual('');
    });

    it('should update the Rack for the VP', () => {
        service.gameStateService.virtualRack = [
            new Letter('a', 1),
            new Letter('b', 1),
            new Letter('c', 1),
            new Letter('d', 1),
            new Letter('e', 1),
            new Letter('f', 1),
            new Letter('g', 1),
        ];
        service.wordValidatorService.missingLetters = [new Letter('a', 1), new Letter('e', 1)];
        const verifyingRack = [
            new Letter('a', 1),
            new Letter('b', 1),
            new Letter('c', 1),
            new Letter('d', 1),
            new Letter('e', 1),
            new Letter('f', 1),
            new Letter('g', 1),
        ];
        service.updateRack();
        expect(service.gameStateService.virtualRack).not.toEqual(verifyingRack);
    });

    it('should find the letterIndex when the letters are in the word', () => {
        const letter = 'a';
        const word = 'maitre';
        const letIndex = service.findLetterIndex(letter, word);
        expect(letIndex).toEqual(1);
    });

    it('should not find the letterIndex when the letters arent there', () => {
        const letter = 'y';
        const word = 'maitre';
        const letIndex = service.findLetterIndex(letter, word);
        expect(letIndex).toEqual(-1);
    });

    it('should change the names when the level is changed', () => {
        const newLevel = 'Débutant';
        service.adversary = ['Mark', 'Tom', 'John'];
        service.opponentsBasic = ['Samir', 'Adam', 'Yassine'];
        service.opponentIndex = 0;
        service.changeVPLevel(newLevel);
        expect(service.opponentName).toEqual('Samir');
    });

    it(' should detect word and calculate the points for the found words', () => {
        // function findBestPlacement
        let letterD = new Letter('d', 1);
        let letterE = new Letter('e', 1);
        service.letterPlacementService.lettersGrid[7][8] = letterD;
        service.letterPlacementService.lettersGrid[8][8] = letterE;
        service.gameStateService.virtualRack = [new Letter('s', 1)];
        service.placeLetterService.canvasContext = ctxStub;
        service.placeLetterService.tempCanvasContext = ctxTempoStub;

        const detectWordSpy = spyOn(service, 'detectWord').and.callThrough();
        const copyRackdSpy = spyOn(service, 'copyRack').and.callThrough();
        const calculatePointSpy = spyOn(service.pointsCalculatorService, 'calculatePoints').and.callThrough();

        service.findBestPlacements();
        expect(detectWordSpy).toHaveBeenCalled();
        expect(copyRackdSpy).toHaveBeenCalled();
        expect(calculatePointSpy).toHaveBeenCalled();
    });

    it(' should be able to read the words, create new ones and validate all of his options ', () => {
        let letterD = new Letter('d', 1);
        let letterE = new Letter('e', 1);
        service.letterPlacementService.lettersGrid[7][8] = letterD;
        service.letterPlacementService.lettersGrid[8][8] = letterE;
        service.gameStateService.virtualRack = [new Letter('s', 1)];
        service.placeLetterService.canvasContext = ctxStub;
        service.placeLetterService.tempCanvasContext = ctxTempoStub;

        const detectWordSpy = spyOn(service, 'detectWord').and.callThrough();
        const copyRackdSpy = spyOn(service, 'copyRack').and.callThrough();
        const calculatePointSpy = spyOn(service.pointsCalculatorService, 'calculatePoints').and.callThrough();
        const copyGridSpy = spyOn(service.wordValidatorService, 'copyGrid').and.callThrough();

        service.findBestPlacements();
        expect(detectWordSpy).toHaveBeenCalled();
        expect(copyRackdSpy).toHaveBeenCalled();
        expect(copyGridSpy).toHaveBeenCalled();
        expect(calculatePointSpy).toHaveBeenCalled();
    });

    it('should make a different move depending on the level of the VP', () => {
        service.opponentLevel = 'Débutant';
        let letterD = new Letter('d', 1);
        let letterE = new Letter('e', 1);
        service.letterPlacementService.lettersGrid[7][8] = letterD;
        service.letterPlacementService.lettersGrid[8][8] = letterE;
        service.gameStateService.virtualRack = [new Letter('s', 1)];
        spyOn(Math, 'random').and.returnValues(0.05);
        service.possiblePlacements.set('g8v des', 3);
        service.possiblePlacements.set('g8v dessus', 10);
        service.possiblePlacements.set('g8v destitue', 15);
        const returnValue = service.chooseRandomPlay(service.possiblePlacements);
        expect(returnValue).not.toEqual('');
    });

    it('should be able to play the first move if the grid is empty', () => {
        service.possiblePlacements.clear();
        service.gameStateService.virtualRack = [new Letter('a', 1), new Letter('c', 1)];
        spyOn(Math, 'random').and.returnValues(0.74);
        service.findFirstPlacement();
        expect(service.possiblePlacements.get('ca')).not.toEqual(-1);
    });

    it('should be able to play the best move as an Expert', () => {
        service.opponentLevel = 'Expert';
        service.placeLetterService.canvasContext = ctxStub;
        service.placeLetterService.tempCanvasContext = ctxTempoStub;
        service.possiblePlacements.set('g8v des', 3);
        service.possiblePlacements.set('g8v dessus', 10);
        service.possiblePlacements.set('g8v destitue', 15);
        const empty = new Map();
        service.playBestMove();
        expect(service.possiblePlacements).toEqual(empty);
    });

    it('should 198-202', () => {
        service.opponentLevel = 'Débutant';
        let letterD = new Letter('d', 1);
        let letterE = new Letter('e', 1);
        service.letterPlacementService.lettersGrid[7][8] = letterD;
        service.letterPlacementService.lettersGrid[8][8] = letterE;
        service.gameStateService.virtualRack = [new Letter('s', 1)];
        // const chooseRandomSpy = spyOn(service, 'chooseRandomPlay').and.callThrough();
        spyOn(Math, 'random').and.returnValues(0.4);
        service.possiblePlacements.set('g8v des', 3);
        service.possiblePlacements.set('g8v dessus', 10);
        service.possiblePlacements.set('g8v destitue', 15);
        service.placeLetterService.canvasContext = ctxStub;
        service.placeLetterService.tempCanvasContext = ctxTempoStub;

        const chooseRandomPlaySpy = spyOn(service, 'chooseRandomPlay').and.callThrough();
        // const chooseRandomPlaySpy = spyOn(service, 'chooseRandomPlay').and.returnValue('g8v des');
        service.playBestMove();
        expect(chooseRandomPlaySpy).toHaveBeenCalled();
    });

    it('should choose a play within 13 to 18 points for 30% of the time', () => {
        service.opponentLevel = 'Débutant';
        let letterD = new Letter('d', 1);
        let letterE = new Letter('e', 1);
        service.letterPlacementService.lettersGrid[7][8] = letterD;
        service.letterPlacementService.lettersGrid[8][8] = letterE;
        service.gameStateService.virtualRack = [new Letter('s', 1)];
        spyOn(Math, 'random').and.returnValues(0.8);
        service.possiblePlacements.set('g8v des', 3);
        service.possiblePlacements.set('g8v dessus', 10);
        service.possiblePlacements.set('g8v destitue', 15);
        service.placeLetterService.canvasContext = ctxStub;
        service.placeLetterService.tempCanvasContext = ctxTempoStub;
        const chosenWord = service.chooseRandomPlay(service.possiblePlacements);
        expect(chosenWord).toEqual('g8v destitue');
    });

    it('should exchange all the letters in the rack', () => {
        service.gameStateService.virtualRack = [
            new Letter('a', 1),
            new Letter('b', 1),
            new Letter('c', 1),
            new Letter('d', 1),
            new Letter('e', 1),
            new Letter('f', 1),
            new Letter('g', 1),
        ];
        const rackToVerify = [
            new Letter('a', 1),
            new Letter('b', 1),
            new Letter('c', 1),
            new Letter('d', 1),
            new Letter('e', 1),
            new Letter('f', 1),
            new Letter('g', 1),
        ];
        const putBackLetterSpy = spyOn(service.letterBankService, 'putBackLetter').and.callThrough();
        service.exchangeAllLetters();
        expect(service.gameStateService.virtualRack).not.toEqual(rackToVerify);
        expect(putBackLetterSpy).toHaveBeenCalledTimes(7);
    });

    it('should skip turn as a Debutant for 10% of the time', () => {
        service.opponentLevel = 'Débutant';
        spyOn(Math, 'random').and.returnValues(0.02);
        const resetTimerSpy = spyOn(service.gameStateService, 'resetTimer').and.callThrough();
        service.virtualAction();
        expect(resetTimerSpy).toHaveBeenCalled();
    });
    it('should exchange all letters for 10% of the time', () => {
        service.opponentLevel = 'Débutant';
        spyOn(Math, 'random').and.returnValues(0.15);
        const exchangeAllLettersSpy = spyOn(service, 'exchangeAllLetters').and.callThrough();
        service.virtualAction();
        expect(exchangeAllLettersSpy).toHaveBeenCalled();
    });

    it('should play as Debutant for 80% of the time', () => {
        service.opponentLevel = 'Débutant';
        spyOn(Math, 'random').and.returnValues(0.8);
        const virtualPlayingSpy = spyOn(service, 'virtualPlaying').and.callThrough();
        service.virtualAction();
        expect(virtualPlayingSpy).toHaveBeenCalled();
    });

    it('should always play as an Expert', () => {
        service.opponentLevel = 'Expert';
        spyOn(Math, 'random').and.returnValues(0.15);
        const virtualPlayingSpy = spyOn(service, 'virtualPlaying').and.callThrough();
        service.virtualAction();
        expect(virtualPlayingSpy).toHaveBeenCalled();
    });

    it('should write the first 3 moves int he box dialog', () => {
        const getAltMovesSpy = spyOn(service, 'getAltMoves').and.callThrough();
        const writeToBoxSpy = spyOn(service.writeToBoxService.write, 'emit').and.callThrough();
        service.displayAltMoves();
        expect(getAltMovesSpy).toHaveBeenCalled();
        expect(writeToBoxSpy).toHaveBeenCalledTimes(3);
    });

    it('should write the first 3 moves int he box dialog', () => {
        service.possiblePlacements.set('g8v des', 3);
        service.possiblePlacements.set('g8v dessus', 10);
        service.possiblePlacements.set('g8v destitue', 15);
        const sortMoveSpy = spyOn(service, 'sortMoves').and.callThrough();
        const message = service.getAltMoves();
        const preview = [
            'Placement alternatif 0: g8v destitue : 15',
            'Placement alternatif 1: g8v dessus : 10',
            'Placement alternatif 2: g8v des : 3',
        ];
        expect(sortMoveSpy).toHaveBeenCalledTimes(1);
        expect(message).toEqual(preview);
    });
});
