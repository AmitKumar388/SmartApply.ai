import React, { useState, useRef, useEffect } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";
import { resumesApi, optimizationsApi } from "../lib/api";
import { optimizeResume } from "../lib/gemini";
import {
  Upload,
  FileText,
  Zap,
  AlertCircle,
  Copy,
  Check,
  Star,
  Sparkles,
  X,
  Target,
  TrendingUp,
  Lightbulb,
  History,
  Calendar,
  Eye,
  Download,
  Trash2,
  Archive,
  BarChart3,
  GraduationCap,
  Briefcase,
  Shield,
  ChevronRight,
  Award,
} from "lucide-react";

interface ResumeOptimization {
  id: string;
  optimized_resume: string;
  cover_letter: string;
  match_score: number;
  matched_keywords: string[];
  tips: string[];
  highlights: string[];
  created_at: string;
}

interface ResumeAnalysisResult {
  _id: string;
  fileName: string;
  analysis: {
    overallScore: number;
    summary: string;
    skills: {
      technical: string[];
      soft: string[];
      missing: string[];
    };
    experience: {
      totalYears: number;
      highlights: string[];
      gaps: string[];
    };
    education: {
      degree: string;
      institution: string;
      year: string;
    }[];
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    atsScore: number;
    atsIssues: string[];
    sectionScores: {
      contactInfo: number;
      summary: number;
      experience: number;
      education: number;
      skills: number;
      formatting: number;
    };
  };
  createdAt: string;
}

export const ResumeOptimizer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeContent, setResumeContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedResumeId, setUploadedResumeId] = useState<string | null>(null);
  const [optimization, setOptimization] = useState<ResumeOptimization | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [optimizations, setOptimizations] = useState<ResumeOptimization[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showResumeHistory, setShowResumeHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchOptimizations();
      fetchResumes();
    }
  }, [user]);

  const fetchOptimizations = async () => {
    if (!user) return;
    try {
      const data = await optimizationsApi.list();
      setOptimizations(
        (data || []).map((o: any) => ({
          id: o._id,
          optimized_resume: o.optimizedResume,
          cover_letter: o.coverLetter,
          match_score: o.matchScore,
          matched_keywords: o.matchedKeywords || [],
          tips: o.tips || [],
          highlights: o.highlights || [],
          created_at: o.createdAt,
        }))
      );
    } catch (error) {
      console.error("Error fetching optimizations:", error);
    }
  };

  const fetchResumes = async () => {
    if (!user) return;
    try {
      const data = await resumesApi.list();
      setResumes(
        (data || []).map((r: any) => ({
          id: r._id,
          title: r.title,
          content: r.content,
          file_type: r.fileType,
          created_at: r.createdAt,
        }))
      );
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  const viewOptimizationDetails = (opt: any) => {
    setSelectedHistoryItem(opt);
    setShowDetailDialog(true);
  };

  const viewResumeDetails = (resume: any) => {
    setSelectedHistoryItem(resume);
    setShowDetailDialog(true);
  };

  const deleteOptimization = async (id: string) => {
    try {
      await optimizationsApi.delete(id);
      fetchOptimizations();
      toast({ title: "Deleted", description: "Optimization deleted successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to delete optimization.", variant: "destructive" });
    }
  };

  const deleteResume = async (id: string) => {
    try {
      await resumesApi.delete(id);
      fetchResumes();
      toast({ title: "Deleted", description: "Resume deleted successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to delete resume.", variant: "destructive" });
    }
  };

  // Upload PDF to server and extract text
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowed.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload a PDF, DOCX, or TXT file.", variant: "destructive" });
      return;
    }

    setSelectedFile(file);
    setIsParsingFile(true);
    setResumeAnalysis(null);

    try {
      // Upload the file to the server for real text extraction
      const result = await resumesApi.upload(file);
      setResumeContent(result.content || "");
      setUploadedResumeId(result._id);
      fetchResumes();

      toast({
        title: "Resume uploaded & parsed",
        description: `${file.name} text extracted successfully. You can now analyze or optimize it.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload and parse file.",
        variant: "destructive",
      });
    } finally {
      setIsParsingFile(false);
    }
  };

  // Optimization now includes analysis
  const handleOptimize = async () => {
    if (!resumeContent.trim() || !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both resume content and job description.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    setIsAnalyzing(true);
    
    try {
      // 1. First run the full AI analysis (if not already done or for fresh data)
      if (uploadedResumeId) {
        try {
          const analysisResult = await resumesApi.analyze(uploadedResumeId);
          setResumeAnalysis(analysisResult);
        } catch (analysisErr) {
          console.error("Analysis failed during optimization:", analysisErr);
          // We continue with optimization even if analysis fails slightly
        }
      }

      // 2. Then run job-specific optimization
      const result = await optimizationsApi.create(resumeContent, jobDescription);
      
      const optimizationWithDetails: ResumeOptimization = {
        id: result._id || result.id || "",
        optimized_resume: result.optimizedResume || result.optimized_resume || "",
        cover_letter: result.coverLetter || result.cover_letter || "",
        match_score: result.matchScore || result.match_score || 75,
        matched_keywords: Array.isArray(result.matchedKeywords) ? result.matchedKeywords : Array.isArray(result.matched_keywords) ? result.matched_keywords : [],
        tips: [
          "Use action verbs to start bullet points",
          "Quantify achievements with specific numbers",
          "Tailor keywords to match job description",
          "Keep formatting consistent and professional",
          "Highlight relevant technical skills",
          "Include measurable results from previous roles",
        ],
        highlights: [
          "Strong alignment with required technical skills",
          "Relevant experience matches job level",
          "Educational background supports role requirements",
          "Previous achievements demonstrate capability",
        ],
        created_at: result.createdAt || new Date().toISOString(),
      };

      setOptimization(optimizationWithDetails);
      fetchOptimizations();
      toast({
        title: "Optimization Complete!",
        description: `Resume analyzed and optimized with ${optimizationWithDetails.match_score}% match score.`,
      });
    } catch (error) {
      console.error("Optimize/Analyze error:", error);
      toast({
        title: "Process failed",
        description: error instanceof Error ? error.message : "Failed to analyze and optimize resume.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({ title: "Copied!", description: "Content copied to clipboard." });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Failed to copy to clipboard.", variant: "destructive" });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500/20 border-green-500/30";
    if (score >= 60) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  return (
    <div>
      <DashboardHeader
        title="Resume Optimizer"
        subtitle="Upload your resume for AI-powered analysis and job-specific optimization"
      />

      <div className="p-4 lg:p-8 space-y-6">
        {/* Header with History Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">Resume Analysis & Optimization</h2>
          <div className="flex gap-2">
            <Button variant={showHistory ? "default" : "outline"} onClick={() => setShowHistory(!showHistory)} size="sm">
              <History className="w-4 h-4 mr-2" />
              {showHistory ? "Hide Optimization History" : "Optimization History"}
            </Button>
            <Button variant={showResumeHistory ? "default" : "outline"} onClick={() => setShowResumeHistory(!showResumeHistory)} size="sm">
              <FileText className="w-4 h-4 mr-2" />
              {showResumeHistory ? "Hide Resume History" : "Resume History"}
            </Button>
          </div>
        </div>

        {/* Optimization History */}
        {showHistory && (
          <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <History className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Optimization History</h3>
              </div>
              {optimizations.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No optimizations yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {optimizations.map((opt) => (
                    <Card key={opt.id} className="bg-secondary/20 border-border/30 hover:border-primary/50 transition-colors">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">{opt.match_score}% Match</Badge>
                          <span className="text-xs text-muted-foreground">{new Date(opt.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-1 mt-3">
                          <Button variant="ghost" size="sm" onClick={() => viewOptimizationDetails(opt)} className="flex-1">
                            <Eye className="w-3 h-3 mr-1" /> View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteOptimization(opt.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Resume History */}
        {showResumeHistory && (
          <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Resume History</h3>
              </div>
              {resumes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No resumes uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resumes.map((resume) => (
                    <Card key={resume.id} className="bg-secondary/20 border-border/30 hover:border-primary/50 transition-colors">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">{resume.file_type?.toUpperCase() || "PDF"}</Badge>
                          <span className="text-xs text-muted-foreground">{new Date(resume.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-sm font-medium text-foreground mb-2 line-clamp-1">{resume.title}</h4>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => viewResumeDetails(resume)} className="flex-1">
                            <Eye className="w-3 h-3 mr-1" /> View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteResume(resume.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Upload & Quick Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Upload Resume */}
          <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Upload className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Upload Resume</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Upload your resume (PDF, DOCX, or TXT) for real text extraction and AI analysis
              </p>

              <div className="border-2 border-dashed border-border/50 rounded-lg p-4 lg:p-6 text-center">
                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
                <Upload className="w-8 h-8 lg:w-12 lg:h-12 text-muted-foreground mx-auto mb-4" />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isParsingFile} className="mb-4" size="lg">
                  <Upload className="w-4 h-4 mr-2" />
                  {isParsingFile ? "Uploading & Parsing..." : "Choose Resume File"}
                </Button>
                <p className="text-sm text-muted-foreground">Supports PDF, DOCX, and TXT files up to 10MB</p>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary font-medium">✓ {selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">Text extracted successfully</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Analysis Score Card or Info Card */}
          {resumeAnalysis ? (
            <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-foreground">Resume Scores</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border ${getScoreBg(resumeAnalysis.analysis.overallScore)}`}>
                    <p className="text-xs text-muted-foreground mb-1">Overall Score</p>
                    <p className={`text-3xl font-bold ${getScoreColor(resumeAnalysis.analysis.overallScore)}`}>
                      {resumeAnalysis.analysis.overallScore}%
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg border ${getScoreBg(resumeAnalysis.analysis.atsScore)}`}>
                    <p className="text-xs text-muted-foreground mb-1">ATS Score</p>
                    <p className={`text-3xl font-bold ${getScoreColor(resumeAnalysis.analysis.atsScore)}`}>
                      {resumeAnalysis.analysis.atsScore}%
                    </p>
                  </div>
                </div>

                {/* Section Scores */}
                <div className="mt-4 space-y-2">
                  {Object.entries(resumeAnalysis.analysis.sectionScores || {}).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        <span className={getScoreColor(value as number)}>{value as number}%</span>
                      </div>
                      <Progress value={value as number} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : optimization ? (
            <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-foreground">Match Score</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-foreground">Resume-Job Match</span>
                      <span className="text-sm font-semibold text-foreground">{optimization.match_score}%</span>
                    </div>
                    <Progress value={optimization.match_score} className="h-2" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Key Keywords</h4>
                    <div className="flex flex-wrap gap-1">
                      {(optimization.matched_keywords ?? []).slice(0, 6).map((keyword, index) => (
                        <Badge key={index} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-foreground">AI Analysis</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your resume to get a comprehensive AI analysis including:
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span>Overall score & ATS compatibility rating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Skills analysis (technical & soft skills)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>Experience highlights & gap analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    <span>Actionable improvement suggestions</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* ========== FULL RESUME ANALYSIS RESULTS ========== */}
        {resumeAnalysis && (
          <div className="space-y-6">
            {/* Summary */}
            <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Professional Summary</h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{resumeAnalysis.analysis.summary}</p>
              </div>
            </Card>

            {/* Skills Analysis */}
            <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Skills Analysis</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center">
                      <Check className="w-4 h-4 mr-2" /> Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeAnalysis.analysis.skills.technical.map((skill, i) => (
                        <Badge key={i} className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2" /> Soft Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeAnalysis.analysis.skills.soft.map((skill, i) => (
                        <Badge key={i} className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-orange-400 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" /> Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeAnalysis.analysis.skills.missing.map((skill, i) => (
                        <Badge key={i} className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Experience & Education */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Experience */}
              <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Experience</h3>
                    </div>
                    <Badge variant="secondary">{resumeAnalysis.analysis.experience.totalYears} years</Badge>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-400 mb-2">Highlights</h4>
                      {resumeAnalysis.analysis.experience.highlights.map((h, i) => (
                        <div key={i} className="flex items-start space-x-2 mb-2">
                          <ChevronRight className="w-3 h-3 text-green-400 mt-1.5 flex-shrink-0" />
                          <p className="text-xs text-foreground">{h}</p>
                        </div>
                      ))}
                    </div>
                    {resumeAnalysis.analysis.experience.gaps.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-orange-400 mb-2">Gaps</h4>
                        {resumeAnalysis.analysis.experience.gaps.map((g, i) => (
                          <div key={i} className="flex items-start space-x-2 mb-2">
                            <AlertCircle className="w-3 h-3 text-orange-400 mt-1.5 flex-shrink-0" />
                            <p className="text-xs text-foreground">{g}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Education */}
              <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Education</h3>
                  </div>
                  <div className="space-y-3">
                    {resumeAnalysis.analysis.education.map((edu, i) => (
                      <div key={i} className="p-3 bg-secondary/20 rounded-lg border border-border/30">
                        <p className="text-sm font-medium text-foreground">{edu.degree}</p>
                        <p className="text-xs text-muted-foreground">{edu.institution}</p>
                        {edu.year && <p className="text-xs text-primary mt-1">{edu.year}</p>}
                      </div>
                    ))}
                    {resumeAnalysis.analysis.education.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No education info detected</p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" /> Strengths
                  </h3>
                  <div className="space-y-2">
                    {resumeAnalysis.analysis.strengths.map((s, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-foreground">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" /> Weaknesses
                  </h3>
                  <div className="space-y-2">
                    {resumeAnalysis.analysis.weaknesses.map((w, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-foreground">{w}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Improvement Suggestions */}
            <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-foreground">Improvement Suggestions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resumeAnalysis.analysis.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <span className="text-xs font-bold text-yellow-500 mt-0.5 flex-shrink-0">{i + 1}</span>
                      <p className="text-sm text-foreground">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* ATS Issues */}
            {resumeAnalysis.analysis.atsIssues && resumeAnalysis.analysis.atsIssues.length > 0 && (
              <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">ATS Compatibility Issues</h3>
                    <Badge className={`ml-2 ${resumeAnalysis.analysis.atsScore >= 80 ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>
                      {resumeAnalysis.analysis.atsScore}% Compatible
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {resumeAnalysis.analysis.atsIssues.map((issue, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground">{issue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ========== JOB DESCRIPTION + OPTIMIZATION ========== */}
        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm mt-8">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Job-Specific Optimization</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Paste a job description to optimize your resume for a specific role
            </p>

            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="min-h-[200px] bg-secondary/50 border-border/50 text-foreground resize-none"
            />

            <div className="mt-6">
              <Button
                onClick={handleOptimize}
                disabled={isOptimizing || !resumeContent.trim() || !jobDescription.trim()}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isOptimizing ? "Optimizing with AI..." : "Optimize with Gemini AI"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Optimization Results */}
        {optimization && (
          <div className="space-y-8 mt-8">
            {/* Job Fit Analysis */}
            <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Job Fit Analysis</h3>
                  <Badge variant={optimization.match_score >= 80 ? "default" : optimization.match_score >= 70 ? "secondary" : "destructive"}>
                    {optimization.match_score}% Match
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={`${optimization.match_score}, 100`} className="text-primary" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/20" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-foreground">{optimization.match_score}%</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-foreground">Overall Fit</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" /> Strengths
                    </h4>
                    <div className="space-y-2">
                      {optimization.highlights?.slice(0, 3).map((s, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-xs text-foreground">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-orange-400 mb-3 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" /> Improvements
                    </h4>
                    <div className="space-y-2">
                      {optimization.tips?.slice(0, 3).map((t, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-xs text-foreground">{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Keywords */}
                <div className="mt-6 pt-6 border-t border-border/30">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-primary" />
                    Matched Keywords ({optimization.matched_keywords?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {optimization.matched_keywords?.slice(0, 12).map((kw, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Optimized Resume & Cover Letter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Optimized Resume</h3>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(optimization.optimized_resume, "resume")}>
                        {copiedField === "resume" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        const el = document.createElement("a");
                        const f = new Blob([optimization.optimized_resume], { type: "text/plain" });
                        el.href = URL.createObjectURL(f);
                        el.download = "optimized-resume.txt";
                        document.body.appendChild(el);
                        el.click();
                        document.body.removeChild(el);
                      }}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-secondary/20 rounded-lg p-4 max-h-80 overflow-y-auto">
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">{optimization.optimized_resume}</pre>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Archive className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Cover Letter</h3>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(optimization.cover_letter, "cover")}>
                        {copiedField === "cover" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        const el = document.createElement("a");
                        const f = new Blob([optimization.cover_letter], { type: "text/plain" });
                        el.href = URL.createObjectURL(f);
                        el.download = "cover-letter.txt";
                        document.body.appendChild(el);
                        el.click();
                        document.body.removeChild(el);
                      }}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-secondary/20 rounded-lg p-4 max-h-80 overflow-y-auto">
                    <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{optimization.cover_letter}</pre>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedHistoryItem?.optimized_resume ? "Optimization Details" : "Resume Details"}
              </DialogTitle>
            </DialogHeader>
            {selectedHistoryItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Created</p>
                    <p className="text-sm text-muted-foreground">{new Date(selectedHistoryItem.created_at).toLocaleDateString()}</p>
                  </div>
                  {selectedHistoryItem.match_score && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Match Score</p>
                      <Badge variant="secondary">{selectedHistoryItem.match_score}%</Badge>
                    </div>
                  )}
                </div>

                {selectedHistoryItem.optimized_resume && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-2">Optimized Resume</h4>
                      <Card className="bg-secondary/20 border-border/30">
                        <div className="p-4">
                          <p className="text-sm text-foreground whitespace-pre-wrap">{selectedHistoryItem.optimized_resume}</p>
                        </div>
                      </Card>
                    </div>
                    {selectedHistoryItem.cover_letter && (
                      <div>
                        <h4 className="text-lg font-medium text-foreground mb-2">Cover Letter</h4>
                        <Card className="bg-secondary/20 border-border/30">
                          <div className="p-4">
                            <p className="text-sm text-foreground whitespace-pre-wrap">{selectedHistoryItem.cover_letter}</p>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                )}

                {!selectedHistoryItem.optimized_resume && selectedHistoryItem.content && (
                  <div>
                    <h4 className="text-lg font-medium text-foreground mb-2">{selectedHistoryItem.title}</h4>
                    <Card className="bg-secondary/20 border-border/30">
                      <div className="p-4">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{selectedHistoryItem.content}</p>
                      </div>
                    </Card>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-border/20">
                  <Button variant="outline" onClick={() => {
                    if (selectedHistoryItem.optimized_resume) {
                      setOptimization({ ...selectedHistoryItem, highlights: [], tips: [] });
                    } else {
                      setResumeContent(selectedHistoryItem.content || "");
                    }
                    setShowDetailDialog(false);
                  }}>
                    <Target className="w-4 h-4 mr-2" />
                    Use This {selectedHistoryItem.optimized_resume ? "Optimization" : "Resume"}
                  </Button>
                  <Button variant="destructive" onClick={() => {
                    if (selectedHistoryItem.optimized_resume) {
                      deleteOptimization(selectedHistoryItem.id);
                    } else {
                      deleteResume(selectedHistoryItem.id);
                    }
                    setShowDetailDialog(false);
                  }}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ResumeOptimizer;
