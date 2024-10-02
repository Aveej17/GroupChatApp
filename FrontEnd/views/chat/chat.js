const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

// Replace with WebSocket or real-time messaging in a real-world application
const socket = new WebSocket('ws://your-backend-server');

// Add event listener to send button
sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Send message to the server
function sendMessage() {
    const message = chatInput.value.trim();
        if (message === '') return;

        // Send message to the server
        socket.send(JSON.stringify({ user: 'self', message }));

        // Display user message
        displayMessage(message, 'user');
            
        // Clear input field
        chatInput.value = '';
}

// Receive message from server (from the other person)
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.user === 'partner') {
        displayMessage(data.message, 'partner');
    }
};

// Display message in the chat window
function displayMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = message;

    messageDiv.appendChild(textDiv);
    chatWindow.appendChild(messageDiv);

    // Scroll to the bottom of the chat window
    chatWindow.scrollTop = chatWindow.scrollHeight;
}