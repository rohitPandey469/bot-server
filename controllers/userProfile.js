import users from "../models/User.js";
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.find();
    const allUsersDetails = [];
    allUsers.forEach((user) => {
      allUsersDetails.push({
        _id: user._id,
        fname: user.fname,
        joinedOn: user.joinedOn,
        about: user.about,
        score: user.score,
        badge: user.badge,
        answersGiven: user.answersGiven,
      });
    });
    res.status(200).json(allUsersDetails);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id: _id } = req.params;
  const { fname, about } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send({ message: "Question unvalid" });
    // status code 404 - record is not found
  }

  try {
    const updatedProfile = await users.findByIdAndUpdate(
      _id,
      { $set: { fname: fname, about: about } }, // setting the new values
      { new: true } // to get the updated data
    );
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(405).json({ message: err.message });
  }
};
