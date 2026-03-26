import mongoose from "mongoose";

const resumeOptimizationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },
    jobDescription: { type: String, required: true },
    optimizedResume: { type: String, default: null },
    coverLetter: { type: String, default: null },
    matchScore: { type: Number, default: null },
    matchedKeywords: [{ type: String }],
  },
  { timestamps: true }
);

const ResumeOptimization = mongoose.model("ResumeOptimization", resumeOptimizationSchema);
export default ResumeOptimization;
