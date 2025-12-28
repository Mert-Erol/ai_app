// Node.js http modülünü dahil et
const http = require('http');
const fs = require('fs');
const crypto = require('crypto');

const PORT = 3000;

const SECRET_KEY = "gizli_anahtar";

function createToken(payload){
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const signature = crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${data}`).digest('base64url');

  return `${header}.${data}.${signature}`;
}

function verifyToken(token){
  const [header, data, signature] = token.split('.');
  if(!header || !data || !signature){
    return null;
  }

  const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${data}`).digest('base64url');
  if(signature === expectedSignature){
    return JSON.parse(Buffer.from(data, 'base64url').toString());
  }
  return null;
}

// HTTP server oluştur
const server = http.createServer(function(req, res) {
    // Login endpoint - Token oluştur
    if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        
        req.on('data', function(chunk) {
            body += chunk.toString();
        });
        
        req.on('end', function() {
            try {
                const loginData = JSON.parse(body);
                // Basit kullanıcı kontrolü (gerçek uygulamada veritabanından kontrol edilmeli)
                if (loginData.username && loginData.password) {
                    const userPayload = { 
                        userId: 1, 
                        username: loginData.username, 
                        role: "user" 
                    };
                    const token = createToken(userPayload);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({message: 'Giriş Başarılı!', token}));
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({error: 'Kullanıcı adı ve şifre gerekli'}));
                }
            } catch(err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Geçersiz veri' }));
            }
        });
    }
    // Profile endpoint - Token doğrula
    else if (req.url === '/profile' && req.method === 'GET') {
        const authHeader = req.headers['authorization'];

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({error: 'Token bulunamadı. Yetki hatası'}));
        }

        const token = authHeader.split(' ')[1];
        const userData = verifyToken(token);
        if(userData){
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Profil verisine erişildi', user: userData}));
        }
        else{
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({error: 'Geçersiz token'}));
        }
    }
    // Ana sayfa istendi
    else if (req.url === '/' || req.url === '/index.html') {
        // HTML dosyasını oku
        fs.readFile('index.html', function(err, data) {
            if (err) {
                res.writeHead(404);
                res.end('Dosya bulunamadi');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            }
        });
    } 
    // Gorsel kaydetme istegi (Token korumalı)
    else if (req.method === 'POST' && req.url === '/save-image') {
        // CORS header'lari ekle
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        
        // Token kontrolü
        const authHeader = req.headers['authorization'];
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            res.writeHead(401);
            return res.end(JSON.stringify({error: 'Token bulunamadı. Yetki hatası'}));
        }

        const token = authHeader.split(' ')[1];
        const userData = verifyToken(token);
        if(!userData){
            res.writeHead(403);
            return res.end(JSON.stringify({error: 'Geçersiz token'}));
        }
        
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
                fs.appendFile('log.txt', logMesaj, function(err) {
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
