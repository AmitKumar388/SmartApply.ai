import { Router } from "express";
import auth from "../middleware/auth.js";
import JobApplication from "../models/JobApplication.js";
import InterviewQuestion from "../models/InterviewQuestion.js";
import ResumeOptimization from "../models/ResumeOptimization.js";

const router = Router();

// GET /api/dashboard/stats
router.get("/stats", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const [appCount, questionCount, optimizations] = await Promise.all([
      JobApplication.countDocuments({ userId }),
      InterviewQuestion.countDocuments({ userId }),
      ResumeOptimization.find({ userId }).select("matchScore").lean(),
    ]);

    const avgScore = optimizations.length
      ? Math.round(
          optimizations.reduce((acc, o) => acc + (o.matchScore || 0), 0) /
            optimizations.length
        )
      : 0;

    res.json({
      applicationsTracked: appCount,
      interviewsPracticed: questionCount,
      resumesOptimized: optimizations.length,
      averageMatchScore: avgScore,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// GET /api/dashboard/activity
router.get("/activity", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const [optimizations, questions, applications] = await Promise.all([
      ResumeOptimization.find({ userId })
        .select("matchScore createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      InterviewQuestion.find({ userId })
        .select("jobTitle createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      JobApplication.find({ userId })
        .select("companyName jobTitle createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const activities = [];

    optimizations.forEach((o) =>
      activities.push({
        id: o._id,
        type: "resume_optimization",
        title: "Resume Optimized",
        description: `Match score: ${o.matchScore}%`,
        timestamp: o.createdAt,
        icon: "FileText",
      })
    );

    questions.forEach((q) =>
      activities.push({
        id: q._id,
        type: "interview_questions",
        title: "Interview Questions Generated",
        description: `For ${q.jobTitle} position`,
        timestamp: q.createdAt,
        icon: "MessageSquare",
      })
    );

    applications.forEach((a) =>
      activities.push({
        id: a._id,
        type: "job_application",
        title: "Application Tracked",
        description: `${a.jobTitle} at ${a.companyName}`,
        timestamp: a.createdAt,
        icon: "BarChart3",
      })
    );

    activities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    res.json(activities.slice(0, 5));
  } catch (error) {
    console.error("Dashboard activity error:", error);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

export default router;
