import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EventService {
    currentMessage: Observable<string>;

    private subject = new Subject<unknown>();

    sendClickEvent() {
        this.subject.next();
    }

    getClickEvent(): Observable<unknown> {
        return this.subject.asObservable();
    }
}
