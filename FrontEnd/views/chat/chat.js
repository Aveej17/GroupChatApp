document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const groupId = params.get("groupId"); // Get the groupId from the query parameters
    console.log(groupId);
    
    if (groupId) {
        // Fetch the group details to get the group name
        await loadGroupDetails(groupId);
        // Optionally, you can call a function to load messages for the group
        // setInterval(()=>{
        //     loadGroupMessages(groupId), 10000000
        // })
        loadGroupMessages(groupId);
        
    } else {
        console.error("No groupId provided");
    }
    const chatInput = document.getElementById("chatInput");
    const sendButton = document.getElementById("sendButton");

    chatInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default action (like form submission)
            sendMessage(); // Call the sendMessage function
        }
    });

    sendButton.addEventListener('click', function() {
        sendMessage(); // Call the sendMessage function when the button is clicked
    });

    document.getElementById("backButton").addEventListener("click", () => {
        window.history.back(); // Navigate to the previous page
    });
    await loadGroupUsers(groupId);
});

// Function to load group details
async function loadGroupDetails(groupId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:3000/groups/get/${groupId}`, { // Update this endpoint based on your backend
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();
        // console.log(data);
        
        if (data.success) {
            const chatHeader = document.querySelector(".chat-header");
            chatHeader.innerText = data.group.name; // Update the chat header with the group name
        } else {
            console.error("Failed to load group details.");
        }
    } catch (error) {
        console.error("Error loading group details:", error);
    }
}

// Function to load messages for the specific group
async function loadGroupMessages(groupId) {
    try {
        const token = localStorage.getItem("token");

        // Retrieve existing chats from local storage and parse
        let existingChats = JSON.parse(localStorage.getItem(groupId)) || [];
        // console.log(existingChats);
        
        // Get the last chat ID from existing chats
        const lastChatId = existingChats.length ? existingChats[existingChats.length - 1].id : null;

        // Make an API call to fetch new messages, if there's a lastChatId
        let response;
        // console.log(lastChatId);
        
        if (lastChatId) {
            // Fetch new messages since lastChatId
            response = await axios.get(`http://127.0.0.1:3000/chats/getNew?lastId=${lastChatId}&groupId=${groupId}`, {
                headers: { Authorization: 'Bearer ' + token }
            });
            // console.log(response);
            
        } else {
            // If no existing chats, get all messages for the group
            response = await axios.get(`http://127.0.0.1:3000/chats/getAll/${groupId}`, {
                headers: { Authorization: 'Bearer ' + token }
            });
            // console.log(response);
            
        }

        if (response.data.success) {
            // Merge new messages with existing chats
            const newChats = response.data.messages; // Assuming response has an array of messages
            const mergedChats = [...existingChats, ...newChats];

            // Keep only the latest 100 messages
            const latestChats = mergedChats.slice(-20);

            // Update local storage
            localStorage.setItem("chats", JSON.stringify(latestChats));

            // Update the chat window
            const chatWindow = document.getElementById("chatWindow");
            chatWindow.innerHTML = ''; // Clear existing messages
            latestChats.forEach(chat => {
                const chatMessage = document.createElement("div");
                chatMessage.classList.add("chat-message");
                chatMessage.textContent = `${chat.User.name} : ${chat.content}`; // Format senderName : content
                chatWindow.appendChild(chatMessage);
            });
        }
    } catch (error) {
        console.log("Error Loading Group Messages: " + error);
    }
}



// window.addEventListener("DOMContentLoaded", async () => {
//     getmessages();   
//     setInterval(async () => {
//         // Clear existing messages (this depends on how you're storing them)
//         clearMessages();
        
//         // Fetch and display messages
//         await getmessages();
//     }, 5000); 
// });

// function clearMessages() {
//     // Assuming you have a container where messages are displayed
//     const messageContainer = document.getElementById('chatWindow'); // Replace with your actual container ID
//     if (messageContainer) {
//         messageContainer.innerHTML = ''; // Clear existing messages
//     }
// }


// async function getmessages(){
//     try {
//         const token = localStorage.getItem("token");
//         // console.log("Token: ", token);

//         const response = await axios.get("http://127.0.0.1:3000/chats/getAll", {
//             headers: { Authorization: 'Bearer ' + token }
//         });

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

// sendButton.addEventListener('click', sendMessage);
// chatInput.addEventListener('keypress', function(event) {
//     if (event.key === 'Enter') {
//         sendMessage();
//     }
// });

async function sendMessage() {
    try {
        const token = localStorage.getItem("token");

        const params = new URLSearchParams(window.location.search);
        const groupId = params.get("groupId");

        const messageContent = document.getElementById('chatInput').value;
        const chatDetails = {
            content: messageContent,
            groupId: groupId
        };

        const response = await axios.post('http://127.0.0.1:3000/chats/create', {
            chatDetails: chatDetails
        }, {
            headers: { Authorization: 'Bearer ' + token }
        });

        if (response.data.success) {
            // console.log("Message sent:", response.data.chat);

            // we can reload also

            await loadGroupMessages(groupId);

            // Optionally update the chat window with the new message
            // const chatWindow = document.getElementById("chatWindow");
            // const chatMessage = document.createElement("div");
            // chatMessage.classList.add("chat-message");
            // chatMessage.textContent = `${response.data.chat.User.name} : ${response.data.chat.content}`; // Format username : content
            // chatWindow.appendChild(chatMessage);

        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// async function loadGroupUsers(groupId) {
//     try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(`http://127.0.0.1:3000/groups/${groupId}/users`, {
//             headers: { Authorization: 'Bearer ' + token }
//         });

//         const userList = document.getElementById("userList");
//         userList.innerHTML = ''; // Clear existing users

//         response.data.users.forEach(user => {
//             const userItem = document.createElement("div");
//             userItem.textContent = user.name; // Assuming user object has a 'name' property
//             userItem.classList.add("user-item");

//             // Add remove button for admin users
//             if (user.isAdmin) { // Assuming the user object has an 'isAdmin' property
//                 const removeButton = document.createElement("button");
//                 removeButton.textContent = "Remove";
//                 removeButton.classList.add("remove-user-button");
//                 removeButton.onclick = () => removeUserFromGroup(user.id, groupId); // Assuming user object has an 'id' property
//                 userItem.appendChild(removeButton);
//             }

//             userList.appendChild(userItem);
//         });
//     } catch (error) {
//         console.error("Error loading group users:", error);
//     }
// }

async function loadGroupUsers(groupId) {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://127.0.0.1:3000/groups/${groupId}/users`, {
            headers: { Authorization: 'Bearer ' + token }
        });
    
        const userList = document.getElementById("userList");
        userList.innerHTML = ''; // Clear existing users
    
        response.data.users.forEach(user => {
            // console.log(user);
            
            const userItem = document.createElement("div");
            userItem.classList.add("user-item");
            
            // Display user name and admin status
            const userText = document.createElement("span");
            userText.textContent = user.name + (user.isAdmin ? " (Admin)" : " (Normal User)");
            userItem.appendChild(userText);
    
            // Button to remove user from the group
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.classList.add("remove-user-button");
            removeButton.onclick = () => removeUserFromGroup(user.id, groupId);
            userItem.appendChild(removeButton);
    
            // Button to promote/demote user
            const adminToggleButton = document.createElement("button");
            adminToggleButton.textContent = user.isAdmin ? "Demote to User" : "Promote to Admin";
            adminToggleButton.classList.add("admin-toggle-button");
            adminToggleButton.onclick = () => toggleAdminStatus(user.id, groupId, !user.isAdmin);
            userItem.appendChild(adminToggleButton);
    
            // Add user item to the list
            userList.appendChild(userItem);
        });
    } catch (error) {
        console.error("Error loading group users:", error);
    }    
}

async function toggleAdminStatus(userId, groupId, newIsAdminStatus) {
    try {
        const token = localStorage.getItem("token");

        // API call to promote/demote user
        const response = await axios.patch(`http://127.0.0.1:3000/groups/${groupId}/users/${userId}/role`, 
        {
            isAdmin: newIsAdminStatus // Send new role status
        }, 
        {
            headers: { Authorization: 'Bearer ' + token }
        });

        // Notify user of success
        alert(response.data.message);

        // Reload the user list after the change
        loadGroupUsers(groupId);
    } catch (error) {
        console.error("Error changing admin status:", error);
        alert("Failed to change admin status.");
    }
}



async function removeUserFromGroup(userId, groupId) {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`http://127.0.0.1:3000/groups/${groupId}/users/${userId}`, {
            headers: { Authorization: 'Bearer ' + token }
        });

        if (response.data.success) {
            console.log("User removed:", userId);
            loadGroupUsers(groupId); // Reload users after removal
        }
    } catch (error) {
        console.error("Error removing user:", error);
    }
}

document.getElementById("addUserButton").addEventListener("click", async () => {
    const email = document.getElementById("newUserEmail").value;
    const params = new URLSearchParams(window.location.search);
        const groupId = params.get("groupId");
    

    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`http://127.0.0.1:3000/groups/${groupId}/users`, {
            email: email
        }, {
            headers: { Authorization: 'Bearer ' + token }
        });

        if (response.data.success) {
            console.log("User added:", email);
            loadGroupUsers(groupId); // Reload users after adding
            document.getElementById("newUserEmail").value = ""; // Clear input field
        }
    } catch (error) {
        console.error("Error adding user:", error);
    }
});







