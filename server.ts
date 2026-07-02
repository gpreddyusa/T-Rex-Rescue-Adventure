import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Hardcoded high-quality fallback facts in case Gemini key is missing or calls fail
const FALLBACK_FACTS: Record<string, Array<{ title: string; factText: string; voicePrompt: string; imageUrl: string }>> = {
  volcano: [
    {
      title: "🌋 Bubble-Blowing Volcanoes!",
      factText: "Deep underground, rocks get so hot they melt into liquid soup called magma! When it pushes up, it erupts like a giant, sizzling baking soda science project!",
      voicePrompt: "Dina says: Deep underground, rocks get so hot they melt into liquid soup called magma! When it pushes up, it erupts like a giant, sizzling baking soda science project! Boom!",
      imageUrl: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&auto=format&fit=crop&q=80" // Real erupting volcano with hot glowing lava
    }
  ],
  space: [
    {
      title: "🚀 Floating in Outer Space!",
      factText: "In space, there is no gravity, which means you can float around like a balloon! Astronauts even have to strap their sleeping bags to the wall so they don't drift away!",
      voicePrompt: "Dina says: In space, there is no gravity, which means you can float around like a balloon! Whoosh! Astronauts even have to strap their sleeping bags to the wall so they don't drift away!",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80"
    }
  ],
  dinosaur: [
    {
      title: "🦕 Heavy Dino-Steps!",
      factText: "Some dinosaurs like Brachiosaurus were so heavy that the ground would shake when they walked! Their footprints were as big as a children's swimming pool!",
      voicePrompt: "Dina says: Some dinosaurs like Bracc-ee-o-sore-us were so heavy that the ground would shake when they walked! Thump! Thump! Their footprints were as big as a children's swimming pool!",
      imageUrl: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&auto=format&fit=crop&q=80" // Stunningly realistic dinosaur in ancient fern forest
    }
  ],
  social: [
    {
      title: "🤝 The Sharing Superpower!",
      factText: "When we share toys and use kind words, our brains release happy chemicals that make us feel warm and cozy. High five for being an awesome friend!",
      voicePrompt: "Dina says: When we share toys and use kind words, our brains release happy chemicals that make us feel warm and cozy. Clink! High five for being an awesome friend!",
      imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=80"
    }
  ],
  science: [
    {
      title: "⚡ Hair-Raising Static!",
      factText: "Have you ever rubbed a balloon on your hair and watched it stick to the wall? That is static electricity! Tiny invisible particles called electrons are playing tag on your head!",
      voicePrompt: "Dina says: Have you ever rubbed a balloon on your hair and watched it stick to the wall? Bzzzt! That is static electricity! Tiny invisible particles called electrons are playing tag on your head!",
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80"
    }
  ]
};

const TOPIC_IMAGES: Record<string, string> = {
  volcano: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&auto=format&fit=crop&q=80",
  space: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop&q=80",
  dinosaur: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&auto=format&fit=crop&q=80",
  social: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=80",
  science: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
  animal: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop&q=80"
};

// API Endpoint to dynamically generate kid facts about a specific topic
app.post("/api/fact/generate", async (req, res) => {
  try {
    const { topic } = req.body;
    const targetTopic = (topic || "science").toLowerCase();

    if (!ai) {
      // Return a random pre-defined fallback if Gemini API is not initialized
      const list = FALLBACK_FACTS[targetTopic] || FALLBACK_FACTS["science"];
      const fact = list[Math.floor(Math.random() * list.length)];
      return res.json({
        ...fact,
        topic: targetTopic,
        isFallback: true
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate an incredibly exciting, surprising, and kid-friendly fun fact suitable for a 5-6 year old child. 
The fact must be highly engaging, positive, educational, and easy to digest. 
Topic requested: "${targetTopic}" (such as volcano science, space, dinosaurs, social manners, or nature).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "An exciting, very short title with a relevant emoji, e.g., '🌋 Lava Splash!' or '🦕 Heavy Dino-Steps!'",
            },
            factText: {
              type: Type.STRING,
              description: "The educational fun fact explained simply for a 5-6 year old child using enthusiastic, friendly, and kid-centric words. Limit to 2 or 3 short exciting sentences.",
            },
            voicePrompt: {
              type: Type.STRING,
              description: "Phonetic-friendly version of the fact for speech synthesis. Include friendly dino sounds like 'Rawrr!', happy exclamations, or slow spelling for big words.",
            },
            imageUrlKeywords: {
              type: Type.STRING,
              description: "Simple search keywords to find an image for this topic, e.g. 'volcano eruption close up', 'space nebula stars', 'kids sharing crayons'.",
            }
          },
          required: ["title", "factText", "voicePrompt", "imageUrlKeywords"],
        },
      },
    });

    if (response.text) {
      const result = JSON.parse(response.text.trim());
      // Map to dynamic unsplash images based on topic or keyword
      let imageUrl = TOPIC_IMAGES[targetTopic] || TOPIC_IMAGES["science"];
      if (result.imageUrlKeywords) {
        // Clean the keywords to be URL-safe and search-optimized (comma separated)
        const cleanedKeywords = result.imageUrlKeywords
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "") // remove punctuation
          .split(/\s+/) // split by space
          .filter((w: string) => w.length > 2 && !["the", "and", "for", "with", "from", "that", "this", "some", "easy", "kids"].includes(w))
          .join(",");

        if (cleanedKeywords) {
          imageUrl = `https://images.unsplash.com/featured/800x600/?${encodeURIComponent(cleanedKeywords)}`;
        } else {
          const kw = result.imageUrlKeywords.toLowerCase();
          if (kw.includes("volcano") || kw.includes("lava")) {
            imageUrl = TOPIC_IMAGES["volcano"];
          } else if (kw.includes("space") || kw.includes("star") || kw.includes("planet") || kw.includes("astronaut")) {
            imageUrl = TOPIC_IMAGES["space"];
          } else if (kw.includes("dino") || kw.includes("fossil") || kw.includes("bones")) {
            imageUrl = TOPIC_IMAGES["dinosaur"];
          } else if (kw.includes("friend") || kw.includes("share") || kw.includes("kind") || kw.includes("kids")) {
            imageUrl = TOPIC_IMAGES["social"];
          } else if (kw.includes("science") || kw.includes("electricity") || kw.includes("balloon") || kw.includes("magnets")) {
            imageUrl = TOPIC_IMAGES["science"];
          } else if (kw.includes("animal") || kw.includes("wildlife")) {
            imageUrl = TOPIC_IMAGES["animal"];
          }
        }
      }

      return res.json({
        title: result.title,
        factText: result.factText,
        voicePrompt: result.voicePrompt,
        topic: targetTopic,
        imageUrl,
        isFallback: false
      });
    } else {
      throw new Error("Empty response from Gemini API");
    }
  } catch (error) {
    console.error("Gemini fact generation failed:", error);
    // Fallback gracefully
    const list = FALLBACK_FACTS["science"];
    const fact = list[0];
    res.json({
      ...fact,
      topic: "science",
      isFallback: true
    });
  }
});

// GET /api/tts - High-reliability, CORS-free server-side TTS proxy
app.get("/api/tts", async (req, res) => {
  try {
    const text = (req.query.text as string) || "";
    if (!text.trim()) {
      return res.status(400).send("Text is required");
    }

    // Limit to 200 characters for optimal Google Translate TTS support
    const cleanText = text.substring(0, 200);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

    const response = await fetch(ttsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Referer": "https://translate.google.com/"
      }
    });

    if (!response.ok) {
      throw new Error(`TTS service returned status ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 24 hours
    res.send(buffer);
  } catch (error) {
    console.error("Server TTS endpoint failed:", error);
    res.status(500).send("Error generating text to speech");
  }
});

// Setup Vite Dev Server / Static Asset Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
