// Node.js http modülünü dahil et
const http = require('http');
const fs = require('fs');

// Server port numarası
const PORT = 3000;

// HTTP server oluştur
const server = http.createServer(function(req, res) {
    // Ana sayfa istendi
    if (req.url === '/' || req.url === '/seyma_koltuklu/index.html') {
        // HTML dosyasını oku
        fs.readFile('seyma_koltuklu/index.html', function(err, data) {
            if (err) {
                res.writeHead(404);
                res.end('Dosya bulunamadi');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            }
        });
    } 
    // Gorsel kaydetme istegi
    else if (req.method === 'POST' && req.url === '/save-image') {
        // CORS header'lari ekle
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        
        let body = '';
        
        // Veriyi topla
        req.on('data', function(chunk) {
            body += chunk.toString();
        });
        
        // Veri tamamen geldiginde
        req.on('end', function() {
            try {
                const data = JSON.parse(body);
                const fileName = data.fileName;
                const tarih = new Date().toLocaleString('tr-TR');
                
                // Log mesaji olustur
                const logMesaj = tarih + ' - ' + fileName + '\n';
                
                // log.txt dosyasina ekle
                fs.appendFile('seyma_koltuklu/log.txt', logMesaj, function(err) {
                    if (err) {
                        res.writeHead(500);
                        res.end(JSON.stringify({ error: 'Log yazilamadi' }));
                    } else {
                        res.writeHead(200);
                        res.end(JSON.stringify({ 
                            message: 'Log kaydedildi: ' + fileName 
                        }));
                        console.log('Log yazildi: ' + logMesaj.trim());
                    }
                });
            } catch(err) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Gecersiz veri' }));
            }
        });
    } 
    else {
        res.writeHead(404);
        res.end('Sayfa bulunamadi');
    }
});

// Server'ı başlat
server.listen(PORT, function() {
    console.log('Server calisiyor: http://localhost:' + PORT);
});
