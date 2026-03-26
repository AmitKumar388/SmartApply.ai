import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const defaultFrontendUrls = [
  "http://localhost:8080",
  "http://localhost:5173",
  "https://smart-apply-ai-ten.vercel.app",
];

const frontendUrls = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",")
      .map((url) => url.trim())
      .filter(Boolean)
  : process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL.trim()]
    : defaultFrontendUrls;

const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/smart-apply-ai",
  jwtSecret: process.env.JWT_SECRET || "fallback-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  geminiApiKey: process.env.GOOGLE_GEMINI_API_KEY || "",
  frontendUrls,
};

export default config;
