const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["pass", "like", "accept", "reject"],
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

connectionRequestSchema.pre("save" , function(){
  const connectionRequest = this;
  if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
    throw new Error("You can't send a connection request to yourself");
  }
})

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
); //it should be in capitalized letters

module.exports = ConnectionRequestModel;
