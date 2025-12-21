const express = require("express");
const Sentiment = require("sentiment");
const path = require("path");
const app = express();
const sentiment = new Sentiment();
const port = 4141;
app.use(express.static(__dirname));
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.post("/analiz", (req, res) => {
  const { metin } = req.body;
  const result = sentiment.analyze(metin);
  let durum = "Nötr";
  let skorYuzde = 0;
  if (result.score > 0) {
    durum = "Pozitif";
    skorYuzde = Math.min(result.score * 20, 100);
  } else if (result.score < 0) {
    durum = "Negatif";
    skorYuzde = Math.min(Math.abs(result.score) * 20, 100);
  }
  res.json({
    metin: metin,
    durum: durum,
    skor: skorYuzde.toFixed(0),
    detaylar: {
      score: result.score,
      comparative: result.comparative.toFixed(2),
      positiveWords: result.positive,
      negativeWords: result.negative,
    },
  });
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
