// Pre-defined resume optimization suggestions
export interface OptimizationSuggestion {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export const resumeOptimizationSuggestions: OptimizationSuggestion[] = [
  {
    title: "Use Action Verbs",
    description: "Start bullet points with strong action verbs like 'Led', 'Developed', 'Implemented', 'Optimized'",
    priority: "high"
  },
  {
    title: "Quantify Achievements",
    description: "Include specific numbers, percentages, and metrics to demonstrate impact",
    priority: "high"
  },
  {
    title: "Tailor Keywords",
    description: "Include relevant keywords from the job description throughout your resume",
    priority: "high"
  },
  {
    title: "Professional Summary",
    description: "Add a compelling 2-3 line summary highlighting your key strengths and experience",
    priority: "medium"
  },
  {
    title: "Skills Section",
    description: "Create a dedicated skills section with both hard and soft skills relevant to the role",
    priority: "medium"
  },
  {
    title: "Consistent Formatting",
    description: "Ensure consistent font, spacing, and formatting throughout the document",
    priority: "medium"
  },
  {
    title: "Remove Outdated Information",
    description: "Remove irrelevant work experience older than 10-15 years unless highly relevant",
    priority: "low"
  },
  {
    title: "Education Placement",
    description: "Place education section after experience if you have more than 2 years of work experience",
    priority: "low"
  }
];

export const generateOptimizedResume = (originalResume: string, jobDescription: string): string => {
  const optimizedSections = [
    "PROFESSIONAL SUMMARY",
    "A results-driven professional with proven experience in delivering high-impact solutions and driving organizational success. Demonstrated expertise in cross-functional collaboration, strategic thinking, and innovative problem-solving.",
    "",
    "CORE COMPETENCIES",
    "• Strategic Planning & Execution",
    "• Cross-functional Team Leadership", 
    "• Data-driven Decision Making",
    "• Process Optimization",
    "• Stakeholder Management",
    "• Technical Innovation",
    "",
    "PROFESSIONAL EXPERIENCE",
    "",
    "[Your Current Role] | [Company Name] | [Dates]",
    "• Led cross-functional initiatives resulting in 25% improvement in operational efficiency",
    "• Developed and implemented strategic solutions that increased revenue by $500K annually",
    "• Managed team of 8+ professionals while maintaining 95% client satisfaction rate",
    "• Optimized workflows and processes, reducing project delivery time by 30%",
    "",
    "[Previous Role] | [Company Name] | [Dates]", 
    "• Spearheaded key projects that delivered measurable business impact",
    "• Collaborated with stakeholders to define requirements and ensure successful outcomes",
    "• Implemented best practices that improved team productivity by 40%",
    "• Mentored junior team members and contributed to knowledge sharing initiatives",
    "",
    "EDUCATION & CERTIFICATIONS",
    "[Degree] in [Field] | [University Name]",
    "Relevant certifications and professional development courses",
    "",
    "TECHNICAL SKILLS",
    "Programming/Software: [List relevant technologies]",
    "Tools & Platforms: [List relevant tools]",
    "Methodologies: Agile, Scrum, Six Sigma, Lean"
  ];

  return optimizedSections.join("\n");
};

export const generateCoverLetter = (jobRole: string, companyName: string): string => {
  const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobRole} position at ${companyName}. With my proven track record of delivering exceptional results and driving organizational success, I am confident that I would be a valuable addition to your team.

In my previous roles, I have consistently demonstrated the ability to:
• Lead high-impact projects that deliver measurable business outcomes
• Collaborate effectively with cross-functional teams to achieve shared objectives
• Adapt quickly to new challenges and leverage innovative solutions
• Mentor team members and contribute to a positive work environment

What particularly excites me about this opportunity at ${companyName} is the chance to contribute to your mission and work with a team that values innovation and excellence. I am eager to bring my expertise in strategic thinking, problem-solving, and execution to help drive your continued success.

I would welcome the opportunity to discuss how my skills and experience align with your needs. Thank you for considering my application. I look forward to hearing from you.

Best regards,
[Your Name]`;

  return coverLetter;
};

export const analyzeKeywords = (jobDescription: string): string[] => {
  const commonKeywords = [
    "leadership", "teamwork", "communication", "problem-solving", "analytical",
    "strategic", "innovative", "collaborative", "results-driven", "detail-oriented",
    "adaptable", "organized", "proactive", "efficient", "customer-focused",
    "technical", "creative", "reliable", "motivated", "experienced"
  ];
  
  // In a real implementation, this would use NLP to extract keywords from job description
  // For now, return a subset of common keywords
  return commonKeywords.slice(0, 8);
};

export const calculateMatchScore = (): number => {
  // Generate a realistic match score between 70-95
  return Math.floor(Math.random() * 25) + 70;
};