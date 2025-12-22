const express = require("express");
const cors = require("cors");
const tf = require("@tensorflow/tfjs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Basit model
const model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
model.compile({
  loss: "meanSquaredError",
  optimizer: "sgd",
});

// Modeli eğit
async function trainModel() {
  const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor2d([2, 4, 6, 8], [4, 1]);

  await model.fit(xs, ys, { epochs: 100 });
  console.log("✅ Model hazır");
}

trainModel();

// API
app.post("/predict", (req, res) => {
  const { number } = req.body;

  const input = tf.tensor2d([Number(number)], [1, 1]);
  const prediction = model.predict(input);

  res.json({
    input: number,
    prediction: prediction.dataSync()[0],
  });
});

// Server
app.listen(PORT, () => {
  console.log(` Server çalışıyor: http://localhost:${PORT}`);
});
