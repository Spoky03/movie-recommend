import { ObjectId } from "mongodb";

export interface Rating {
    score:  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    movieId: number;
    username: string;
    _id?: ObjectId;
}