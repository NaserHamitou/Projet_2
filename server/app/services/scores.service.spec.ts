import { Score } from '@app/classes/score';
import { VP } from '@app/classes/VP';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { DatabaseServiceMock } from './database.service.mock';
import { ScoresService } from './scores.service';

chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Scores service', () => {
    let scoresService: ScoresService;
    let databaseService: DatabaseServiceMock;
    let client: MongoClient;
    let testScore: Score;
    let testPlayer: VP;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        client = (await databaseService.start()) as MongoClient;
        scoresService = new ScoresService(databaseService as any);
        client = (await databaseService.start()) as MongoClient;
        scoresService = new ScoresService(databaseService as any);
        testScore = {
            playerName: 'test Score',
            score: 1,
        };
        testPlayer = {
            id: 'qwerty',
            playerName: 'test Score',
            level: 'testvp',
        };
        await scoresService.collectionClassique.insertOne(testScore);
        await scoresService.collectionLOG2990.insertOne(testScore);
        await scoresService.collectionJVD.insertOne(testPlayer);
        await scoresService.collectionJVE.insertOne(testPlayer);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get all score from DB', async () => {
        let scores = await scoresService.getAllScores();
        expect(scores.length).to.equal(1);
        expect(testScore.playerName).to.deep.equals(scores[0]['docs'][0]['playerName']);
    });

    it('should get all player  from DB', async () => {
        let vp = await scoresService.getAlistVJ();
        expect(vp.length).to.equal(1);
        expect(testPlayer).to.deep.equals(vp[0]);
    });

    it('should get specific score with valid plyarname Classique ', async () => {
        let score = await scoresService.getScoreClassique('test Score');
        expect(score).to.deep.equals(testScore);
    });

    it('should get specific score with valid player name log2990', async () => {
        let score = await scoresService.getScoreLOG2990('test Score');
        expect(score).to.deep.equals(testScore);
    });

    it('should insert a new score classique ', async () => {
        let secondScore: Score = {
            playerName: 'test Score 2',
            score: 1,
        };

        await scoresService.addScoreClassque(secondScore);
        let scores = await scoresService.collectionClassique.find({}).toArray();
        expect(scores.length).to.equal(2);
        expect(scores.find((x) => x.playerName === secondScore.playerName)).to.deep.equals(secondScore);
    });

    it('should insert a new score log 2990 ', async () => {
        let secondScore: Score = {
            playerName: 'test Score 2',
            score: 1,
        };

        await scoresService.addScoreLOG2990(secondScore);
        let scores = await scoresService.collectionLOG2990.find({}).toArray();
        expect(scores.length).to.equal(2);
        expect(scores.find((x) => x.playerName === secondScore.playerName)).to.deep.equals(secondScore);
    });

    it('should insert a new player debutant', async () => {
        let namePlayer = 'test player';
        await scoresService.addJVD(namePlayer);
        let vp = await scoresService.collectionJVD.find({}).toArray();
        expect(vp.length).to.equal(2);
        expect(vp.find((x) => x.playerName === testPlayer.playerName)).to.deep.equals(testPlayer);
    });

    it('should insert a new player expert', async () => {
        let namePlayer = 'test player';
        await scoresService.addJVE(namePlayer);
        let vp = await scoresService.collectionJVE.find({}).toArray();
        expect(vp.length).to.equal(2);
        expect(vp.find((x) => x.playerName === testPlayer.playerName)).to.deep.equals(testPlayer);
    });

    it('should  delete a score classique  ', async () => {
        try {
            await scoresService.deleteScoreClassique('Jouer 1');
        } catch {
            let courses = await scoresService.collectionClassique.find({}).toArray();
            expect(courses.length).to.equal(1);
        }
    });

    it('should  delete a  score LOG  ', async () => {
        try {
            await scoresService.deleteScoreLOG2990('Jouer 1');
        } catch {
            let scores = await scoresService.collectionLOG2990.find({}).toArray();
            expect(scores.length).to.equal(1);
        }
    });

    /* it('should modify an existing splayer', async () => {
        let vPlayer: VP = {
            playerName: 'test Score 2',
            level: 'Debutant',
            id: new ObjectId(),
        };
        await scoresService.modifyVPD(vPlayer);

        let player = await scoresService.collectionJVD.find({}).toArray();
        expect(player.length).to.equal(1);
        expect(player.find((x) => x.id === vp.id)?.playerName).to.deep.equals(vPlayer.playerName);
    }); */

    it('should  delete  vp  Expert ', async () => {
        try {
            await scoresService.deleteVPE('Player1');
        } catch {
            let scores = await scoresService.collectionJVE.find({}).toArray();
            expect(scores.length).to.equal(1);
        }
    });

    it('should  delete  vp  debutant ', async () => {
        try {
            await scoresService.deleteVPD('Player1');
        } catch {
            let scores = await scoresService.collectionJVD.find({}).toArray();
            expect(scores.length).to.equal(1);
        }
    });

    describe('Error handling', async () => {
        it('should throw an error if we try to get all scores on a closed connection', async () => {
            await client.close();
            expect(scoresService.getAllScores()).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to delete a specific score on a closed connection', async () => {
            await client.close();
            expect(scoresService.deleteVPD(testScore.playerName)).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to modify a specific score on a closed connection', async () => {
            await client.close();
            expect(scoresService.modifyVPD({} as VP)).to.eventually.be.rejectedWith(Error);
        });
    });
});
