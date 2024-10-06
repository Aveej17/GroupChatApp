window.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem("token");
        console.log("Token: ", token);

        const response = await axios.get("http://127.0.0.1:3000/chats/getAll", {
            headers: { Authorization: 'Bearer ' + token }
        });

        const chatWindow = document.getElementById("chatWindow");

        if (response.data.success) {
            const chats = response.data.chat; // Assuming response has an array of chats
            chats.forEach(chat => {
                // Create a div for each chat message
                const chatMessage = document.createElement("div");
                chatMessage.classList.add("chat-message");
                chatMessage.textContent = `${chat.name} : ${chat.content}`; // Format username : content

                // Append the message to the chat window
                chatWindow.appendChild(chatMessage);
            });
        }
    } catch (error) {
        console.log("Error Loading Chats: " + error);
    }
});

sendButton.addEventListener('click', sendMessage);

async function sendMessage() {
    try{
        const chatInput = document.getElementById('chatInput');
        const token = localStorage.getItem("token");
        console.log(chatInput.value.trim());
        const chatDetails = {
            name:"KL",
            content: chatInput.value.trim()
        }
        chatInput.value = '';
        const response = await axios.post("http://127.0.0.1:3000/chats/create", {chatDetails},{
            headers: { Authorization: 'Bearer ' + token }
        });
        
        
    }
    catch(err){
        console.log(err);
        
    }
}


