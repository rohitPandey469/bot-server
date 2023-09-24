import mongoose from "mongoose";
import Questions from "../models/Questions.js";
import User from "../models/User.js";

export const postAnswer = async (req, res) => {
  const { id: _id } = req.params;
  const { noOfAnswers, answerBody, userAnswered, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send({ message: "Question unvalid" });
  }

  updatedQuestion(_id, noOfAnswers);
  try {
    const updatedQuestion = await Questions.findByIdAndUpdate(_id, {
      $addToSet: { answer: [{ answerBody, userAnswered, userId }] }, //append
    });
    const user = await User.findById(userId);
    user.answersGiven += 1;
    user.score += 1;
    await user.save();
    if (user.answersGiven >= 5) {
      user.badge = "Pro";
      user.score += 2;
    } else if (user.answersGiven >= 20) {
      user.badge = "Expert";
      user.score += 5;
    } else if (user.answersGiven >= 50) {
      user.badge = "Master";
      user.score += 7;
    } else if (user.answersGiven >= 100) {
      user.badge = "God";
      user.score += 10;
    }
    await user.save();

    res.status(200).json(updatedQuestion); //sending updated question back
  } catch (err) {
    res.status(400).json(err);
  }
};
const updatedQuestion = async (_id, noOfAnswers) => {
  try {
    await Questions.findByIdAndUpdate(_id, {
      $set: { noOfAnswers: noOfAnswers }, //changed
    });
  } catch (err) {
    console.log(err);
  }
};

export const deleteAnswer = async (req, res) => {
  const { id: _id } = req.params;
  const { answerId, noOfAnswers } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send({ message: "Question unvalid" });
  }
  if (!mongoose.Types.ObjectId.isValid(answerId)) {
    return res.status(404).send({ message: "Question unvalid" });
  }
  updatedQuestion(_id, noOfAnswers);
  try {
    await Questions.updateOne(
      { _id },
      { $pull: { answer: { _id: answerId } } } // pull out one answer from answer array
    );
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(405).json(err);
  }
};
