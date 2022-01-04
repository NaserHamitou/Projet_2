import { TestBed } from '@angular/core/testing';
import { CommunicationBoxDataService } from './communication-box-data.service';

describe('CommunicationBoxDataService', () => {
    let service: CommunicationBoxDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommunicationBoxDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
