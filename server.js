const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", (req, res) => {
  res.json({ reply: "Demo AI response" });
});

app.listen(8080, () => console.log("AI-BOT running"));
