import { ObjectId } from "mongodb";

export interface Watchlist {
    _id?: ObjectId;
    username: string;
    movieId: number;
}