import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    email: { type: String, default: "" },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    professionalTitle: { type: String, default: "" },
    company: { type: String, default: "" },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    emailNotifications: { type: Boolean, default: true },
    interviewReminders: { type: Boolean, default: true },
    resumeOptimizationAlerts: { type: Boolean, default: true },
    profileVisibility: { type: Boolean, default: false },
    dataAnalytics: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
