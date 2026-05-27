const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 SERVE FRONTEND
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 CHAT API
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    console.log("📩 USER MESSAGE:", userMessage);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    // 🔥 DEBUG - KRITIK
    console.log("🔴 OPENROUTER RAW RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    let reply = "Nuk mora përgjigje nga AI.";

    if (data?.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    } else if (data?.error?.message) {
      reply = "ERROR: " + data.error.message;
    }

    res.json({ reply });

  } catch (err) {
    console.log("❌ SERVER ERROR:", err);
    res.status(500).json({ reply: "Server error" });
  }
});

// 🔥 PORT (RAILWAY SAFE)
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on port " + PORT);
});
