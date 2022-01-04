import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';

fdescribe('EventService', () => {
    let service: EventService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EventService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
