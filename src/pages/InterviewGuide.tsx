import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";

const InterviewGuide = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      let yPos = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const maxWidth = 170;

      // Helper function to add text with automatic page breaks
      const addText = (text: string, fontSize: number, isBold: boolean = false, indent: number = 0) => {
        doc.setFontSize(fontSize);
        if (isBold) doc.setFont("helvetica", "bold");
        else doc.setFont("helvetica", "normal");

        const lines = doc.splitTextToSize(text, maxWidth - indent);
        lines.forEach((line: string) => {
          if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, margin + indent, yPos);
          yPos += fontSize * 0.5;
        });
        yPos += 3;
      };

      // Title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("SmartApply.AI - Interview Guide", margin, yPos);
      yPos += 15;

      // Section 1: Project Introduction
      addText("1. PROJECT INTRODUCTION / ELEVATOR PITCH (30-40 sec)", 14, true);
      addText(
        "SmartApply.AI is a full-stack AI-powered job application assistant that helps job seekers optimize their resumes, practice interviews, and track applications—all in one platform. I built it using React with TypeScript for the frontend, Supabase for backend services and authentication, and integrated Google Gemini AI for intelligent resume optimization and interview question generation. The platform allows users to upload their resume, paste a job description, and receive a tailored resume with a match score, along with AI-generated interview questions specific to their target role.",
        10
      );
      yPos += 5;

      // Section 2: Detailed Project Overview
      addText("2. DETAILED PROJECT OVERVIEW", 14, true);
      addText("Problem It Solves:", 11, true);
      addText("- Job seekers struggle to tailor resumes for each application", 10, false, 5);
      addText("- Freshers lack interview preparation guidance", 10, false, 5);
      addText("- Tracking multiple applications becomes chaotic", 10, false, 5);
      addText("- No centralized platform combines all job search tools", 10, false, 5);
      yPos += 3;

      addText("Why I Built It:", 11, true);
      addText(
        "As a fresher entering the job market, I experienced these challenges firsthand. I wanted to create a solution that combines AI-powered optimization with practical job search management, while learning modern full-stack development and AI integration.",
        10
      );
      yPos += 5;

      // Section 3: Tech Stack
      addText("3. TECH STACK & ARCHITECTURE", 14, true);
      addText("Frontend:", 11, true);
      addText("- React 18 + TypeScript – Type safety, component reusability, modern React patterns", 10, false, 5);
      addText("- Vite – Fast build tool, HMR for better DX", 10, false, 5);
      addText("- TailwindCSS + shadcn/ui – Rapid UI development with accessible components", 10, false, 5);
      addText("- React Router v6 – Client-side routing with protected routes", 10, false, 5);
      addText("- React Query – Server state management, caching, automatic refetching", 10, false, 5);
      yPos += 3;

      addText("Backend:", 11, true);
      addText("- Supabase – Backend-as-a-Service with PostgreSQL database", 10, false, 5);
      addText("- Supabase Edge Functions (Deno) – Serverless functions for AI integration", 10, false, 5);
      addText("- Row-Level Security (RLS) – Database-level security policies", 10, false, 5);
      yPos += 3;

      addText("AI Integration:", 11, true);
      addText("- Google Gemini API – Resume optimization, interview question generation", 10, false, 5);
      addText("- OpenAI API – Alternative AI provider support", 10, false, 5);
      yPos += 3;

      addText("Database:", 11, true);
      addText("- PostgreSQL (via Supabase) – Relational database", 10, false, 5);
      addText("- Tables: profiles, resumes, job_applications, interview_questions, resume_optimizations", 10, false, 5);
      yPos += 5;

      // Section 4: System Flow
      addText("4. SYSTEM FLOW – STEP BY STEP", 14, true);
      addText("Resume Optimization Flow:", 11, true);
      addText("1. User uploads PDF/DOCX resume → Frontend", 10, false, 5);
      addText("2. Frontend reads file content using FileReader API", 10, false, 5);
      addText("3. User pastes job description", 10, false, 5);
      addText("4. Frontend calls Supabase Edge Function: optimize-resume", 10, false, 5);
      addText("5. Edge Function receives data, validates user auth", 10, false, 5);
      addText("6. Edge Function calls Google Gemini API with structured prompt", 10, false, 5);
      addText("7. Gemini analyzes resume vs job description", 10, false, 5);
      addText("8. Returns: optimized resume, cover letter, match score, keywords", 10, false, 5);
      addText("9. Edge Function saves to resume_optimizations table", 10, false, 5);
      addText("10. Frontend displays results with download options", 10, false, 5);
      yPos += 5;

      // Section 5: Key Features
      addText("5. KEY FEATURES", 14, true);
      addText("1. AI Resume Optimizer", 11, true);
      addText("   - Upload resume (PDF/DOCX support)", 10, false, 5);
      addText("   - Paste job description", 10, false, 5);
      addText("   - Get match score (0-100%)", 10, false, 5);
      addText("   - Receive tailored resume suggestions", 10, false, 5);
      addText("   - Generate custom cover letter", 10, false, 5);
      yPos += 3;

      addText("2. Interview Practice", 11, true);
      addText("   - AI-generated questions based on job role", 10, false, 5);
      addText("   - STAR method framework", 10, false, 5);
      addText("   - Save practice answers", 10, false, 5);
      yPos += 3;

      addText("3. Application Tracker", 11, true);
      addText("   - Track applications (Applied, Interviewing, Rejected, Offer)", 10, false, 5);
      addText("   - Add notes per application", 10, false, 5);
      addText("   - Filter and search functionality", 10, false, 5);
      yPos += 5;

      // Section 6: Challenges & Solutions
      addText("6. CHALLENGES & SOLUTIONS", 14, true);
      
      addText("Challenge 1: Parsing Resume Files Reliably", 11, true);
      addText("Problem: Different resume formats (PDF, DOCX) have varied structures", 10, false, 5);
      addText("Solution:", 10, true, 5);
      addText("- Used FileReader API to extract text content on frontend", 10, false, 5);
      addText("- Implemented fallback parsing for different PDF structures", 10, false, 5);
      addText("- Added user preview before submission to verify extraction", 10, false, 5);
      yPos += 3;

      addText("Challenge 2: Managing AI API Costs", 11, true);
      addText("Problem: Gemini API calls could become expensive with many users", 10, false, 5);
      addText("Solution:", 10, true, 5);
      addText("- Implemented request caching in database", 10, false, 5);
      addText("- Added rate limiting per user", 10, false, 5);
      addText("- Chose cost-effective models (gemini-2.5-flash)", 10, false, 5);
      yPos += 3;

      addText("Challenge 3: Securing API Keys", 11, true);
      addText("Problem: Cannot expose AI API keys in frontend code", 10, false, 5);
      addText("Solution:", 10, true, 5);
      addText("- Used Supabase Edge Functions as middleware", 10, false, 5);
      addText("- Stored keys as Supabase secrets (encrypted)", 10, false, 5);
      addText("- All AI calls go through backend with auth validation", 10, false, 5);
      yPos += 5;

      // Section 7: Interview Questions
      addText("7. COMMON INTERVIEW QUESTIONS WITH ANSWERS", 14, true);
      
      addText("Q1: Why did you choose this tech stack?", 11, true);
      addText(
        "I chose React with TypeScript because it's industry-standard with strong typing that catches errors early. For the backend, I selected Supabase because it provides authentication, database, and serverless functions in one platform. I used Google Gemini AI because it offers excellent performance for text analysis tasks at a reasonable cost. The combination gives me a production-ready stack that scales automatically.",
        10
      );
      yPos += 3;

      addText("Q2: How did you handle authentication and security?", 11, true);
      addText("I implemented multiple security layers:", 10);
      addText("1. Authentication: Supabase Auth with JWT tokens and automatic refresh", 10, false, 5);
      addText("2. Database Security: Row-Level Security (RLS) policies for data isolation", 10, false, 5);
      addText("3. API Security: All AI keys stored as encrypted secrets", 10, false, 5);
      addText("4. Input Validation: Zod schemas for type-safe validation", 10, false, 5);
      addText("5. Protected Routes: Authentication guards before rendering pages", 10, false, 5);
      yPos += 3;

      addText("Q3: What was the most challenging part?", 11, true);
      addText(
        "The most challenging part was integrating AI reliably while managing costs and response quality. I initially made direct API calls from frontend, but realized this exposed API keys. I refactored to use Edge Functions as secure middleware. Another challenge was handling inconsistent AI responses - I solved this by creating structured prompts, implementing error handling with fallbacks, and caching successful results.",
        10
      );
      yPos += 3;

      addText("Q4: How would you scale this if traffic increased?", 11, true);
      addText("Database Level:", 10, true, 5);
      addText("- Add indexes on frequently queried columns", 10, false, 5);
      addText("- Implement connection pooling", 10, false, 5);
      addText("- Consider read replicas for analytics", 10, false, 5);
      yPos += 2;
      
      addText("Application Level:", 10, true, 5);
      addText("- Implement Redis caching for AI responses", 10, false, 5);
      addText("- Add request rate limiting per user", 10, false, 5);
      addText("- Use CDN for static assets", 10, false, 5);
      yPos += 2;

      addText("AI Integration:", 10, true, 5);
      addText("- Batch similar requests to reduce API calls", 10, false, 5);
      addText("- Implement queue system for non-urgent tasks", 10, false, 5);
      addText("- Cache common job description patterns", 10, false, 5);
      yPos += 3;

      addText("Q5: What real-world skills did you learn?", 11, true);
      addText("1. API Design: Structuring endpoints, error handling, meaningful responses", 10, false, 5);
      addText("2. State Management: Complex async data with React Query", 10, false, 5);
      addText("3. Security Mindset: SQL injection prevention, XSS protection, secret management", 10, false, 5);
      addText("4. Cost Awareness: Monitoring API usage, optimizing AI calls", 10, false, 5);
      addText("5. User Experience: Loading states, error messages, optimistic updates", 10, false, 5);
      addText("6. Debugging: Using DevTools, Supabase logs, network inspection", 10, false, 5);
      yPos += 5;

      // Section 8: Future Improvements
      addText("8. IMPROVEMENTS / FUTURE SCOPE", 14, true);
      addText("Short-term Improvements:", 11, true);
      addText("- LinkedIn Integration: Import profile data automatically", 10, false, 5);
      addText("- Email Notifications: Remind about application deadlines", 10, false, 5);
      addText("- Resume Templates: Multiple professional formats", 10, false, 5);
      addText("- Bulk Application Import: CSV upload for tracking", 10, false, 5);
      yPos += 3;

      addText("Scalability Plans:", 11, true);
      addText("- Caching Layer: Redis for frequently accessed data", 10, false, 5);
      addText("- CDN Integration: Faster asset delivery globally", 10, false, 5);
      addText("- Database Optimization: Add indexes on queried columns", 10, false, 5);
      addText("- AI Model Fine-tuning: Train custom model on successful resumes", 10, false, 5);
      yPos += 5;

      // Section 9: Brief Version
      addText("9. BRIEF VERSION (2 MINUTES)", 14, true);
      addText(
        "SmartApply.AI is an AI-powered job application assistant I built to solve problems I faced as a job seeker. It helps users optimize resumes for specific job descriptions, practice interviews with AI-generated questions, and track multiple applications.",
        10
      );
      yPos += 2;
      addText(
        "I built it using React with TypeScript for type-safe development, Supabase for backend services including PostgreSQL database and Edge Functions, and integrated Google Gemini AI for content generation.",
        10
      );
      yPos += 2;
      addText(
        "The core workflow: users upload their resume, paste a job description, my system calls Gemini AI through Edge Functions, returns optimized resume with match score and cover letter. All secured with Row-Level Security.",
        10
      );
      yPos += 2;
      addText(
        "Most challenging: securing API keys using Edge Functions as middleware, and implementing caching to minimize costs. This project taught me full-stack development, AI integration, database security, and production-ready practices.",
        10
      );
      yPos += 5;

      // Section 10: Presentation Tips
      addText("10. TIPS FOR FRESHER PRESENTATION", 14, true);
      addText("Do's:", 11, true);
      addText("✓ Use diagrams to explain architecture", 10, false, 5);
      addText("✓ Walk through specific feature in detail", 10, false, 5);
      addText("✓ Mention specific code patterns used", 10, false, 5);
      addText("✓ Discuss tradeoffs you considered", 10, false, 5);
      addText("✓ Connect technical decisions to business impact", 10, false, 5);
      yPos += 3;

      addText("Don'ts:", 11, true);
      addText("✗ Don't memorize answers—understand concepts", 10, false, 5);
      addText("✗ Don't exaggerate (they'll dig deeper)", 10, false, 5);
      addText("✗ Don't blame tools", 10, false, 5);
      addText("✗ Don't say 'it's just a simple project'", 10, false, 5);
      addText("✗ Don't skip the 'why' behind decisions", 10, false, 5);
      yPos += 5;

      // Footer
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${totalPages}`, margin, pageHeight - 10);
        doc.text("SmartApply.AI Interview Guide", maxWidth, pageHeight - 10);
      }

      // Save the PDF
      doc.save("SmartApply-AI-Interview-Guide.pdf");
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Interview Preparation Guide</h1>
          <p className="text-muted-foreground">
            Complete interview guide for presenting your SmartApply.AI project
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Download Complete Guide
            </CardTitle>
            <CardDescription>
              Get a comprehensive PDF with all interview questions, answers, and presentation tips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generatePDF} disabled={isGenerating} size="lg" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating PDF..." : "Download PDF Guide"}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <h3 className="font-semibold">Project Introduction</h3>
                  <p className="text-sm text-muted-foreground">30-40 second elevator pitch</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <h3 className="font-semibold">Detailed Overview</h3>
                  <p className="text-sm text-muted-foreground">Problem, solution, and motivation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <h3 className="font-semibold">Tech Stack & Architecture</h3>
                  <p className="text-sm text-muted-foreground">Complete technology breakdown with justification</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <h3 className="font-semibold">System Flow</h3>
                  <p className="text-sm text-muted-foreground">Step-by-step data flow diagrams</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <h3 className="font-semibold">Challenges & Solutions</h3>
                  <p className="text-sm text-muted-foreground">Real problems you solved</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <h3 className="font-semibold">Interview Q&A</h3>
                  <p className="text-sm text-muted-foreground">10+ common questions with detailed answers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <h3 className="font-semibold">Presentation Tips</h3>
                  <p className="text-sm text-muted-foreground">Do's and don'ts for freshers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Interview Topics Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Technical</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Why this tech stack?</li>
                    <li>• Authentication & security</li>
                    <li>• Database design decisions</li>
                    <li>• Error handling approach</li>
                    <li>• Testing strategy</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Problem-Solving</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Biggest challenges faced</li>
                    <li>• How you solved them</li>
                    <li>• Scaling considerations</li>
                    <li>• Future improvements</li>
                    <li>• What you'd do differently</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewGuide;
