import * as fs from 'fs';

export class FileInfo {
    fileName: string;
    fileSize: number;
    writer: fs.WriteStream;

    constructor(fileName: string, fileSize: number) {
        this.fileName = fileName;
        this.fileSize = fileSize;
    }
}
