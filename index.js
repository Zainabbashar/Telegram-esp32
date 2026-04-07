const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = "8397071425:AAG8n8ghvexw09f7MDIFDwKcs0_n1e7hYkQ";
const CHAT_ID = "5488963789";
const OPENAI_API_KEY = process.env.OPENAI_KEY;

// ===== TELEGRAM SEND =====
async function sendToTelegram(message) {
  await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: message
  });
}

// ===== AI FUNCTION =====
async function askAI(question) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a bilingual medical assistant. Detect the language of the question and reply ONLY in that same language. Keep answers short, clear, and safe for patients."
          },
          {
            role: "user",
            content: question
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    return "AI error";
  }
}

// ===== MAIN ENDPOINT =====
app.post("/send", async (req, res) => {

  const message = req.body.message;

  try {

    // 1️⃣ دائماً أرسل الرسالة إلى Telegram
    await sendToTelegram("📩 " + message);

    // 2️⃣ AI يشتغل فقط إذا الرسالة سؤال
    const isQuestion =
      message.includes("?") ||
      message.toLowerCase().includes("what") ||
      message.toLowerCase().includes("how") ||
      message.includes("شنو") ||
      message.includes("ليش") ||
      message.includes("دواء") ||
      message.includes("medicine");

    if (isQuestion) {
      const aiReply = await askAI(message);

      await sendToTelegram("🤖 AI Answer:\n" + aiReply);
    }

    res.json({ status: "ok" });

  } catch (err) {
    res.status(500).json({ error: "failed" });
  }
});

// ===== TEST =====
app.get("/", (req, res) => {
  res.send("AI Medical Server Running");
});

app.listen(3000, () => console.log("Server running"));
