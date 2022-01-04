import { Score } from '@app/classes/score';
import { VP } from '@app/classes/VP';
import { injectable } from 'inversify';
import { Db, MongoClient, ObjectID } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://admin:admin@cluster0.lehjm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const DATABASE_NAME = 'DB_INF2990';
const DB_COLLECTION_CLASSICAL = 'scores_classique';
const DB_COLLECTION_LOG2990 = 'scores_log2990';
const DB_COLLECTION_JV_D = 'listJV_Debutant';
const DB_COLLECTION_JV_E = 'listJV_Expert';

@injectable()
@Service()
export class DatabaseService {
    score: Score[];
    private db: Db;
    private client: MongoClient;

    /*  private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }; */

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        console.log('start called by db');

        try {
            const client = await MongoClient.connect(url, { useUnifiedTopology: true });
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }

        if ((await this.db.collection(DB_COLLECTION_CLASSICAL).countDocuments()) === 0) {
            console.log('start called by db1');
            await this.populateDBScoresClassique();
        }
        if ((await this.db.collection(DB_COLLECTION_LOG2990).countDocuments()) === 0) {
            console.log('start called by db2');
            await this.populateDBScoresLOG();
        }

        if ((await this.db.collection(DB_COLLECTION_JV_D).countDocuments()) === 0) {
            console.log('start called by db3');
            await this.populateDBVJD();
        }
        if ((await this.db.collection(DB_COLLECTION_JV_E).countDocuments()) === 0) {
            console.log('start called by db4');
            await this.populateDBVJE();
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async populateDBScoresClassique(): Promise<void> {
        const scores: Score[] = [
            {
                playerName: 'Joeur 1',
                score: 0,
            },
            {
                playerName: 'joeur 2',
                score: 0,
            },
            {
                playerName: 'Joeur 3',
                score: 0,
            },
            {
                playerName: 'Joeur 4',
                score: 0,
            },
            {
                playerName: 'Joeur 5',
                score: 0,
            },
        ];

        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const score of scores) {
            await this.db.collection(DB_COLLECTION_CLASSICAL).insertOne(score);
        }
    }
    async populateDBScoresLOG(): Promise<void> {
        const scores: Score[] = [
            {
                playerName: 'Joeur 1',
                score: 0,
            },
            {
                playerName: 'joeur 2',
                score: 0,
            },
            {
                playerName: 'Joeur 3',
                score: 0,
            },
            {
                playerName: 'Joeur 4',
                score: 0,
            },
            {
                playerName: 'Joeur 5',
                score: 0,
            },
        ];

        for (const score of scores) {
            await this.db.collection(DB_COLLECTION_LOG2990).insertOne(score);
        }
    }

    async populateDBVJD(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const VP_player: VP[] = [
            {
                id: new ObjectID(),
                playerName: 'Joeur 1',
                level: 'Debutant',
            },
            {
                id: new ObjectID(),
                playerName: 'Joeur 2',
                level: 'Debutant',
            },
            {
                id: new ObjectID(),
                playerName: 'Joeur 3',
                level: 'Debutant',
            },
        ];
        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const player of VP_player) {
            await this.db.collection(DB_COLLECTION_JV_D).insertOne(player);
        }
    }
    async populateDBVJE(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const VP_player: VP[] = [
            {
                id: new ObjectID(),
                playerName: 'Joeur 1',
                level: 'Expert',
            },
            {
                id: new ObjectID(),
                playerName: 'Joeur 2',
                level: 'Expert',
            },
            {
                id: new ObjectID(),
                playerName: 'Joeur 3',
                level: 'Expert',
            },
        ];
        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const player of VP_player) {
            await this.db.collection(DB_COLLECTION_JV_E).insertOne(player);
        }
    }

    get database(): Db {
        return this.db;
    }
}
