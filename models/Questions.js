import mongoose from "mongoose";

const questionSchema = {
  questionTitle: {
    type: String,
    required: [true, "Question must have a title"],
  },
  noOfAnswers: { type: Number, default: 0 },
  upVote: { type: [String], default: [] },
  downVote: { type: [String], default: [] },
  userPosted: { type: String, required: "Question must have an author" },
  userId: { type: String },
  askedOn: { type: Date, default: Date.now },
  answer: [
    {
      answerBody: String,
      userAnswered: String,
      userId: String,
      answeredOn: { type: Date, default: Date.now },
    },
  ],
};

export default mongoose.model("Question", questionSchema);
