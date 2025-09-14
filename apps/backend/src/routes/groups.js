const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Group = require("../models/group.js");
const groupRouter = express.Router();

groupRouter.post("/group/create", userAuth, async (req, res) => {
  try {
    const {
      groupName,
      description,
      maxMembers,
      destination,
      travelDate,
      status,
    } = req.body;

    if (!groupName || !maxMembers || !destination || !travelDate) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }
    // const loggedUser = req.user;
    // const adminName = loggedUser.firstName;
    const group = new Group({
      groupName,
      description,
      groupAdmin: req.user._id,
      maxMembers,
      destination,
      travelDate,
      groupMembers: [{ user: req.user._id, isVerified: true }],
      status,
    });

    await group.save();
    const populatedGroup = await Group.findById(group._id)
      .populate("groupAdmin", "firstName lastName emailId")
      .populate("groupMembers.user", "firstName lastName emailId");

    res
      .status(201)
      .json({ group: populatedGroup, message: "Group created successfully" });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

groupRouter.get("/groups", async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("groupMembers.user", "firstName lastName emailId")
      .populate("groupAdmin", "firstName lastName emailId");
    res.json(groups);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

groupRouter.post("/:groupId/join", userAuth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const existingMember = group.groupMembers.find(
      (member) => member.user.toString() === req.user._id.toString()
    );
    if (existingMember) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group" });
    }

    if (group.status === "closed") {
      return res.status(400).json({ message: "Group is Closed" });
    }

    if (group.groupMembers.length >= group.maxMembers) {
      return res.status(400).json({ message: "Group is full" });
    }

    group.groupMembers.push({ user: req.user._id });
    await group.save();

    return res.status(200).json({
      message: "You have joined the group. Can't wait to travel!",
      group,
    });
  } catch (err) {
    console.error("Error joining group:", err);
    return res
      .status(500)
      .json({ message: "Error joining group", error: err.message });
  }
});

module.exports = groupRouter;
