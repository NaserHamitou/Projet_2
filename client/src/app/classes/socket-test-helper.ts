/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';

type CallbackSignature = (...params: any) => void;

@Injectable({
    providedIn: 'root',
})
export class SocketMock {
    private callbacks = new Map<string, CallbackSignature[]>();
    on(event: string, callback: CallbackSignature): void {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }
        this.callbacks.get(event)?.push(callback);
    }

    emit(event: string, ...params: any): void {
        if (!this.callbacks.has(event)) return;
        for (const callback of this.callbacks.get(event)!) {
            callback(params);
        }
    }
}
