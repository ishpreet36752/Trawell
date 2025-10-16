import mongoose from "mongoose";
import { Model, Document } from "mongoose";
export enum ConnectionStatus {
  Pass = "pass",
  Like = "like",
  Accept = "accept",
  Reject = "reject"
}

export interface IConnectionRequest {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  status: ConnectionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
export type ConnectionRequestDocument = IConnectionRequest & Document;
export type ConnectionRequestModel = Model<IConnectionRequest>;
