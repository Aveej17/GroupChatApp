document.getElementById("createGroupForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const groupName = document.getElementById("groupName").value;
    const groupDescription = document.getElementById("groupDescription").value;
    
    const token = localStorage.getItem("token"); // Assume token is stored in localStorage after login

    const groupDetails = {
        name: groupName,
        description: groupDescription
    };

    console.log(groupDetails);
    
    try {
        const response = await fetch("http://127.0.0.1:3000/groups/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token // Pass token in headers
            },
            body: JSON.stringify(groupDetails)
        });

        const data = await response.json();
        
        if (data.success) {
            alert("Group created successfully!");
            window.location.href = "./groupHome.html"; // Redirect to homepage after creation
        } else {
            alert("Error creating group: " + data.message);
        }
    } catch (error) {
        console.error("Error creating group:", error);
        alert("Error creating group.");
    }
});
