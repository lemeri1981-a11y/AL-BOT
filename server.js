const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 FRONTEND
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 START LOGS
console.log("🚀 Server starting...");
console.log("🔑 OPENROUTER KEY EXISTS:", !!process.env.OPENROUTER_API_KEY);
console.log("🔑 KEY PREVIEW:", process.env.OPENROUTER_API_KEY?.slice(0, 10));

// 🔥 CHAT API
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // ❌ CHECK KEY
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        reply: "OPENROUTER_API_KEY mungon në Railway Variables"
      });
    }

    // 🔥 SYSTEM PROMPT (AUTO LANGUAGE)
    const systemPrompt = {
      role: "system",
      content: "Ti je një asistent inteligjent shumëgjuhësh. Zbulo automatikisht gjuhën e përdoruesit dhe përgjigju në të njëjtën gjuhë. Nëse përdoruesi shkruan shqip, përgjigju shqip; nëse shkruan anglisht, përgjigju anglisht; nëse përdor gjuhë tjetër, përdor atë gjuhë. Ji i qartë, natyral dhe i saktë."
    };

    // 🔥 REQUEST TO OPENROUTER
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
          systemPrompt,
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    console.log("🔴 OPENROUTER RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    // 🔥 SAFE RESPONSE
    let reply = "Nuk mora përgjigje nga AI.";

    if (data?.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    } else if (data?.error?.message) {
      reply = "ERROR: " + data.error.message;
    }

    res.json({ reply });

  } catch (err) {
    console.log("❌ SERVER ERROR:", err);

    res.status(500).json({
      reply: "Server error: " + err.message
    });
  }
});

// 🔥 PORT (RAILWAY SAFE)
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Running on port:", PORT);
});
