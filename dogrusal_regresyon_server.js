const express = require('express');
const tf = require('@tensorflow/tfjs');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
// ---------------------------------------

app.use(express.json());

app.use(express.json());

// Yapay Zeka Modeli Fonksiyonu
async function runModel(inputValue) {
    // 1. Modeli oluştur
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    // 2. Modeli derle (Hata hesaplama ve optimize etme yöntemi)
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    // 3. Eğitim verileri (Örnek: -1 verince -3 çıkmalı, 0 verince -1 çıkmalı)
    // İlişki: Y = 2X - 1
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    // 4. Modeli eğit (Epochs: tur sayısı)
    await model.fit(xs, ys, { epochs: 250 });

    // 5. Tahmin et
    const prediction = model.predict(tf.tensor2d([inputValue], [1, 1]));
    
    // Sonucu al
    const result = prediction.dataSync()[0];
    
    // Temizlik (Memory leak olmaması için)
    xs.dispose(); ys.dispose(); prediction.dispose(); model.dispose();

    return result;
}

// Endpoint
app.get('/predict', async (req, res) => {
    const val = parseFloat(req.query.val || 10);
    const prediction = await runModel(val);
    
    res.json({
        girdi: val,
        tahmin: prediction,
        not: "Model Y = 2X - 1 formülünü öğrenmeye çalıştı."
    });
});

app.listen(PORT, () => { 
    console.log(`Sunucu çalışıyor: http://localhost:3000/predict?val=10`);
});