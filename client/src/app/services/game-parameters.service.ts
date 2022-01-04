import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GameParametersService {
    isRandomBonus: boolean = false;
    dictionaryName: string = 'Mon dictionnaire';
}
