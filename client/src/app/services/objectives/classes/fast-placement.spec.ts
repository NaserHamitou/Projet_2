/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { FastPlacement } from './fast-placement';

fdescribe('FastPlacement', () => {
    let service: FastPlacement;

    beforeEach(() => {
        service = TestBed.inject(FastPlacement);
    });

    it('should create an instance', () => {
        expect(service).toBeTruthy();
    });

    it('verify should return false if isCompleted', () => {
        service.isCompleted = true;
        const result = service.verify();
        service.verify();
        expect(result).toBeFalse();
    });

    it('verify should return true if condition is met', () => {
        service.isCompleted = false;
        service.timeLeft = 58;
        const result = service.verify();
        expect(result).toBeTrue();
        expect(service.completed).toBe('line-through');
    });

    it('verify should return false if condition is not met', () => {
        service.isCompleted = false;
        service.timeLeft = 50;
        const result = service.verify();
        expect(result).toBeFalse();
        expect(service.completed).toBe('');
    });

    it('activate should subscribe to the gamestate and receive the time', () => {
        service.activate();
        service.gameStateService.timeLeftChange.next(55);
        expect(service.timeLeft).toBe(55);
    });

    it('activate should subscribe to the gamestate dont change if 60', () => {
        service.activate();
        service.gameStateService.timeLeftChange.next(60);
        expect(service.timeLeft).not.toBe(55);
    });
});
