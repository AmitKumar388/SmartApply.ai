const envApiUrl = import.meta.env.VITE_API_URL?.trim();

// Never call localhost from a deployed frontend. In production, default to same-origin /api.
const API_URL = (
  envApiUrl || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api")
).replace(/\/$/, "");

const getToken = () => localStorage.getItem("token");

const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};

// Upload form data (for file uploads)
const uploadRequest = async (endpoint: string, formData: FormData) => {
  const token = getToken();

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data;
};

// ---- Auth ----
export const authApi = {
  signup: (email: string, password: string, fullName?: string) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName }),
    }),

  login: (email: string, password: string) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request("/auth/me"),
};

// ---- Profile ----
export const profileApi = {
  get: () => request("/profile"),

  update: (data: Record<string, unknown>) =>
    request("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updateSettings: (data: Record<string, unknown>) =>
    request("/profile/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return uploadRequest("/profile/avatar", formData);
  },
};

// ---- Job Applications ----
export const applicationsApi = {
  list: () => request("/applications"),

  create: (data: {
    companyName: string;
    jobTitle: string;
    status?: string;
    notes?: string;
    appliedDate?: string;
  }) =>
    request("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: string,
    data: {
      companyName?: string;
      jobTitle?: string;
      status?: string;
      notes?: string;
    },
  ) =>
    request(`/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) => request(`/applications/${id}`, { method: "DELETE" }),
};

// ---- Interview Questions ----
export const interviewsApi = {
  listSaved: () => request("/interviews"),

  generate: (jobRole: string, companyName?: string) =>
    request("/interviews/generate", {
      method: "POST",
      body: JSON.stringify({ jobRole, companyName }),
    }),

  saveAnswer: (
    id: string,
    data: { userAnswer?: string; aiSuggestion?: string },
  ) =>
    request(`/interviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteAnswer: (id: string) =>
    request(`/interviews/${id}/answer`, { method: "DELETE" }),
};

// ---- Resumes ----
export const resumesApi = {
  list: () => request("/resumes"),

  create: (data: { title: string; content?: string; fileType?: string }) =>
    request("/resumes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  upload: (file: File) => {
    const formData = new FormData();
    formData.append("resume", file);
    return uploadRequest("/resumes/upload", formData);
  },

  analyze: (id: string) =>
    request(`/resumes/${id}/analyze`, { method: "POST" }),

  getAnalysis: (id: string) => request(`/resumes/${id}/analysis`),

  getAllAnalyses: () => request("/resumes/analyses/all"),

  delete: (id: string) => request(`/resumes/${id}`, { method: "DELETE" }),
};

// ---- Optimizations ----
export const optimizationsApi = {
  list: () => request("/optimizations"),

  create: (resumeContent: string, jobDescription: string) =>
    request("/optimizations", {
      method: "POST",
      body: JSON.stringify({ resumeContent, jobDescription }),
    }),

  delete: (id: string) => request(`/optimizations/${id}`, { method: "DELETE" }),
};

// ---- Dashboard ----
export const dashboardApi = {
  getStats: () => request("/dashboard/stats"),
  getActivity: () => request("/dashboard/activity"),
};

export { API_URL, getToken };
