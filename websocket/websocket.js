const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let users = [];

wss.on('connection', (ws) => {
    // Add the new user to the list
    users.push(ws);

    // When a message is received from a user
    ws.on('message', (message) => {
        // Convert buffer to string
        const messageStr = message.toString();

        // Parse the string as JSON
        const parsedMessage = JSON.parse(messageStr);

        // console.log('Parsed Message:', parsedMessage);
        // console.log(message);
        
        // Broadcast the message to the other user
        users.forEach(user => {
            if (user !== ws) {
                user.send(parsedMessage.message);
            }
        });
    });

    // Remove the user when they disconnect
    ws.on('close', () => {
        users = users.filter(user => user !== ws);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
