const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = "PUT_YOUR_BOT_TOKEN";
const CHAT_ID = "PUT_YOUR_CHAT_ID";

app.post("/send", async (req, res) => {
  const message = req.body.message;

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message
    });

    res.send("Message sent");
  } catch (error) {
    res.status(500).send("Error");
  }
});

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.listen(3000, () => console.log("Server running"));