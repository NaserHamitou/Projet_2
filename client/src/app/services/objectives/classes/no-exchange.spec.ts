import { TestBed } from '@angular/core/testing';
import { NoExchange } from './no-exchange';

fdescribe('NoExchange', () => {
    let bonusClass: NoExchange;

    beforeEach(() => {
        bonusClass = TestBed.inject(NoExchange);
    });

    it('should create an instance', () => {
        expect(bonusClass).toBeTruthy();
    });

    it('verify should return false if is completed', () => {
        bonusClass.isCompleted = true;
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });

    it('verify should return true if condition is met', () => {
        bonusClass.isCompleted = false;
        bonusClass.rackService.noExchangeCounter = 3;
        const res = bonusClass.verify();
        expect(res).toBeTrue();
    });

    it('verify should return true if second condition is met', () => {
        bonusClass.isCompleted = false;
        bonusClass.rackService.noExchangeP2 = 3;
        const res = bonusClass.verify();
        expect(res).toBeTrue();
    });

    it('verify should return false if condition is not met', () => {
        bonusClass.isCompleted = false;
        bonusClass.rackService.noExchangeCounter = 0;
        bonusClass.rackService.noExchangeP2 = 0;
        const res = bonusClass.verify();
        expect(res).toBeFalse();
    });

    it('should create an instance', () => {
        bonusClass.activate();
        expect(bonusClass.rackService.noExchangeCounter).toBe(0);
    });
});
