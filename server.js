const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// frontend
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

console.log("🚀 Server started");
console.log("KEY EXISTS:", !!process.env.OPENROUTER_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.json({ reply: "Missing API key" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://al-bot.app",
        "X-Title": "AL-BOT"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Përdor gjuhën e përdoruesit automatikisht dhe përgjigju në të njëjtën gjuhë."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    let reply = "No response";

    if (data?.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    } else if (data?.error?.message) {
      reply = "ERROR: " + data.error.message;
    }

    res.json({ reply });

  } catch (err) {
    res.json({ reply: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Running on", PORT);
});
