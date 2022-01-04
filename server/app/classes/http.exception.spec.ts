import { expect } from 'chai';
import { describe } from 'mocha';
import { HttpException } from './http.exception';

describe('HttpException', () => {
    it('should create a simple HTTPException', () => {
        const createdMessage = 'Score created successfuly';
        const httpException: HttpException = new HttpException(200, createdMessage);

        expect(httpException.message).to.equals(createdMessage);
    });
});
