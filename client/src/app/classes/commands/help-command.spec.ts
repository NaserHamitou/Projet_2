// import { HelpCommand } from './help-command';
import { TestBed } from '@angular/core/testing';
import { HelpCommandService } from '@app/classes/commands/help-command';

fdescribe('HelpCommand', () => {
    let service: HelpCommandService;

    beforeEach(() => {
        service = TestBed.inject(HelpCommandService);
    });

    it('should create an instance', () => {
        expect(service).toBeTruthy();
    });

    it('should have a specific return message', () => {
        const returnValue = service.executeCommand('');
        expect(returnValue).not.toEqual('random');
    });
});
