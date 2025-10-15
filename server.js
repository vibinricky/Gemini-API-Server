import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("API Key loaded:", !!process.env.GEMINI_API_KEY);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST endpoint
app.post("/api/chat", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Missing prompt" });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("Gemini API error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Quick test route
app.get("/", (_, res) => res.send("✅ Gemini API is running!"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
