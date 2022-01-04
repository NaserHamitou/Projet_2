import { DictionaryValidatorService } from '@app/services/dictionary-validator.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
const DICTIONARY_PATH = 'app/assets';
@Service()
export class DownloadController {
    router: Router;

    constructor(public dictionaryValidatorService: DictionaryValidatorService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        /**
         * @swagger
         *
         * /download:
         *   get:
         *     summary: Return downloaded dictionary to client.
         *     produces:
         *      - application/json
         *     responses:
         *       200:
         *         description: a json file.
         *         schema:
         *           type: file
         */
        this.router.get('/:id', (req: Request, res: Response) => {
            const file = DICTIONARY_PATH + '/' + this.dictionaryValidatorService.getDictionaryFileName(req.params.id);
            res.download(file);
        });
    }
}
