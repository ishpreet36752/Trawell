import { Router, Response } from "express";
import { userAuth } from "../middlewares/auth";
import Group from "../models/group";
import { AuthenticatedRequest } from "../types/auth-request";
const groupRouter = Router();

groupRouter.post("/group/create", userAuth, async (req:AuthenticatedRequest, res:Response):Promise<void> => {
  try {
    const {
      groupName,
      description,
      maxMembers,
      destination,
      travelDate,
      status,
    } = req.body as {
        groupName?: string;
        description?: string;
        maxMembers?: number;
        destination?: string[];
        travelDate?: string;
        status?: "open" | "closed";
      };

    if (!groupName || !maxMembers || !destination || !travelDate) {
       res
        .status(400)
        .json({ message: "All required fields must be provided" });
        return;
    }
    // const loggedUser = req.user;
    // const adminName = loggedUser.firstName;
    const loggedUser = req.user;
      if (!loggedUser?._id) {
        res.status(401).json({ message: "Unauthorized access" });
        return;
      }
    const group = new Group({
      groupName,
      description,
      groupAdmin: loggedUser._id,
      maxMembers,
      destination,
      travelDate,
      groupMembers: [{ user: loggedUser._id, isVerified: true }],
      status: status || "open",
    });

    await group.save();
    const populatedGroup = await Group.findById(group._id)
      .populate("groupAdmin", "firstName lastName emailId")
      .populate("groupMembers.user", "firstName lastName emailId")
      .exec();

    res
      .status(201)
      .json({ group: populatedGroup, message: "Group created successfully" });
  } catch (err:any) {
    res.status(400).send("ERROR :" + err.message);
  }
});

groupRouter.get("/groups", async (req:AuthenticatedRequest, res:Response):Promise<any> => {
  try {
    const groups = await Group.find()
      .populate("groupMembers.user", "firstName lastName emailId")
      .populate("groupAdmin", "firstName lastName emailId")
      .exec();
    res.json(groups);
  } catch (err:any) {
    res.status(400).send("ERROR :" + err.message);
  }
});

groupRouter.post("/:groupId/join", userAuth, async (req:AuthenticatedRequest, res:Response):Promise<void> => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
       res.status(404).json({ message: "Group not found" });
       return
    }
    const loggedUser = req.user;
    if (!loggedUser?._id) {
        res.status(401).json({ message: "Unauthorized access" });
        return;
    }
    const existingMember = group.groupMembers.find(
      (member) => member.user.toString() === loggedUser._id.toString()
    );
    if (existingMember) {
       res
        .status(400)
        .json({ message: "You are already a member of this group" });
        return
    }

    if (group.status === "closed") {
       res.status(400).json({ message: "Group is Closed" });
       return
    }

    if (group.groupMembers.length >= group.maxMembers) {
       res.status(400).json({ message: "Group is full" });
       return
    }

    group.groupMembers.push({ user:  loggedUser._id });
    await group.save();

    res.status(200).json({
      message: "You have joined the group. Can't wait to travel!",
      group,
    });
  } catch (err:any) {
    console.error("Error joining group:", err);
    res
      .status(500)
      .json({ message: "Error joining group", error: err.message });
  }
});

export {groupRouter};
