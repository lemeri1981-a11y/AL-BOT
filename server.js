const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 SERVE FRONTEND (index.html nga /public)
app.use(express.static("public"));

// 🔥 HOME ROUTE (siguri shtesë)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 CHAT API
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    console.log("📩 Message:", userMessage);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Nuk mora përgjigje nga AI.";

    res.json({ reply });

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({ reply: "Server error" });
  }
});

// 🔥 PORT RAILWAY
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on port " + PORT);
});
