require('dotenv').config(); // Ladda .env-filen

const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const SECRET_CODE = "1234";
const CHAT_FILE = path.join(__dirname, 'chat.json');
const BATCH_SIZE = 20;
const GIPHY_API_KEY = process.env.GIPHY_API_KEY; // Hämta API-nyckel från .env-filen

// Skapa HTTP-server
const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("404 Not Found");
            return;
        }
    
        // Ersätt "{{GIPHY_API_KEY}}" med den faktiska API-nyckeln i HTML-innehållet
        const htmlContent = data.toString().replace('{{GIPHY_API_KEY}}', GIPHY_API_KEY);
    
        res.writeHead(200);
        res.end(htmlContent);
    });
});

// Initialize socket.io
const io = socketIo(server);

let messages = [];

// Läs in befintliga meddelanden
if (fs.existsSync(CHAT_FILE)) {
  const data = fs.readFileSync(CHAT_FILE, 'utf8');
  messages = JSON.parse(data);
}

// Spara meddelanden till fil
const saveMessages = () => {
  fs.writeFileSync(CHAT_FILE, JSON.stringify(messages, null, 2));
};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Skicka initiala meddelanden till den nya användaren
  socket.emit('load messages', messages.slice(-BATCH_SIZE));

  // Hantera begäran om fler meddelanden
  socket.on('load more messages', (start) => {
    const end = start + BATCH_SIZE;
    const moreMessages = messages.slice(Math.max(0, messages.length - end), messages.length - start);
    socket.emit('load more messages', moreMessages);
  });

  // Hantera nytt meddelande
  socket.on('new message', (msg) => {
    messages.push(msg);
    saveMessages();
    io.emit('new message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
