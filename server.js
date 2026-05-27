const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const MEMORY_FILE = path.join(__dirname, "memory.json");

// 🔥 load memory
function loadMemory() {
  try {
    if (!fs.existsSync(MEMORY_FILE)) {
      fs.writeFileSync(MEMORY_FILE, "[]");
      return [];
    }
    return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf-8") || "[]");
  } catch {
    return [];
  }
}

// 🔥 save memory
function saveMemory(data) {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("Save error:", e);
  }
}

let memory = loadMemory();

// root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message || "";

    memory.push({ role: "user", content: message });
    memory = memory.slice(-15);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        temperature: 0.2,

        messages: [
          {
            role: "system",
            content: "Je një asistent i thjeshtë. Përgjigju vetëm në shqip. Jep përgjigje të shkurtra (1-2 fjali). Mos supozo gjëra që nuk i di. Nëse nuk je i sigurt, thuaj 'Nuk e di'."
          },
          ...memory
        ]
      })
    });

    const data = await response.json();

    let reply = data?.choices?.[0]?.message?.content || "Gabim me AI";

    memory.push({ role: "assistant", content: reply });
    memory = memory.slice(-15);

    saveMemory(memory);

    res.json({ reply });

  } catch (err) {
    console.log("ERROR:", err);
    res.json({ reply: "Gabim me server" });
  }
});

// 🔥 IMPORTANT: PORT for hosting
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server ON on port " + PORT));