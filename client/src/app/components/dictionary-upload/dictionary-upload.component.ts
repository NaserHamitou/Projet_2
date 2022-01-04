import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { SocketService } from '@app/services/sockets/socket.service';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

const CHUNK_SIZE = 65536; // 64 * 1024
const MAX_DESCRIPTION_LENGTH = 512;
const MAX_TITLE_LENGTH = 32;
const DEFAULT_DOWNLOAD_FILE_NAME = 'dictionnaire.json';

@Component({
    selector: 'app-dictionary-upload',
    templateUrl: './dictionary-upload.component.html',
    styleUrls: ['./dictionary-upload.component.scss'],
})
export class DictionaryUploadComponent implements OnInit {
    @ViewChild('fileUpload', { read: ElementRef }) fileUpload: ElementRef;
    @ViewChild('dictionariesOptionsElem') dicSel: MatSelectionList;
    @ViewChild('updateOptionsElem') updateSel: MatSelectionList;
    requiredFileType: string = 'application/json';
    map: Map<string, string>;

    selectedOptions: string[];
    updateSelectedOptions: string[];
    updateOptions: string[];

    fileName: string;
    selectedFiles: FileList;

    isUpdateClicked = false;
    newValue = '';

    maxUpdateLength: number;

    readonly baseUrl: string = environment.serverUrl;

    constructor(private socketService: SocketService, private readonly http: HttpClient) {
        this.map = new Map();
        this.selectedOptions = new Array<string>();
        this.updateSelectedOptions = new Array<string>();
        this.updateOptions = new Array<string>();
        this.updateOptions.push('Titre');
        this.updateOptions.push('Description');
    }

    ngOnInit(): void {
        this.socketService.socket.on('fileUploadDone', (error) => {
            this.socketService.socket.emit('info');
            if (error === '') alert('Téléversement terminé');
            else alert('Échec du téléversement: ' + error);
        });
        this.socketService.socket.on('getDictionariesInfo', (map) => {
            this.map.clear();
            new Map<string, string>(map).forEach((value: string, key: string) => {
                this.map.set(key, value);
            });
        });
        this.socketService.socket.on('fileDeleteDone', (error) => {
            this.socketService.socket.emit('info');
            alert(error);
        });
        this.socketService.socket.on('updateDone', (error) => {
            this.socketService.socket.emit('info');
            alert(error);
        });
        this.socketService.socket.emit('info');
    }

    onFileSelected(): void {
        const input: HTMLInputElement = this.fileUpload.nativeElement;
        if (!input.files) return;
        this.selectedFiles = input.files;
        this.fileName = this.selectedFiles[0].name;
    }

    onFileUpload(): void {
        if (!this.selectedFiles) return;

        const firstFile: File = this.selectedFiles[0];
        if (firstFile.type !== this.requiredFileType) {
            alert('Seulement les dictionnaires JSON peuvent être téléversés');
            return;
        }
        const fileSize = firstFile.size;

        this.socketService.socket.emit('uploadStart', fileSize);
        this.chunkReader(0, firstFile);
    }

    deleteDictionary(): void {
        this.socketService.socket.emit('fileDelete', this.selectedOptions[0]);
        this.resetSelectedOptions();
    }

    downloadDictionary(): void {
        this.http
            .get(`${this.baseUrl}/download/` + this.selectedOptions[0], { responseType: 'blob' })
            .toPromise()
            .then((blob) => {
                saveAs(blob, DEFAULT_DOWNLOAD_FILE_NAME);
            });
    }

    confirmUpdate(): void {
        const isTitle = this.updateSelectedOptions[0] === 'Titre';
        this.socketService.socket.emit('updateDictionaryValue', isTitle, this.newValue, this.selectedOptions[0]);
        this.resetSelectedOptions();
    }

    resetSelectedOptions(): void {
        if (this.updateSel !== undefined) {
            this.updateSel.options.forEach((item: MatListOption) => {
                if (item.selected) {
                    item.toggle();
                    this.updateSelectedOptions.length = 0;
                }
            });
        }
        this.dicSel.options.forEach((item: MatListOption) => {
            if (item.selected) {
                item.toggle();
                this.selectedOptions.length = 0;
            }
        });
        this.newValue = '';
        this.isUpdateClicked = false;
    }

    onUpdateOptionChange() {
        if (this.updateSelectedOptions[0] === this.updateOptions[0]) this.maxUpdateLength = MAX_TITLE_LENGTH;
        else this.maxUpdateLength = MAX_DESCRIPTION_LENGTH;
        this.newValue = '';
    }

    checkIfShouldResetOptions() {
        if (this.updateSel !== undefined) {
            this.updateSel.options.forEach((item: MatListOption) => {
                if (item.selected) {
                    item.toggle();
                    this.updateSelectedOptions.length = 0;
                }
            });
        }
        this.newValue = '';
        this.isUpdateClicked = false;
    }

    private chunkReader(offset: number, file: File) {
        if (offset >= file.size) {
            return;
        }
        const fileReader = new FileReader();
        const fileSlice = file.slice(offset, CHUNK_SIZE + offset);
        fileReader.onloadend = () => {
            this.socketService.socket.emit('writeFileChunk', fileReader.result);
            offset += CHUNK_SIZE;
            this.chunkReader(offset, file);
        };
        fileReader.readAsArrayBuffer(fileSlice);
    }
}
