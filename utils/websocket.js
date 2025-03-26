const WebSocket = require('ws');

let wss;

// Initialiser le WebSocket Server
const initWebSocket = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connecté via WebSocket');

        // Gérer les messages reçus du client (si nécessaire)
        ws.on('message', (message) => {
            console.log('Message reçu du client:', message);
        });

        // Gérer la déconnexion du client
        ws.on('close', () => {
            console.log('Client déconnecté');
        });
    });
};

// Fonction pour envoyer des notifications à tous les clients connectés
const broadcast = (data) => {
    if (!wss) return;
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

module.exports = { initWebSocket, broadcast };