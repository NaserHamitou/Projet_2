import * as data from '@app/assets/dictionnary.json';
import { Service } from 'typedi';

const INVALID_INDEX_VALUE = -1;
const DEFAULT_DICTIONARY_TITLE = 'Mon dictionnaire';
export interface DictionaryData {
    title: string;
    description: string;
    words: string[];
}
@Service()
export class WordValidator {
    dictionaryMap: Map<string, string[]>;
    dataD = data as DictionaryData;

    constructor() {
        this.dictionaryMap = new Map();
        this.dictionaryMap.set(DEFAULT_DICTIONARY_TITLE, this.dataD.words); // Default dictionary
    }

    isInDictionary(wordToCheck: string, dictionaryName: string) {
        // Making sure the word is being recognized whether or not there are capital letters and/or accents (or special characters).
        // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
        const foundWordIndex: number = this.binarySearch(wordToCheck, dictionaryName);
        if (foundWordIndex !== INVALID_INDEX_VALUE) {
            return true;
        }
        return false;
    }
    // source : https://gist.github.com/zzlalani/d3fbc4810089b583d97d7c8f30b52b19
    private binarySearch(wordToCheck: string, dictionaryName: string): number {
        const dictionary = this.dictionaryMap.get(dictionaryName) as string[];
        let start = 0;
        let end: number = dictionary.length - 1;
        let mid: number;
        let index = -1;
        while (start <= end) {
            mid = Math.floor((end + start) / 2);
            if (dictionary[mid] === wordToCheck) {
                index = mid;
                break;
            } else {
                if (dictionary[mid] < wordToCheck) {
                    start = mid + 1;
                } else {
                    end = mid - 1;
                }
            }
        }
        return index;
    }
}
