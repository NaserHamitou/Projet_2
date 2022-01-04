import { ObjectId } from 'bson';
export interface VP {
    id: string | number | ObjectId;
    playerName: string;
    level: string;
}
