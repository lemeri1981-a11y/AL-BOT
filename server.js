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

// 🔥 CHAT API (SUPER SIMPLE)
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    console.log("📩 USER:", userMessage);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // 🔥 MODEL I FIKSUAR (NUK E PREK MË)
        model: "meta-llama/llama-3.1-8b-instruct:free",

        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    console.log("🤖 RESPONSE:", JSON.stringify(data));

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "Nuk mora përgjigje nga AI.";

    res.json({ reply });

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({ reply: "Server error" });
  }
});

// 🔥 PORT (RAILWAY)
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on port " + PORT);
});
