import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import auth from "../middleware/auth.js";
import Resume from "../models/Resume.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import gemini from "../utils/gemini.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure multer for PDF uploads
const uploadsDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".docx", ".doc", ".txt"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOCX, DOC, and TXT files are allowed"));
    }
  },
});

const router = Router();

// GET /api/resumes
router.get("/", auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    console.error("Get resumes error:", error);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

// POST /api/resumes -- create resume from text
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, fileType } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const resume = await Resume.create({
      userId: req.user._id,
      title,
      content: content || null,
      fileType: fileType || null,
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error("Create resume error:", error);
    res.status(500).json({ error: "Failed to create resume" });
  }
});

// POST /api/resumes/upload -- upload PDF and extract text
router.post("/upload", auth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let extractedText = "";

    if (ext === ".pdf") {
      try {
        const PDFParser = (await import("pdf2json")).default;
        const pdfParser = new PDFParser(this, 1);
        
        extractedText = await new Promise((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
          pdfParser.on("pdfParser_dataReady", pdfData => {
            resolve(pdfParser.getRawTextContent());
          });
          pdfParser.loadPDF(filePath);
        });
      } catch (err) {
        console.error("PDF parsing failed:", err);
        throw err;
      }
    } else if (ext === ".txt") {
      extractedText = fs.readFileSync(filePath, "utf-8");
    } else {
      // For .docx/.doc, extract basic text
      const dataBuffer = fs.readFileSync(filePath, "utf-8");
      extractedText = dataBuffer.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (!extractedText || extractedText.length < 20) {
        extractedText = `[Content from ${req.file.originalname} - DOCX parsing limited. For best results, use PDF format.]`;
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({
        error: "Could not extract text from file. The file may be image-based or corrupted.",
      });
    }

    // Save resume with extracted text
    const resume = await Resume.create({
      userId: req.user._id,
      title: req.file.originalname.replace(/\.[^/.]+$/, ""),
      content: extractedText,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: ext.replace(".", ""),
    });

    res.status(201).json({
      _id: resume._id,
      title: resume.title,
      content: resume.content,
      fileType: resume.fileType,
      fileUrl: resume.fileUrl,
      createdAt: resume.createdAt,
    });
  } catch (error) {
    console.error("Upload resume error:", error);
    res.status(500).json({ error: "Failed to upload and parse resume" });
  }
});

// POST /api/resumes/:id/analyze -- run full Gemini AI analysis on a resume
router.post("/:id/analyze", auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (!resume.content || resume.content.trim().length === 0) {
      return res.status(400).json({ error: "Resume has no extractable text content" });
    }

    const prompt = `You are an expert resume analyst, career coach, and ATS (Applicant Tracking System) specialist. Analyze the following resume thoroughly and return a detailed JSON analysis.

RESUME TEXT:
${resume.content}

Return ONLY valid JSON (no markdown, no code blocks) in this exact structure:
{
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence professional summary of the candidate>",
  "skills": {
    "technical": ["<list of technical/hard skills found>"],
    "soft": ["<list of soft skills found>"],
    "missing": ["<commonly expected skills NOT found that would strengthen the resume>"]
  },
  "experience": {
    "totalYears": <estimated total years of experience as number>,
    "highlights": ["<key career achievements and highlights>"],
    "gaps": ["<any gaps, weaknesses, or areas of concern in experience>"]
  },
  "education": [
    {
      "degree": "<degree name>",
      "institution": "<school/university name>",
      "year": "<graduation year or period>"
    }
  ],
  "strengths": ["<top 4-6 resume strengths>"],
  "weaknesses": ["<top 4-6 resume weaknesses or areas for improvement>"],
  "suggestions": ["<6-8 specific, actionable improvement suggestions>"],
  "atsScore": <number 0-100 representing ATS compatibility>,
  "atsIssues": ["<specific ATS compatibility issues found>"],
  "sectionScores": {
    "contactInfo": <0-100>,
    "summary": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "skills": <0-100>,
    "formatting": <0-100>
  }
}`;

    const rawResponse = await gemini(prompt);

    // Extract JSON from response
    let analysis;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawResponse);
    } catch {
      // If JSON parsing fails, create structured fallback
      analysis = {
        overallScore: 65,
        summary: "Resume analysis completed but structured parsing was limited. Please review the raw analysis.",
        skills: { technical: [], soft: [], missing: [] },
        experience: { totalYears: 0, highlights: [], gaps: [] },
        education: [],
        strengths: ["Resume uploaded successfully"],
        weaknesses: ["Could not fully parse analysis results"],
        suggestions: ["Try uploading a cleaner PDF for better analysis"],
        atsScore: 60,
        atsIssues: ["Analysis parsing issue - results may be incomplete"],
        sectionScores: {
          contactInfo: 50,
          summary: 50,
          experience: 50,
          education: 50,
          skills: 50,
          formatting: 50,
        },
      };
    }

    // Save analysis to database
    const savedAnalysis = await ResumeAnalysis.create({
      userId: req.user._id,
      resumeId: resume._id,
      fileName: resume.title,
      extractedText: resume.content,
      analysis,
    });

    res.status(201).json(savedAnalysis);
  } catch (error) {
    console.error("Analyze resume error:", error);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

// GET /api/resumes/:id/analysis -- get saved analysis for a resume
router.get("/:id/analysis", auth, async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      resumeId: req.params.id,
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    if (!analysis) {
      return res.status(404).json({ error: "No analysis found for this resume" });
    }

    res.json(analysis);
  } catch (error) {
    console.error("Get analysis error:", error);
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
});

// GET /api/resumes/analyses -- get all analyses for the user
router.get("/analyses/all", auth, async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select("-extractedText");
    res.json(analyses);
  } catch (error) {
    console.error("Get analyses error:", error);
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
});

// DELETE /api/resumes/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Also delete associated analyses
    await ResumeAnalysis.deleteMany({ resumeId: req.params.id });

    // Delete file if exists
    if (resume.fileUrl) {
      const filePath = path.resolve(__dirname, "../..", resume.fileUrl.replace(/^\//, ""));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: "Resume deleted" });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({ error: "Failed to delete resume" });
  }
});

export default router;
