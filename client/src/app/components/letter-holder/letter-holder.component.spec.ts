/* /* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Letter } from '@app/letter';
import { LetterHolderComponent } from './letter-holder.component';
import SpyObj = jasmine.SpyObj;

fdescribe('LetterHolderComponent', () => {
    let component: LetterHolderComponent;
    let fixture: ComponentFixture<LetterHolderComponent>;
    let letterSpy: SpyObj<Letter>;

    beforeEach(async () => {
        letterSpy = jasmine.createSpyObj('Letter', ['getLetter', 'getValue']);
        await TestBed.configureTestingModule({
            declarations: [LetterHolderComponent],
            providers: [
                {
                    provide: Letter,
                    useValue: letterSpy,
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LetterHolderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit should initRack', () => {
        component.gameMode.isPlayingSolo = true;
        const spy = spyOn(component.rackService, 'initRack').and.callFake(async () => {
            return new Promise<void>(() => {
                return;
            });
        });
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should subscribe from currentRack and change the rack ', async () => {
        let testRack = [new Letter('a', 1)] as Letter[];
        component.ngOnInit();
        component.rackService.currentRack.subscribe((rack) => {
            testRack = rack;
        });
        component.rackService.changeRack(testRack);

        expect(component.letterRack).toBe(testRack);
    });

    it(' swapLetters should call wheelSwap', () => {
        const wheelEvenMock = {
            deltaY: 1,
        } as WheelEvent;
        jasmine.createSpyObj('wheel', ['preventDefault']);
        const spy = spyOn(component.rackService, 'wheelSwap');
        component.swapLetters(wheelEvenMock);
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    });

    it(' detectPressedKey should call keyboardSelectLetter', () => {
        const keyEvenMock = {
            key: 'a',
        } as KeyboardEvent;
        spyOn(component.rackService, 'isLetter').and.returnValue(true);
        const spy = spyOn(component.rackService, 'keyboardSelectLetter');
        component.detectPressedKey(keyEvenMock);
        expect(spy).toHaveBeenCalled();
    });

    it(' detectPressedKey should call keyboardSwap', () => {
        const keyEvenMock = {
            key: '1',
        } as KeyboardEvent;
        spyOn(component.rackService, 'isLetter').and.returnValue(false);
        const spy = spyOn(component.rackService, 'keyboardSwap');
        component.detectPressedKey(keyEvenMock);
        expect(spy).toHaveBeenCalled();
    });

    it('exchange should call exchangeLetters', () => {
        component.gameMode.isPlayingSolo = true;
        const spy = spyOn(component.rackService, 'exchangeLetters');
        component.exchange();
        expect(spy).toHaveBeenCalled();
    });

    it('exchange should call exchangeLetter and emit a message to server', () => {
        component.gameMode.isPlayingSolo = false;
        component.socketService.isHost = false;
        component.socketService.initializeSocket();
        spyOn(component.socketService.socket, 'emit');
        const spy = spyOn(component.rackService, 'exchangeLetters');
        component.exchange();
        expect(spy).toHaveBeenCalled();
    });

    it('cancelExchange should call cancelExchange', () => {
        const spy = spyOn(component.rackService, 'cancelExchange');
        component.cancelExchange();
        expect(spy).toHaveBeenCalled();
    });

    it('cancelAll should call exchangeLetters', () => {
        const spy = spyOn(component.rackService, 'unselectAll');
        component.cancelAll();
        expect(spy).toHaveBeenCalled();
    });
});
