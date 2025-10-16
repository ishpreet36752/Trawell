import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IGroupMember {
  user: Types.ObjectId;
  isVerified?: boolean;
}

export interface IGroup {
  groupName: string;
  description: string;
  groupAdmin: Types.ObjectId;
  groupMembers: IGroupMember[];
  destination: string[];
  travelDate: string;
  status?: "open" | "closed";
  maxMembers: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type GroupDocument = IGroup & Document;
export type GroupModel = Model<GroupDocument>;