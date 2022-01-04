import Ajv, { JSONSchemaType } from 'ajv';
import * as fs from 'fs';
import { Service } from 'typedi';
import { DictionaryData } from './word-validator.service';

const RANDOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const FILE_NAME_LENGTH = 10;
const MIN_LENGTH = 4;
const MAX_TITLE_LENGTH = 32;
const MAX_DESCRIPTION_LENGTH = 512;
const DICTIONARY_PATH = 'app/assets';
const DEFAULT_DICTIONARY_TITLE = 'Mon dictionnaire';
const DEFAULT_DICTIONARY_FILE_NAME = 'dictionnary.json';

@Service()
export class DictionaryValidatorService {
    dictionaryList: Map<string, string> = new Map();

    schema: JSONSchemaType<DictionaryData> = {
        type: 'object',
        properties: {
            title: { type: 'string', minLength: MIN_LENGTH, maxLength: MAX_TITLE_LENGTH },
            description: { type: 'string', minLength: MIN_LENGTH, maxLength: MAX_DESCRIPTION_LENGTH },
            words: { type: 'array', items: { type: 'string' }, minItems: 1 },
        },
        required: ['title', 'description', 'words'],
        additionalProperties: false,
    };

    constructor() {
        this.initializeMap();
    }

    getRandomFileName(): string {
        let result = '';
        let nameIsValid = false;
        while (!nameIsValid) {
            result = '';
            for (let i = 0; i < FILE_NAME_LENGTH; i++) {
                result += RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length));
            }
            result += '.json';
            nameIsValid = true;
            this.dictionaryList.forEach((value: string, key: string) => {
                if (key === result) nameIsValid = false;
            });
        }
        return result;
    }

    checkValidity(fileName: string): string {
        let result = '';
        const dataU = fs.readFileSync(DICTIONARY_PATH + '/' + fileName) as unknown;
        const ajv = new Ajv();
        const validate = ajv.compile(this.schema);

        try {
            const dataD = JSON.parse(dataU as string) as DictionaryData;
            const title = dataD.title;
            if (!validate(dataD)) result = 'Structure du dictionnaire erronée';
            else {
                this.dictionaryList.forEach((value: string, key: string) => {
                    if (key === title) result = 'Le titre du dictionnaire existe déjà';
                });
            }
            if (result === '') {
                this.dictionaryList.set(title, fileName);
                return result;
            }
        } catch (e) {
            result = 'Erreur dans la syntaxe du dictionnaire';
        }
        fs.unlinkSync(DICTIONARY_PATH + '/' + fileName);
        return result;
    }

    sendDictionaryList(): Map<string, string> {
        const dictionaryInfoMap: Map<string, string> = new Map();
        this.dictionaryList.forEach((value: string, key: string) => {
            const dataU = fs.readFileSync(DICTIONARY_PATH + '/' + value) as unknown;
            const dataD = JSON.parse(dataU as string) as DictionaryData;
            dictionaryInfoMap.set(key, dataD.description);
        });
        return dictionaryInfoMap;
    }

    deleteDictionary(title: string): string {
        let error = 'Vous ne pouvez pas supprimer le dictionnaire par défaut';
        if (title !== DEFAULT_DICTIONARY_TITLE) {
            this.dictionaryList.forEach((value: string, key: string) => {
                if (key === title) {
                    fs.unlinkSync(DICTIONARY_PATH + '/' + value);
                    this.dictionaryList.delete(key);
                    error = 'dictionnaire ' + '"' + title + '"' + ' supprimé';
                }
            });
        }
        return error;
    }

    getDictionaryFileName(title: string): string {
        let fileName = '';
        this.dictionaryList.forEach((value: string, key: string) => {
            if (key === title) {
                fileName = value;
            }
        });
        return fileName;
    }

    titleExists(title: string): boolean {
        let exists = false;
        this.dictionaryList.forEach((value: string, key: string) => {
            if (key === title) {
                exists = true;
            }
        });
        return exists;
    }

    updateDictionary(isTitle: string, newValue: string, title: string): string {
        const lengthError = 'Longueur du titre ou de la description invalide';
        const fileName = this.getDictionaryFileName(title);

        if (fileName === DEFAULT_DICTIONARY_FILE_NAME) return 'Vous ne pouvez pas modifier le dictionnaire par défaut';

        const dataU = fs.readFileSync(DICTIONARY_PATH + '/' + fileName) as unknown;
        const dataD = JSON.parse(dataU as string) as DictionaryData;

        if (newValue.length < MIN_LENGTH) return lengthError;
        if (isTitle) {
            if (newValue.length > MAX_TITLE_LENGTH) return lengthError;
            if (this.titleExists(newValue)) return 'Titre existe déjà';
            dataD.title = newValue;
            this.dictionaryList.delete(title);
            this.dictionaryList.set(newValue, fileName);
        } else {
            if (newValue.length > MAX_DESCRIPTION_LENGTH) return lengthError;
            dataD.description = newValue;
        }
        fs.writeFileSync(DICTIONARY_PATH + '/' + fileName, JSON.stringify(dataD));
        return 'Modification réussi';
    }

    resetDictionaries(): void {
        this.dictionaryList.forEach((value: string, key: string) => {
            if (key !== DEFAULT_DICTIONARY_TITLE) {
                fs.unlinkSync(DICTIONARY_PATH + '/' + value);
                this.dictionaryList.delete(key);
            }
        });
    }

    getDictionaryWords(name: string): string[] | null {
        let fileName = '';
        this.dictionaryList.forEach((value: string, key: string) => {
            if (key === name) {
                fileName = value;
            }
        });
        if (fileName === '') return null;
        const dataU = fs.readFileSync(DICTIONARY_PATH + '/' + fileName) as unknown;
        const dataD = JSON.parse(dataU as string) as DictionaryData;
        return dataD.words;
    }

    private initializeMap(): void {
        fs.readdir(DICTIONARY_PATH, (err, files) => {
            files.forEach((fileName) => {
                if (err) throw err;
                fs.readFile(DICTIONARY_PATH + '/' + fileName, (error, data) => {
                    if (error) throw error;
                    const dataU = data as unknown;
                    const dataD = JSON.parse(dataU as string) as DictionaryData;
                    this.dictionaryList.set(dataD.title, fileName);
                });
            });
        });
    }
}
