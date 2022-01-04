import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants';
import { GridService } from '@app/services/grid/grid.service';

fdescribe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;

    const CANVAS_WIDTH = CONSTANTS.DEFAULT_WIDTH;
    const CANVAS_HEIGHT = CONSTANTS.DEFAULT_WIDTH;
    const FONT_SIZE = 10;
    const positionTest: Vec2 = { x: 50, y: 60 };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('generateSpecialCases should randomize if random', () => {
        const spy = spyOn(Math, 'floor');
        service.generateSpecialCases(true);
        expect(spy).toHaveBeenCalled();
    });

    it(' width should return the width of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_WIDTH);
    });

    it(' height should return the height of the grid canvas', () => {
        expect(service.height).toEqual(CANVAS_HEIGHT);
    });

    it(' drawWord should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.drawWord('test');
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it(' drawWord should not call fillText if word is empty', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.drawWord('');
        expect(fillTextSpy).toHaveBeenCalledTimes(0);
    });

    it('should be created', () => {
        const spy = spyOn(Math, 'floor');
        service.generateSpecialCases(false);
        expect(spy).not.toHaveBeenCalled();
    });

    it(' drawWord should call fillText as many times as letters in a word', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const word = 'test';
        service.drawWord(word);
        expect(fillTextSpy).toHaveBeenCalledTimes(word.length);
    });

    it(' drawWord should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawWord('test');
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawGrid should call moveTo and lineTo 16 times', () => {
        const expectedCallTimes = 32;
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        service.drawGrid();
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it(' drawGrid should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawGrid();
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' specialCases should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.specialCases(FONT_SIZE, 0, 0, 'test', 'test', 'rgba(0, 0, 0, 0.7)');
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it(' specialCases should call fillText 2 times', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.specialCases(FONT_SIZE, 0, 0, 'test', 'test', 'rgba(0, 0, 0, 0.7)');
        expect(fillTextSpy).toHaveBeenCalledTimes(2);
    });

    it(' specialCases should call fillRect on the canvas', () => {
        const fillRectSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        service.specialCases(FONT_SIZE, 0, 0, 'test', 'test', 'rgba(0, 0, 0, 0.7)');
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it(' specialCases should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.specialCases(FONT_SIZE, positionTest.x, positionTest.y, 'test', 'test', 'rgba(0, 0, 0, 0.7)');
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawSpecialCases should call specialCases 8 times', () => {
        const specialCasesSpy = spyOn(service, 'specialCases').and.callThrough();
        service.drawSpecialCases(FONT_SIZE);
        const timesCalled = 61;
        expect(specialCasesSpy).toHaveBeenCalledTimes(timesCalled);
    });
});
