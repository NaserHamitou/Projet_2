/* eslint-disable dot-notation */ // Disabled to allow spying on service functions
import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { GridCoordinateService } from './grid-coordinate.service';

fdescribe('GridCoordinateService', () => {
    let service: GridCoordinateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridCoordinateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('findColumAndRow should return the position ', () => {
        const pos = service.findColumAndRow({ x: 40, y: 40 });
        expect(pos).toEqual({ x: 'b', y: '2' });
    });

    it('findPosition should return the correct position', () => {
        const coordTest: Vec2 = service.findPosition('a', 1);
        expect(coordTest).toEqual({ x: 0, y: 0 });
    });

    it('findPosition should call the map getter', () => {
        const spy = spyOn(service.map, 'get').and.callThrough();
        service.findPosition('a', 1);
        expect(spy).toHaveBeenCalled();
    });

    it('changePosRow should call the next function on subject', () => {
        const spy = spyOn(service['posRow'], 'next').and.callThrough();
        service.changePosRow('a');
        expect(spy).toHaveBeenCalled();
    });

    it('changePosCol should call the next function on subject', () => {
        const spy = spyOn(service['posCol'], 'next').and.callThrough();
        service.changePosCol('1');
        expect(spy).toHaveBeenCalled();
    });

    it('changeLetter should call the next function on subject', () => {
        const spy = spyOn(service['letter'], 'next').and.callThrough();
        service.changeLetter('t');
        expect(spy).toHaveBeenCalled();
    });

    it('changeOrientation should call the next function on subject', () => {
        const spy = spyOn(service['orientation'], 'next').and.callThrough();
        service.changeOrientation('v');
        expect(spy).toHaveBeenCalled();
    });
});
