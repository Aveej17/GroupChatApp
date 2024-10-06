window.addEventListener("DOMContentLoaded", async () => {
    getmessages();   
    setInterval(async () => {
        // Clear existing messages (this depends on how you're storing them)
        clearMessages();
        
        // Fetch and display messages
        await getmessages();
    }, 5000); 
});

function clearMessages() {
    // Assuming you have a container where messages are displayed
    const messageContainer = document.getElementById('chatWindow'); // Replace with your actual container ID
    if (messageContainer) {
        messageContainer.innerHTML = ''; // Clear existing messages
    }
}



async function getmessages() {
    try {
        const token = localStorage.getItem("token");

        // Retrieve existing chats from local storage and parse
        let existingChats = JSON.parse(localStorage.getItem("chats")) || [];
        
        // Get the last chat ID
        const lastChatId = existingChats.length ? existingChats[existingChats.length - 1].id : null; // Assuming chat object has an 'id' property

        
        // Make an API call to fetch new messages, if there's a lastChatId
        let response;
        if (lastChatId) {
            response = await axios.get(`http://127.0.0.1:3000/chats/getNew?lastId=${lastChatId}`, {
                headers: { Authorization: 'Bearer ' + token }
            });
        } else {
            // If no existing chats, get all chats
            response = await axios.get("http://127.0.0.1:3000/chats/getAll", {
                headers: { Authorization: 'Bearer ' + token }
            });
        }

        if (response.data.success) {
            // Merge new messages with existing chats
            const newChats = response.data.chat; // Assuming response has an array of chats
            const mergedChats = [...existingChats, ...newChats];

            // Keep only the latest 100 messages
            const latestChats = mergedChats.slice(-100);

            // Update local storage
            localStorage.setItem("chats", JSON.stringify(latestChats));

            // Update the chat window
            const chatWindow = document.getElementById("chatWindow");
            chatWindow.innerHTML = ''; // Clear existing messages
            latestChats.forEach(chat => {
                const chatMessage = document.createElement("div");
                chatMessage.classList.add("chat-message");
                chatMessage.textContent = `${chat.name} : ${chat.content}`; // Format username : content
                chatWindow.appendChild(chatMessage);
            });
        }
    } catch (error) {
        console.log("Error Loading Chats: " + error);
    }
}

// async function getmessages(){
//     try {
//         const token = localStorage.getItem("token");
//         // console.log("Token: ", token);

//         const response = await axios.get("http://127.0.0.1:3000/chats/getAll", {
//             headers: { Authorization: 'Bearer ' + token }
//         });
//         // console.log(response.data.chat);
//         localStorage.setItem("chats", response.data.chat);
        
//         const chatWindow = document.getElementById("chatWindow");

//         if (response.data.success) {
//             const chats = response.data.chat; // Assuming response has an array of chats
//             chats.forEach(chat => {
//                 // Create a div for each chat message
//                 const chatMessage = document.createElement("div");
//                 chatMessage.classList.add("chat-message");
//                 chatMessage.textContent = `${chat.name} : ${chat.content}`; // Format username : content

//                 // Append the message to the chat window
//                 chatWindow.appendChild(chatMessage);
//             });
//         }
//     } catch (error) {
//         console.log("Error Loading Chats: " + error);
//     }
// }

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    try{
        const chatInput = document.getElementById('chatInput');
        const token = localStorage.getItem("token");
        // console.log(chatInput.value.trim());
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


