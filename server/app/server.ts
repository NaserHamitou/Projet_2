import { Application } from '@app/app';
import * as http from 'http';
import { injectable } from 'inversify';
import { AddressInfo } from 'net';
import { Service } from 'typedi';
import { DatabaseService } from './services/database.service';
import { DictionaryValidatorService } from './services/dictionary-validator.service';
import { ScoresService } from './services/scores.service';
import { SocketManager } from './services/socket-manager.service';
import { WordValidator } from './services/word-validator.service';
const readingValue = 10;

@Service()
@injectable()
export class Server {
    private static readonly appPort: string | number | boolean = Server.normalizePort(process.env.PORT || '3000');
    private static readonly baseDix: number = readingValue;
    private server: http.Server;
    private socketManager: SocketManager;

    constructor(
        public wordValid: WordValidator,
        private application: Application,
        public databaseService: DatabaseService,
        public scoresService: ScoresService,
        public dictionaryValidatorService: DictionaryValidatorService,
    ) {}
    private static normalizePort(val: number | string): number | string | boolean {
        const port: number = typeof val === 'string' ? parseInt(val, this.baseDix) : val;
        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }
    async init(): Promise<void> {
        this.application.app.set('port', Server.appPort);

        this.server = http.createServer(this.application.app);
        this.socketManager = new SocketManager(this.server, this.wordValid, this.dictionaryValidatorService, this.scoresService);

        this.socketManager.handleSockets();
        this.server.listen(Server.appPort);

        this.server.on('error', (error: NodeJS.ErrnoException) => this.onError(error));
        this.server.on('listening', () => this.onListening());
        try {
            await this.databaseService.start();
            console.log('Database connection successfull !');
        } catch {
            console.error('Database connection failed !');
            process.exit(1);
        }
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind: string = typeof Server.appPort === 'string' ? 'Pipe ' + Server.appPort : 'Port ' + Server.appPort;
        switch (error.code) {
            case 'EACCES':
                // eslint-disable-next-line no-console
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                // eslint-disable-next-line no-console
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Server listening
     */
    private onListening(): void {
        const addr = this.server.address() as AddressInfo;
        const bind: string = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
        // eslint-disable-next-line no-console
        console.log(`Listening on ${bind}`);
    }
}
