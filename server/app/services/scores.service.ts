import { Score } from '@app/classes/score';
import { VP } from '@app/classes/VP';
import types from '@app/types';
import { inject, injectable } from 'inversify';
import { Collection, FilterQuery, FindAndModifyWriteOpResultObject, ObjectId, ObjectID, UpdateQuery } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { DatabaseService } from './database.service';

const DB_COLLECTION_CLASSIQUE = 'scores_classique';
const DB_COLLECTION_LOG2990 = 'scores_log2990';
const DB_COLLECTION_JVD = 'listJV_Debutant';
const DB_COLLECTION_JVE = 'listJV_Expert';

@injectable()
@Service()
export class ScoresService {
    scoreCla = {} as Score;
    scoreClassique: Score[];
    scoreLOG2990: Score[];
    // eslint-disable-next-line @typescript-eslint/naming-convention
    JV_Debutant: VP[];
    // eslint-disable-next-line @typescript-eslint/naming-convention
    JV_Expert: VP[];

    getHightScoreQuerry = [
        {
            $group: {
                _id: '$score',
                docs: {
                    $addToSet: '$$CURRENT',
                },
            },
        },
        {
            $sort: {
                _id: -1,
            },
        },
        {
            $limit: 5,
        },
    ];

    constructor(@inject(types.DatabaseService) private databaseService: DatabaseService) {}

    get collectionClassique(): Collection<Score> {
        return this.databaseService.database.collection(DB_COLLECTION_CLASSIQUE);
    }

    get collectionLOG2990(): Collection<Score> {
        return this.databaseService.database.collection(DB_COLLECTION_LOG2990);
    }

    get collectionJVD(): Collection<VP> {
        return this.databaseService.database.collection(DB_COLLECTION_JVD);
    }

    get collectionJVE(): Collection<VP> {
        return this.databaseService.database.collection(DB_COLLECTION_JVE);
    }

    async getAllScores(): Promise<Score[]> {
        await this.collectionClassique
            .aggregate(this.getHightScoreQuerry)
            .toArray()
            .then((scores: Score[]) => {
                this.scoreClassique = scores;
            });

        await this.collectionLOG2990
            .aggregate(this.getHightScoreQuerry)
            .toArray()
            .then((scores: Score[]) => {
                this.scoreLOG2990 = scores;
            });

        return this.scoreClassique;
    }

    async getAlistVJ(): Promise<VP[]> {
        await this.collectionJVD
            .find({})
            .toArray()
            .then((player: VP[]) => {
                this.JV_Debutant = player;
            });
        await this.collectionJVE
            .find({})
            .toArray()
            .then((player: VP[]) => {
                this.JV_Expert = player;
            });

        return this.JV_Debutant;
    }

    async getScoreClassique(name: string): Promise<Score> {
        return this.collectionLOG2990.findOne({ playerName: name }).then((score: Score) => {
            return score;
        });
    }

    async getScoreLOG2990(name: string): Promise<Score> {
        return this.collectionClassique.findOne({ playerName: name }).then((score: Score) => {
            return score;
        });
    }

    async addScoreClassque(score: Score): Promise<void> {
        await this.collectionClassique.insertOne(score);
    }

    async addScoreLOG2990(score: Score): Promise<void> {
        await this.collectionLOG2990.insertOne(score);
    }

    async addJVD(name: string): Promise<void> {
        const player = {
            id: new ObjectID(),
            playerName: name,
            level: 'Debutant',
        };

        await this.collectionJVD.insertOne(player);
    }

    async addJVE(name: string): Promise<void> {
        const player = {
            id: new ObjectID(),
            playerName: name,
            level: 'Expert',
        };
        await this.collectionJVE.insertOne(player);
    }

    async deleteScoreClassique(name: string): Promise<void> {
        return this.collectionClassique
            .findOneAndDelete({ playerName: name })
            .then((res: FindAndModifyWriteOpResultObject<Score>) => {
                if (!res.value) {
                    throw new Error('Could not find score');
                }
            })
            .catch(() => {
                throw new Error('Failed to delete score');
            });
    }

    async deleteScoreLOG2990(name: string): Promise<void> {
        return this.collectionLOG2990
            .findOneAndDelete({ playerName: name })
            .then((res: FindAndModifyWriteOpResultObject<Score>) => {
                if (!res.value) {
                    throw new Error('Could not find score');
                }
            })
            .catch(() => {
                throw new Error('Failed to delete score');
            });
    }

    async deleteVPD(name: string): Promise<void> {
        return this.collectionJVD
            .findOneAndDelete({ playerName: name })
            .then((res: FindAndModifyWriteOpResultObject<VP>) => {
                if (!res.value) {
                    throw new Error('Could not find score');
                }
            })
            .catch(() => {
                throw new Error('Failed to delete score');
            });
    }

    async deleteVPE(name: string): Promise<void> {
        return this.collectionJVE
            .findOneAndDelete({ playerName: name })
            .then((res: FindAndModifyWriteOpResultObject<VP>) => {
                if (!res.value) {
                    throw new Error('Could not find score');
                }
            })
            .catch(() => {
                throw new Error('Failed to delete score');
            });
    }

    async resetScore(): Promise<void> {
        this.collectionClassique.drop();
        this.collectionLOG2990.drop();
        this.databaseService.populateDBScoresClassique();
        this.databaseService.populateDBScoresLOG();
    }

    async modifyVPD(vpd: VP): Promise<void> {
        const filterQuery: FilterQuery<VP> = { _id: new ObjectId(vpd.id) };
        const updateQuery: UpdateQuery<VP> = {
            $set: {
                playerName: vpd.playerName,
            },
        };
        return (
            this.collectionJVD
                .updateOne(filterQuery, updateQuery)
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                .then(() => {})
                .catch(() => {
                    throw new Error('Failed to update document');
                })
        );
    }

    async modifyVPE(vpe: VP): Promise<void> {
        const filterQuery: FilterQuery<VP> = { _id: new ObjectId(vpe.id) };
        const updateQuery: UpdateQuery<VP> = {
            $set: {
                playerName: vpe.playerName,
            },
        };
        return (
            this.collectionJVE
                .updateOne(filterQuery, updateQuery)
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                .then(() => {})
                .catch(() => {
                    throw new Error('Failed to update document');
                })
        );
    }
}
