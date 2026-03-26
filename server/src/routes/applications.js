import { Router } from "express";
import auth from "../middleware/auth.js";
import JobApplication from "../models/JobApplication.js";

const router = Router();

// GET /api/applications
router.get("/", auth, async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// POST /api/applications
router.post("/", auth, async (req, res) => {
  try {
    const { companyName, jobTitle, status, notes, appliedDate } = req.body;

    if (!companyName || !jobTitle) {
      return res.status(400).json({ error: "Company name and job title are required" });
    }

    const application = await JobApplication.create({
      userId: req.user._id,
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      status: status || "Applied",
      notes: notes?.trim() || null,
      appliedDate: appliedDate || new Date(),
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({ error: "Failed to create application" });
  }
});

// PUT /api/applications/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const { companyName, jobTitle, status, notes } = req.body;

    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        $set: {
          ...(companyName && { companyName: companyName.trim() }),
          ...(jobTitle && { jobTitle: jobTitle.trim() }),
          ...(status && { status }),
          notes: notes?.trim() || null,
        },
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({ error: "Failed to update application" });
  }
});

// DELETE /api/applications/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Application deleted" });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({ error: "Failed to delete application" });
  }
});

export default router;
