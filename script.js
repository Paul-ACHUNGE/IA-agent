const chatMessage = document.getElementById('chat-message');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
function addMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    chatMessage.appendChild(messageDiv);
    chatMessage.scrollTop = chatMessage.scrollHeight;
}
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;
    addMessage(userMessage, true);
    userInput.value = '';
    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });
        const data = await response.json();
        addMessage(data.response, false);
    } catch (error) {
        console.error('Error:', error);
        addMessage('Erreur lors de l\'envoi du message.', false);
    }
}
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});