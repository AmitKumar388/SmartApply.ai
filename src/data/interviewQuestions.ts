// Pre-defined interview questions for different job roles
export interface QuestionTemplate {
  question: string;
  category: 'behavioral' | 'technical' | 'situational' | 'leadership';
}

export const questionTemplates: Record<string, QuestionTemplate[]> = {
  'software engineer': [
    {
      question: "Tell me about a time you had to debug a complex technical issue under pressure.",
      category: "technical"
    },
    {
      question: "Describe a situation where you had to learn a new technology quickly for a project.",
      category: "behavioral"
    },
    {
      question: "How would you handle a situation where your code review is rejected multiple times?",
      category: "situational"
    },
    {
      question: "Tell me about a time you led a technical initiative or mentored junior developers.",
      category: "leadership"
    },
    {
      question: "Describe a challenging bug you encountered and how you solved it.",
      category: "technical"
    }
  ],
  'product manager': [
    {
      question: "Tell me about a time you had to make a difficult product decision with limited data.",
      category: "situational"
    },
    {
      question: "Describe how you handled a situation where engineering and design disagreed on a feature.",
      category: "leadership"
    },
    {
      question: "Tell me about a product feature you launched that didn't perform as expected.",
      category: "behavioral"
    },
    {
      question: "How would you prioritize features when you have limited development resources?",
      category: "situational"
    },
    {
      question: "Describe a time you had to influence stakeholders without direct authority.",
      category: "leadership"
    }
  ],
  'data scientist': [
    {
      question: "Tell me about a time your analysis led to an unexpected business insight.",
      category: "behavioral"
    },
    {
      question: "Describe how you would handle missing or dirty data in a critical project.",
      category: "technical"
    },
    {
      question: "Tell me about a time you had to explain complex statistical concepts to non-technical stakeholders.",
      category: "situational"
    },
    {
      question: "Describe a machine learning project where the initial model performed poorly.",
      category: "technical"
    },
    {
      question: "How would you approach building a recommendation system from scratch?",
      category: "technical"
    }
  ],
  'marketing manager': [
    {
      question: "Tell me about a marketing campaign that didn't meet expectations and how you handled it.",
      category: "behavioral"
    },
    {
      question: "Describe how you would launch a product in a completely new market.",
      category: "situational"
    },
    {
      question: "Tell me about a time you had to work with a limited budget to achieve ambitious goals.",
      category: "leadership"
    },
    {
      question: "How would you measure the success of a brand awareness campaign?",
      category: "technical"
    },
    {
      question: "Describe a time you had to pivot your marketing strategy mid-campaign.",
      category: "behavioral"
    }
  ],
  'sales representative': [
    {
      question: "Tell me about a time you lost a big deal and what you learned from it.",
      category: "behavioral"
    },
    {
      question: "Describe how you would approach selling to a completely new industry.",
      category: "situational"
    },
    {
      question: "Tell me about a time you exceeded your sales quota significantly.",
      category: "behavioral"
    },
    {
      question: "How would you handle a situation where a client is unhappy with your product?",
      category: "situational"
    },
    {
      question: "Describe a time you had to work with a difficult team member to close a deal.",
      category: "leadership"
    }
  ],
  'default': [
    {
      question: "Tell me about a time you faced a significant challenge and how you overcame it.",
      category: "behavioral"
    },
    {
      question: "Describe a situation where you had to work with a difficult team member.",
      category: "behavioral"
    },
    {
      question: "Tell me about a time you had to learn something new quickly.",
      category: "behavioral"
    },
    {
      question: "Describe a project you led and what your strategy was.",
      category: "leadership"
    },
    {
      question: "Tell me about a decision you made with incomplete information.",
      category: "situational"
    }
  ]
};

export const getQuestionsForRole = (jobRole: string): QuestionTemplate[] => {
  const normalizedRole = jobRole.toLowerCase().trim();
  
  // Try to find exact match first
  if (questionTemplates[normalizedRole]) {
    return questionTemplates[normalizedRole];
  }
  
  // Try to find partial matches
  for (const role in questionTemplates) {
    if (normalizedRole.includes(role) || role.includes(normalizedRole)) {
      return questionTemplates[role];
    }
  }
  
  // Return default questions if no match found
  return questionTemplates.default;
};