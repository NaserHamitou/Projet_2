/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { MousePositionService } from './mouse-position.service';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

fdescribe('MousePositionService', () => {
    let service: MousePositionService;
    let ctxStub: CanvasRenderingContext2D;
    const coord: Vec2 = { x: 50, y: 50 };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MousePositionService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.positionContext = ctxStub;
        service.selectContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be created', () => {
        const spy = spyOn(service.selectContext, 'clearRect').and.callFake(() => {});
        service.clearSelectCanvas();
        expect(spy).toHaveBeenCalled();
    });

    it(' mouseHightlight should call clearRect on the canvas', () => {
        const clearRectSpy = spyOn(service.positionContext, 'clearRect').and.callThrough();
        service.mouseHightlight(coord);
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it(' mouseHightlight should call fillRect on the canvas', () => {
        const fillRectSpy = spyOn(service.positionContext, 'fillRect').and.callThrough();
        service.mouseHightlight(coord);
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it(' mouseHightlight should call calculatePosition', () => {
        const calculatePositionSpy = spyOn(service, 'calculatePosition').and.callThrough();
        service.mouseHightlight(coord);
        expect(calculatePositionSpy).toHaveBeenCalled();
    });

    it('calculatePosition should call Math.floor() 2 times', () => {
        const floorSpy = spyOn(Math, 'floor').and.callThrough();
        service.calculatePosition(coord);
        expect(floorSpy).toHaveBeenCalledTimes(2);
    });

    it(' width should return the width of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_WIDTH);
    });

    it(' height should return the height of the grid canvas', () => {
        expect(service.height).toEqual(CANVAS_HEIGHT);
    });

    it(' mouseSelectCase should switch side', () => {
        const side = service.swtchSide;
        service.mouseSelectCase({ x: 200, y: 200 }, 'h', false);
        service.mouseSelectCase({ x: 200, y: 200 }, 'h', false);
        expect(service.swtchSide).toBe(!side);
    });

    it(' mouseSelectCase should not switch side', () => {
        service.swtchSide = false;
        service['previousSelect'] = { x: 200, y: 200 };
        service.mouseSelectCase({ x: 40, y: 40 }, 'h', false);
        expect(service.swtchSide).toBe(false);
    });
});
