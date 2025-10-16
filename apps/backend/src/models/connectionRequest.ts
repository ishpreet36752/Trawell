import mongoose, { Schema } from "mongoose";
import {  IConnectionRequest, 
  ConnectionRequestDocument, 
  ConnectionRequestModel, 
  ConnectionStatus } from "../types/connection-request"
const connectionRequestSchema = new Schema<IConnectionRequest>(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: Object.values(ConnectionStatus),
        message: `{VALUE} is incorrect status type. `,
      },
    },
  },
  {
    timestamps: true,
  }
);
// indexes 
connectionRequestSchema.index({fromUserId : 1 , toUserId : 1});

connectionRequestSchema.pre<ConnectionRequestDocument>("save" , function(next){
  const connectionRequest = this;
  if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
   next(new Error("You can't send a connection request to yourself"));
  }else{
    next();
  }
})
 
const ConnectionRequestModel =  mongoose.model<IConnectionRequest>(
  "ConnectionRequest",
  connectionRequestSchema
); //it should be in capitalized letters

export default ConnectionRequestModel;
