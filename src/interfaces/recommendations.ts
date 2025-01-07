import { ObjectId } from "mongodb";

export interface Recommendations {
    _id?: ObjectId;
    userId: ObjectId;
    movieId: number;
    updatedAt: Date;
    basedOn: number;
}