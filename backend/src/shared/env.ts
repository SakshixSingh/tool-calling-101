import { z } from "zod";

const envSchema = z.object({
    PORT: z.string().default("3000"),
    ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
    MODEL_PROVIDER: z.enum(["groq", "gemini"]).default("groq"),
    GROQ_API_KEY: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
    GROQ_MODEL: z.string().default("llama-3.1-8b-instant"),
    GEMINI_MODEL: z.string().default("gemini-2.0-flash-lite"),
    SEARCH_PROVIDER: z.string().default("tavily"),
    TAVILY_API_KEY: z.string().optional(),
});

// Accept GOOGLE_API_KEY as an alias for GEMINI_API_KEY (common .env naming)
const envInput = {
    ...process.env,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY,
};

export const env = envSchema.parse(envInput);