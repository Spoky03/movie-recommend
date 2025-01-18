import { ObjectId } from "mongodb";

export interface Watchlist {
    _id?: ObjectId;
    userId: ObjectId;
    movieId: number;
}