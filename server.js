const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 📦 frontend
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

console.log("🚀 Server started");
console.log("🔑 KEY EXISTS:", !!process.env.OPENROUTER_API_KEY);

// 💬 CHAT API
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.json({ reply: "Mungon API key në Railway" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://al-bot.app",
        "X-Title": "Al-BOT"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "system",
            content: "Ti je një asistent inteligjent si ChatGPT. Përgjigju natyrshëm, miqësisht dhe rrjedhshëm. Mos thuaj kurrë që je program kompjuterik ose robot. Mos përdor përgjigje robotike. Përdor gjuhën e përdoruesit automatikisht dhe përgjigju si në bisedë reale."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    console.log("🔴 RESPONSE:", JSON.stringify(data, null, 2));

    let reply = "Nuk mora përgjigje nga AI.";

    if (data?.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    } else if (data?.error?.message) {
      reply = "ERROR: " + data.error.message;
    }

    res.json({ reply });

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.json({ reply: "Server error: " + err.message });
  }
});

// 🚀 PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Running on port:", PORT);
});
