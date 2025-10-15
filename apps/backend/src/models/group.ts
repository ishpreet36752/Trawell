import mongoose , {Schema} from "mongoose";
import {GroupDocument} from "../types/group-type";


const groupSchema = new Schema<GroupDocument>(
  {
    groupName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    description: {
      type: String,
      required: true,
    },
    groupAdmin: {
      type: Schema.Types.ObjectId ,
      ref: "User",
      required: true,
    },
    groupMembers: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        isVerified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    destination: {
      type: [String],
      required: true,
    },
    travelDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "open",
      enum: ["open", "closed"],
    },
    maxMembers: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);
groupSchema.index({ "groupMembers.user": 1 });

const Group = mongoose.model<GroupDocument>("Group", groupSchema);
export default Group;