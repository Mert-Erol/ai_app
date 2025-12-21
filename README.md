# Resim-dedektor — Örnek Node + TensorFlow.js Uygulaması

Bu proje, bir Node (Express) sunucusunun statik dosya servis ettiği ve tarayıcı içinde TensorFlow.js (MobileNet ve MoveNet) kullanılarak resim üzerinde nesne tespiti ve iskelet çizimi yapan örnek bir uygulamadır.

## Gereksinimler
- Node.js (tercihen LTS, ör. 18 veya 20)
- npm

## Nasıl çalıştırılır
1. Proje dizininde bağımlılıkları yükleyin:

   npm install

2. Sunucuyu başlatın:

   npm start

3. Tarayıcıda açın:

   http://localhost:3000

Not: Bu örnek, TensorFlow ve MobileNet modellerini tarayıcı tarafında yükler (CDN üzerinden). Bu sayede `@tensorflow/tfjs-node` gibi native bağımlılıklara ihtiyaç duyulmaz ve Windows'ta derleme sorunları yaşanmaz.

## Sorunlar
- Eğer `npm install` sırasında `@tensorflow/tfjs-node` gibi modüller kurulmaya çalışırsa ve hata alırsanız, bu proje tarayıcı-side TF.js ile çalışacak şekilde tasarlanmıştır, bu yüzden `@tensorflow/tfjs-node` kurulumunu atlayabilirsiniz.

## Test & Çalıştırma Notları
- Sunucuyu başlatmak için terminalde `npm start` veya `node server.js` komutunu çalıştırın ve ardından `http://localhost:3000` adresini bir tarayıcıda açın.
- Tarayıcı açıldığında bir resim yükleyin ve "Analiz Et" butonuna tıklayın; sonuçlar sayfada görünecektir.
- Eğer sunucu çalışmıyorsa veya `Server started` mesajı görünüp sayfaya bağlanamıyorsanız, terminalde `node server.js` komutunu manuel olarak çalıştırıp aynı terminal penceresini açık bırakın (bazı ortamlarda arka planda başlatılan süreçler otomatik kapanabiliyor).

---
