import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
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
    fileName: { type: String, default: "" },
    extractedText: { type: String, default: "" },
    analysis: {
      overallScore: { type: Number, default: 0 },
      summary: { type: String, default: "" },
      skills: {
        technical: [String],
        soft: [String],
        missing: [String],
      },
      experience: {
        totalYears: { type: Number, default: 0 },
        highlights: [String],
        gaps: [String],
      },
      education: [
        {
          degree: String,
          institution: String,
          year: String,
        },
      ],
      strengths: [String],
      weaknesses: [String],
      suggestions: [String],
      atsScore: { type: Number, default: 0 },
      atsIssues: [String],
      sectionScores: {
        contactInfo: { type: Number, default: 0 },
        summary: { type: Number, default: 0 },
        experience: { type: Number, default: 0 },
        education: { type: Number, default: 0 },
        skills: { type: Number, default: 0 },
        formatting: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true }
);

const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
export default ResumeAnalysis;
