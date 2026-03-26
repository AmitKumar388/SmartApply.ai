import mongoose from "mongoose";

const interviewQuestionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobTitle: { type: String, required: true },
    companyName: { type: String, default: null },
    question: { type: String, required: true },
    category: { type: String, default: null },
    starAnswer: { type: String, default: null },
    userAnswer: { type: String, default: null },
    aiSuggestion: { type: String, default: null },
  },
  { timestamps: true }
);

const InterviewQuestion = mongoose.model("InterviewQuestion", interviewQuestionSchema);
export default InterviewQuestion;
