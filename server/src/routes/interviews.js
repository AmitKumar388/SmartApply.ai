import { Router } from "express";
import auth from "../middleware/auth.js";
import InterviewQuestion from "../models/InterviewQuestion.js";
import gemini from "../utils/gemini.js";

const router = Router();

// GET /api/interviews -- fetch saved answers
router.get("/", auth, async (req, res) => {
  try {
    const questions = await InterviewQuestion.find({
      userId: req.user._id,
      userAnswer: { $ne: null },
    }).sort({ createdAt: -1 });

    res.json(questions);
  } catch (error) {
    console.error("Get interviews error:", error);
    res.status(500).json({ error: "Failed to fetch interview questions" });
  }
});

// POST /api/interviews/generate -- generate questions via Gemini
router.post("/generate", auth, async (req, res) => {
  try {
    const { jobRole, companyName } = req.body;

    if (!jobRole) {
      return res.status(400).json({ error: "Job role is required" });
    }

    const prompt = `You are an expert interview coach. Generate 5 challenging but realistic interview questions for a ${jobRole} position${
      companyName ? ` at ${companyName}` : ""
    }. Each question should be structured to allow for STAR method responses (Situation, Task, Action, Result). Return the questions as a JSON array of objects with 'question' and 'category' fields. Categories should be: 'behavioral', 'technical', 'situational', or 'leadership'. Return ONLY valid JSON, no markdown or other text.`;

    let questions;
    try {
      const text = await gemini(prompt);
      // Extract JSON from possible markdown code blocks
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      questions = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    } catch {
      questions = [
        { question: "Tell me about a time you faced a significant challenge and how you overcame it.", category: "behavioral" },
        { question: "Describe a situation with a difficult team member. What did you do?", category: "behavioral" },
        { question: "Explain a time you had to learn a new technology quickly.", category: "technical" },
        { question: "Describe a project you led. What was your strategy?", category: "leadership" },
        { question: "Tell me about a decision you made with incomplete information.", category: "situational" },
      ];
    }

    // Save to DB
    const docs = await InterviewQuestion.insertMany(
      questions.map((q) => ({
        userId: req.user._id,
        question: q.question,
        category: q.category || null,
        jobTitle: jobRole,
        companyName: companyName || null,
      }))
    );

    res.status(201).json({ questions: docs });
  } catch (error) {
    console.error("Generate questions error:", error);
    res.status(500).json({ error: "Failed to generate interview questions" });
  }
});

// PUT /api/interviews/:id -- save user answer
router.put("/:id", auth, async (req, res) => {
  try {
    const { userAnswer, aiSuggestion } = req.body;

    const question = await InterviewQuestion.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        $set: {
          ...(userAnswer !== undefined && { userAnswer }),
          ...(aiSuggestion !== undefined && { aiSuggestion }),
        },
      },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    console.error("Update question error:", error);
    res.status(500).json({ error: "Failed to update question" });
  }
});

// DELETE /api/interviews/:id/answer -- clear saved answer
router.delete("/:id/answer", auth, async (req, res) => {
  try {
    const question = await InterviewQuestion.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { userAnswer: null, aiSuggestion: null } },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    console.error("Delete answer error:", error);
    res.status(500).json({ error: "Failed to delete answer" });
  }
});

export default router;
