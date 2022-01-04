/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ObjectivesService } from './objectives.service';

fdescribe('ObjectivesService', () => {
    let service: ObjectivesService;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [RouterTestingModule.withRoutes([])] });
        service = TestBed.inject(ObjectivesService);
        service.createAllObjectives();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('pickPrivateObjective should pick a private objective', () => {
        service.pickPrivateObjective();
        expect(service.privateBonus).toBeTruthy();
    });

    it('pickSecondPrivate should pick a private objective', () => {
        service.pickSecondPrivate();
        expect(service.secondPlayerBonus).toBeTruthy();
    });

    it('pickSecondPrivate should pick a private objective', () => {
        service.pickPublicObjectives();
        expect(service.publicBonus[0]).toBeTruthy();
        expect(service.publicBonus[1]).toBeTruthy();
    });

    it('setIsPlayValid should set the player who is player', () => {
        service.setIsPlayValid(true);
        expect(service.whoIsPlayer).toBe(true);
        expect(service.rackService.noExchangeCounter).toBe(1);
    });

    it('setIsPlayValid should set the second player', () => {
        service.setIsPlayValid(false);
        expect(service.whoIsPlayer).toBe(false);
        expect(service.rackService.noExchangeP2).toBe(1);
    });

    it('init should initiate objective if mode LOG2990', () => {
        service.gameMode.gameMode = 1;
        service.gameMode.isPlayingSolo = true;
        const spy = spyOn(service, 'createAllObjectives').and.callFake(() => {});
        service.init();
        expect(spy).toHaveBeenCalled();
    });
});
