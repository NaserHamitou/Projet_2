import { WordValidator } from '@app/services/word-validator.service';
import { expect } from 'chai';

describe('Example service', () => {
    let wordValidator: WordValidator;

    beforeEach(async () => {
        wordValidator = new WordValidator();
    });

    it('isInDictionary should return true if the word is found in the dictionary', () => {
        const WORD = 'je';
        expect(wordValidator.isInDictionary(WORD, 'Mon dictionnaire')).to.be.equal(true);
    });
    it('isInDictionary should return false if the word is not found in the dictionary', () => {
        const WORD = 'abcd';
        expect(wordValidator.isInDictionary(WORD, 'Mon dictionnaire')).to.be.equal(false);
    });
});
