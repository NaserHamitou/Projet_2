import { TestBed } from '@angular/core/testing';
import { GameModeService } from '@app/services/game-mode/game-mode.service';
import { GameStateService } from '@app/services/game-state/game-state.service';
import { GridCoordinateService } from '@app/services/grid-coordinate/grid-coordinate.service';
import { LetterPlacementService } from '@app/services/letter-placement.service';
import { ObjectivesService } from '@app/services/objectives/objectives.service';
import { PointsCalculatorService } from '@app/services/points-calculator.service';
import { RackService } from '@app/services/rack/rack.service';
import { SocketService } from '@app/services/sockets/socket.service';
import { SameDirection } from './same-direction';

fdescribe('Palindrome', () => {
    let bonusClass: SameDirection;
    let gridCoord: GridCoordinateService;
    let objectivService: ObjectivesService;
    let pointCalc: PointsCalculatorService;
    let placementServ: LetterPlacementService;
    let gridServ: GridCoordinateService;
    let gameState: GameStateService;
    let rack: RackService;
    let gameMode: GameModeService;
    let socket: SocketService;

    beforeEach(() => {
        gameMode = new GameModeService();
        socket = new SocketService(gameMode);
        gridCoord = new GridCoordinateService();
        objectivService = new ObjectivesService(pointCalc, placementServ, gridServ, gameState, rack, socket, gameMode);
        TestBed.configureTestingModule({});
        bonusClass = new SameDirection(gridCoord, objectivService);
    });

    it('should create an instance', () => {
        expect(bonusClass).toBeTruthy();
    });

    it('activate should receive direction', () => {
        bonusClass.activate();
        bonusClass.gridCoordService.changeOrientation('v');
        expect(bonusClass.direction).toBe('v');
    });

    it('verify should return false if is completed', () => {
        bonusClass.isCompleted = true;
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });

    it('verify should return true if condition is met', () => {
        bonusClass.isCompleted = false;
        bonusClass.objectiveService.whoIsPlayer = true;
        spyOn(bonusClass, 'checkDirection').and.returnValue(true);
        const res = bonusClass.verify();
        expect(res).toBeTrue();
    });

    it('verify should return true if condition is not met', () => {
        bonusClass.isCompleted = false;
        bonusClass.objectiveService.whoIsPlayer = true;
        spyOn(bonusClass, 'checkDirection').and.returnValue(false);
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });

    it('verify should return true if second condition is met', () => {
        bonusClass.isCompleted = false;
        bonusClass.objectiveService.whoIsPlayer = false;
        spyOn(bonusClass, 'checkDirectionP2').and.returnValue(true);
        const res = bonusClass.verify();
        expect(res).toBeTrue();
    });

    it('verify should return true if second condition is not met', () => {
        bonusClass.isCompleted = false;
        bonusClass.objectiveService.whoIsPlayer = false;
        spyOn(bonusClass, 'checkDirectionP2').and.returnValue(false);
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });

    it('checkDirection should return true if condition is met', () => {
        bonusClass.previousDirection = 'v';
        bonusClass.direction = 'v';
        bonusClass.directionCounter = 2;
        const res = bonusClass.checkDirection();
        expect(res).toBeTrue();
    });

    it('checkDirection should return true if condition is not met', () => {
        bonusClass.previousDirection = 'v';
        bonusClass.direction = 'h';
        bonusClass.directionCounter = 2;
        const res = bonusClass.checkDirection();
        expect(res).toBeFalse();
    });

    it('checkDirectionP2 should return true if condition is met', () => {
        bonusClass.previousDirectionP2 = 'v';
        bonusClass.direction = 'v';
        bonusClass.directionCounterP2 = 2;
        const res = bonusClass.checkDirectionP2();
        expect(res).toBeTrue();
    });

    it('checkDirectionP2 should return true if condition is not met', () => {
        bonusClass.previousDirectionP2 = 'v';
        bonusClass.direction = 'h';
        bonusClass.directionCounterP2 = 2;
        const res = bonusClass.checkDirectionP2();
        expect(res).toBeFalse();
    });
});
