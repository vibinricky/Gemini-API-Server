import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ✅ Root route
app.get("/", (_, res) => {
    const keyLoaded = !!process.env.GEMINI_API_KEY;
    res.send(`✅ Gemini API is running!<br>API Key loaded: ${keyLoaded}`);
});

// ✅ Secure POST endpoint
app.post("/api/chat", async (req, res) => {
    try {
        // Check for password header
        const clientPassword = req.headers["x-api-password"];
        if (clientPassword !== process.env.API_PASSWORD) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Invalid password" });
        }

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
);
