const mongoose = require("mongoose");
const user = require("./user");

const groupSchema = new mongoose.Schema(
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
      type: mongoose.Schema.Types.ObjectId ,
      ref: "User",
      required: true,
    },
    groupMembers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model("Group", groupSchema);
