async function handleFormSubmit(event){
    try{
        event.preventDefault();
        console.log("login Clicked")
        const UserDetails = {
            // phone could be a mail Id also doesn't matter both are unique only
            phone:event.target.phone.value,
            password: event.target.password.value
            
        }
        console.log(UserDetails);
        
        let response = await axios.post("http://127.0.0.1:3000/users/login", UserDetails);
        // console.log(response.data.token);

        localStorage.setItem("token", response.data.token);
        alert("user logged in successfully");
        window.location.href = "../chat/chat.html";

    }
    catch(err){
        console.log(err);
        if (err.response) {
            if (err.response.status === 404) {
                // User already exists
                alert("No User Found. Please SignupInstead instead.");
                window.location.href = "../signup/signup.html";  // Redirect to the signup page
            } else {
                // General error message from server
                alert(`Error: ${err.response.data.message || "An error occurred during login"}`);
            }
        } else {
            // Network or other error
            alert("Network error or server not reachable");
        }  
    }
}