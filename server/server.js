// server.js - Servidor WebSocket en Node.js 
const { WebSocketServer } = require('ws'); 
const http = require('http'); 
const fs = require('fs');
const path = require('path');
  
const PORT = process.env.PORT || 8080; 
  
// Servidor HTTP base (requerido por OpenShift para health checks) 
const httpServer = http.createServer((req, res) => { 
  if (req.url === '/health') { 
    res.writeHead(200, { 'Content-Type': 'application/json' }); 
    res.end(JSON.stringify({ status: 'ok', connections: wss.clients.size })); 
  } else { 
    const clientPath = path.join(__dirname, 'index.html');
    fs.readFile(clientPath, (err, data) => {
      if (err) {
        let debugInfo = "Error desconocido";
        try { debugInfo = fs.readdirSync(__dirname).join(', '); } catch(e) {}
        res.writeHead(500, { 'Content-Type': 'text/plain' }); 
        return res.end(`Error al leer archivo.\nBuscando en: ${clientPath}\nArchivos en carpeta: ${debugInfo}\nCausa: ${err.message}`);
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } 
}); 
  
// Crear servidor WebSocket sobre HTTP 
const wss = new WebSocketServer({ server: httpServer }); 
  
// Evento: nueva conexión de cliente 
wss.on('connection', (ws, req) => { 
  const clientId = Date.now(); 
  const ip = req.socket.remoteAddress; 
  console.log(`[${new Date().toISOString()}] Cliente conectado: ${clientId} desde ${ip}`); 
  
  // Mensaje de bienvenida al cliente recién conectado 
  ws.send(JSON.stringify({ 
    tipo: 'bienvenida', 
    mensaje: `Bienvenido al servidor WebSocket. Tu ID es: ${clientId}`, 
    timestamp: new Date().toISOString() 
  })); 
  
  // Broadcast a todos los demás clientes 
  broadcast(wss, ws, JSON.stringify({ 
    tipo: 'sistema', 
    mensaje: `Nuevo cliente conectado (ID: ${clientId})`, 
    timestamp: new Date().toISOString() 
  })); 
  
  // Evento: mensaje recibido del cliente 
  ws.on('message', (data) => { 
    try { 
      const msg = JSON.parse(data.toString()); 
      console.log(`[MSG] Cliente ${clientId}: ${JSON.stringify(msg)}`); 
  
      // Reenviar a todos los clientes (broadcast) 
      const textoLimpio = msg.texto || data.toString();
      const respuesta = JSON.stringify({ 
        tipo: 'mensaje', 
        clienteId: clientId, 
        contenido: `<span style="font-size:11px; font-weight:bold; color:#E63946; margin-bottom:4px; display:block;">🗣️ ID ${clientId}</span>${textoLimpio}`, 
        timestamp: new Date().toISOString() 
      }); 
      broadcast(wss, null, respuesta); 
    } catch (e) { 
      ws.send(JSON.stringify({ tipo: 'error', mensaje: 'Formato JSON inválido' })); 
    } 
  }); 
  
  // Evento: cliente desconectado 
  ws.on('close', (code, reason) => { 
    console.log(`[CLOSE] Cliente ${clientId} desconectado. Código: ${code}`); 
    broadcast(wss, null, JSON.stringify({ 
      tipo: 'sistema', 
      mensaje: `Cliente ${clientId} se desconectó`, 
      timestamp: new Date().toISOString() 
    })); 
  }); 
  
  ws.on('error', (err) => console.error(`[ERROR] ${clientId}: ${err.message}`)); 
}); 
  
// Función broadcast: envía mensaje a todos (o todos excepto 'excludeWs') 
function broadcast(wss, excludeWs, message) { 
  wss.clients.forEach(client => { 
    if (client !== excludeWs && client.readyState === 1) { 
      client.send(message); 
    } 
  }); 
} 
// Iniciar servidor 
httpServer.listen(PORT, () => { 
console.log(`Servidor WebSocket escuchando en puerto ${PORT}`); 
console.log(`Health check: http://localhost:${PORT}/health`); 
});
