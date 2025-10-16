import WebSocket from 'ws';
import net from 'net';

const PORT = process.env.PORT || 8080; // منفذ WebSocket على Koyeb
const SSH_HOST = process.env.SSH_HOST || 'your-ssh-server-ip'; // ضع هنا IP سيرفرك لاحقًا
const SSH_PORT = parseInt(process.env.SSH_PORT) || 80; // المنفذ: 80 / 8080 / 8880

const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws, req) => {
  console.log('Client connected from', req.socket.remoteAddress);

  // إنشاء اتصال TCP إلى سيرفر SSH الخارجي
  const socket = net.connect(SSH_PORT, SSH_HOST);

  socket.on('data', (data) => ws.send(data));
  socket.on('close', () => ws.close());
  socket.on('error', () => ws.close());

  ws.on('message', (msg) => socket.write(msg));
  ws.on('close', () => socket.end());
});

console.log(`WebSocket SSH tunnel running on port ${PORT}`);
