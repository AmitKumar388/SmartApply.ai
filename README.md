# 🚀 SmartApply.AI

**SmartApply.AI** is a full-stack, AI-powered job application assistant that helps users tailor resumes and cover letters, practice interviews, and track job applications – all from one intuitive dashboard.

---

## 📌 Features

- ✨ **AI Resume Optimizer**
  - Upload your resume (PDF/DOCX)
  - Paste job description
  - Get tailored resume, cover letter, and match score using OpenAI GPT-4

- 🧠 **AI Interview Practice**
  - Generate STAR-based questions & sample answers based on job title
  - Save and revisit questions

- 📊 **Application Tracker**
  - Add job entries with notes
  - Track progress (Applied, Interviewing, Rejected, Offer)

- 🌐 **Portfolio Builder**
  - Auto-generate a portfolio using resume data
  - Editable sections (Projects, Skills, Experience)
  - Shareable public link

- 🔐 **User Authentication**
  - Secure login/signup using JWT
  - Passwords hashed using bcrypt
  - Protected dashboard routes

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Frontend     | React.js + TailwindCSS + TypeScript |
| Backend      | Supabase, Node.js, Express.js       |
| AI Engine    | Google Gemini via API               |
| File Parsing | `pdfplumber`, `python-docx`         |
| Auth         | JWT + bcrypt                        |
| Database     | MongoDB                             |
| Deployment   | Vercel(Frontend), Render(Backend)   |

---

## 📁 Project Structure

---

## ⚙️ Deployment Env Setup

If frontend is deployed on Vercel and backend on Render, set these env vars:

- `Vercel (Frontend)`
  - `VITE_API_URL=https://<your-render-service>.onrender.com/api`

- `Render (Backend)`
  - `FRONTEND_URL=https://smart-apply-ai-ten.vercel.app`
  - Optional: `FRONTEND_URLS=https://smart-apply-ai-ten.vercel.app,http://localhost:8080`
  - `PORT=5000` (or keep Render default)

Without `VITE_API_URL`, production builds may fall back to local endpoints in older code and fail with CORS / loopback errors.
