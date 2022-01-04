import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SocketMock } from '@app/classes/socket-test-helper';
import { SocketService } from '@app/services/sockets/socket.service';
import { DictionaryUploadComponent } from './dictionary-upload.component';

fdescribe('DictionaryUploadComponent', () => {
    let component: DictionaryUploadComponent;
    let fixture: ComponentFixture<DictionaryUploadComponent>;
    let socketMock: SocketMock;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        socketMock = new SocketMock();
        const socketService = jasmine.createSpyObj('SocketService', ['initializeSocket'], { isHost: true, socket: socketMock });
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, MatListModule, MatIconModule],
            declarations: [DictionaryUploadComponent],
            providers: [{ provide: SocketService, useValue: socketService }],
        }).compileComponents();

        httpMock = TestBed.inject(HttpTestingController);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DictionaryUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should request info when update, delete or upload is done', () => {
        let infoEmittedCounter = 0;
        socketMock.on('info', () => {
            infoEmittedCounter++;
        });
        socketMock.emit('fileDeleteDone', '');
        socketMock.emit('updateDone', '');
        socketMock.emit('fileUploadDone', '');
        expect(infoEmittedCounter).toEqual(3);
    });

    it('should emit updateDictionaryValue with correct arguments when update is confirmed', () => {
        let isDataCorrect = false;
        socketMock.on('updateDictionaryValue', (values: (string | boolean)[]) => {
            const isTitle = values[0];
            const newValue = values[1];
            const dictionaryName = values[2];
            if (isTitle === true && newValue === 'newTitle' && dictionaryName === 'currentTitle') isDataCorrect = true;
        });
        component.updateSelectedOptions.push('Titre');
        component.newValue = 'newTitle';
        component.selectedOptions.push('currentTitle');
        component.confirmUpdate();
        expect(isDataCorrect).toBeTrue();
    });

    it('should clear old dictionaries info after receiving new info', () => {
        spyOn(component.map, 'clear');
        socketMock.emit('getDictionariesInfo');
        expect(component.map.clear).toHaveBeenCalled();
    });

    it('should assign the name of the selected file to component.fileName ', () => {
        const input: HTMLInputElement = component.fileUpload.nativeElement;
        // Mock File with file name : dictionary.json
        Object.defineProperty(input, 'files', {
            value: [{ name: 'dictionary.json' }],
            writable: false,
        });
        component.onFileSelected();
        expect(component.fileName).toEqual('dictionary.json');
    });

    it('should call onFileSelected when a new file is selected', () => {
        const input: HTMLInputElement = component.fileUpload.nativeElement;
        spyOn(component, 'onFileSelected');
        input.dispatchEvent(new Event('change'));
        expect(component.onFileSelected).toHaveBeenCalled();
    });

    it('should cancel upload if the file type is not json', () => {
        const input: HTMLInputElement = component.fileUpload.nativeElement;
        // Mock File with file name : dictionary.json
        Object.defineProperty(input, 'files', {
            value: [{ name: 'dictionary.json', type: 'fakeType' }],
            writable: false,
        });
        spyOn(window, 'alert');
        component.onFileSelected();
        component.onFileUpload();
        expect(window.alert).toHaveBeenCalledWith('Seulement les dictionnaires JSON peuvent être téléversés');
    });

    it('should start upload if correct file type', () => {
        const input: HTMLInputElement = component.fileUpload.nativeElement;
        // Mock File with file name : dictionary.json
        Object.defineProperty(input, 'files', {
            value: [{ name: 'dictionary.json', type: 'application/json', size: 0 }],
            writable: false,
        });
        let isUploadStart = false;
        socketMock.on('uploadStart', () => {
            isUploadStart = true;
        });
        component.onFileSelected();
        component.onFileUpload();
        expect(isUploadStart).toBeTrue();
    });

    it('should emit fileDelete upon deleting a dictionary', () => {
        let isEmitted = false;
        socketMock.on('fileDelete', () => {
            isEmitted = true;
        });
        component.deleteDictionary();
        expect(isEmitted).toBeTrue();
    });

    it('should http GET file when downloadDictionary is called', async () => {
        component.selectedOptions.push('dictionaryName');
        component.downloadDictionary();
        httpMock.expectOne(`${component.baseUrl}/download/` + component.selectedOptions[0]);
    });
});
