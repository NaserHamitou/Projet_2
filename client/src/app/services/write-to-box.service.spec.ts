import { TestBed } from '@angular/core/testing';
import { WriteToBoxService } from './write-to-box.service';

describe('WriteToBoxService', () => {
    let service: WriteToBoxService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WriteToBoxService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
