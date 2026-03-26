import { interviewsApi, optimizationsApi } from "./api";

// Calls backend API for interview questions
export const generateInterviewQuestions = async (
  jobRole: string,
  companyName?: string,
) => {
  const data = await interviewsApi.generate(jobRole, companyName);
  return data.questions;
};

// Calls backend API for resume optimization
export const optimizeResume = async (
  resumeContent: string,
  jobDescription: string,
) => {
  const data = await optimizationsApi.create(resumeContent, jobDescription);
  return data;
};

// Simple placeholder for STAR answers (client-side only)
export const generateAnswer = async (question: string, context?: string) => {
  return `This is a sample STAR method answer for the question: "${question}".

Situation: Describe a situation.
Task: Explain what needed to be done.
Action: Detail what you did.
Result: Share the outcome.

${context ? `Extra context: ${context}` : ""}`;
};
