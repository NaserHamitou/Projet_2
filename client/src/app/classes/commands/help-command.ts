import { Injectable } from '@angular/core';
import { Command } from '@app/interfaces/command';
// import * as  CONSTANTS from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class HelpCommandService implements Command {
    parameter: string;
    positionRow: string;
    positionColumn: string;
    orientation: string;
    letters: string;
    executeCommand(param: string): string {
        const dupe = param;
        const message =
            '-------------------------AIDE-------------------------' +
            '\n' +
            'VOICI LES COMMANDES QUI VOUS SONT DISPONIBLE PENDANT VOTRE TOUR :.' +
            '\n' +
            '1- !debug : vous permet de voir les actions effctuées par votre adversaire en mode solo.' +
            '\n' +
            '2- !passer : pour passer votre tour.' +
            '\n' +
            '3- !placer  <ligne><colonne>(h | v) <mot> : pour placer un mot à partir de la boîte de dialogue.' +
            "La position de la case s'écrit en minuscule. " +
            '\n' +
            'Exemple : !placer h8h jouer ' +
            '\n' +
            '4- !echanger <lettres> : pour échanger les lettres de votre chevalet.' +
            '\n' +
            '5- !reserve: affiche les lettres restantes dans la banque.' +
            '\n' +
            'Cette commande est utilisable à tout moment en mode de débogage' +
            '\n' +
            dupe;

        return message;
    }
}
