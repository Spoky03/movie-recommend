import { ObjectId } from "mongodb";

export interface Friends {
    _id: ObjectId;
    user: ObjectId;
    friend: ObjectId;
    status: "ACCEPTED" | "PENDING" | "REJECTED";
}