import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WriteToBoxService {
    write = new EventEmitter<string>();
}
