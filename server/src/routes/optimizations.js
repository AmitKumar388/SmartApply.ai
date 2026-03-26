import { Router } from "express";
import auth from "../middleware/auth.js";
import ResumeOptimization from "../models/ResumeOptimization.js";
import gemini from "../utils/gemini.js";

const router = Router();

// GET /api/optimizations
router.get("/", auth, async (req, res) => {
  try {
    const optimizations = await ResumeOptimization.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(optimizations);
  } catch (error) {
    console.error("Get optimizations error:", error);
    res.status(500).json({ error: "Failed to fetch optimizations" });
  }
});

// POST /api/optimizations -- run the full optimize pipeline
router.post("/", auth, async (req, res) => {
  try {
    const { resumeContent, jobDescription } = req.body;

    if (!resumeContent || !jobDescription) {
      return res.status(400).json({ error: "Resume content and job description are required" });
    }

    // Step 1: Run full optimization and analysis via Gemini
    let result;
    try {
      const prompt = `You are a professional resume writer and career coach. Your task is to optimize the given resume for the provided job description and analyze the fit.
      
      RESUME:
      ${resumeContent}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      Return ONLY a valid JSON object with this exact structure:
      {
        "matchScore": <number 0-100 indicating how well the resume matches the job>,
        "matchedKeywords": ["<list of 8-12 key skills/keywords from the job found in or added to the resume>"],
        "optimizedResume": "<the full optimized resume text>",
        "coverLetter": "<a compelling 3-4 paragraph cover letter>"
      }`;

      const rawResponse = await gemini(prompt);
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawResponse);
    } catch (error) {
      console.error("Gemini optimization error:", error);
      // Fallback if AI fails
      result = {
        matchScore: 75,
        matchedKeywords: ["Communication", "Problem Solving", "Technical Skills"],
        optimizedResume: resumeContent, // Fallback to original
        coverLetter: "Dear Hiring Manager,\n\nI am interested in this position..."
      };
    }

    // Save to DB
    const optimization = await ResumeOptimization.create({
      userId: req.user._id,
      jobDescription,
      optimizedResume: result.optimizedResume || resumeContent,
      coverLetter: result.coverLetter || "",
      matchScore: result.matchScore || 70,
      matchedKeywords: result.matchedKeywords || [],
    });

    res.status(201).json(optimization);
  } catch (error) {
    console.error("Optimize resume error:", error);
    res.status(500).json({ error: "Failed to optimize resume" });
  }
});

// DELETE /api/optimizations/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const optimization = await ResumeOptimization.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!optimization) {
      return res.status(404).json({ error: "Optimization not found" });
    }

    res.json({ message: "Optimization deleted" });
  } catch (error) {
    console.error("Delete optimization error:", error);
    res.status(500).json({ error: "Failed to delete optimization" });
  }
});

export default router;
