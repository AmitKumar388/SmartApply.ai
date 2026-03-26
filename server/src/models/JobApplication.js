import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    companyName: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    jobDescription: { type: String, default: null },
    status: {
      type: String,
      enum: ["Applied", "Interviewing", "Rejected", "Offer"],
      default: "Applied",
    },
    notes: { type: String, default: null },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);
export default JobApplication;
