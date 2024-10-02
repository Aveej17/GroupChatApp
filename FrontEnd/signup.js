async function handleFormSubmit(event){
    try{
        event.preventDefault();
        console.log("clicked"); 
        userDetails = {
            userName: event.target.username.value,
            emailId : event.target.email.value,
            password: event.target.password.value,
            phone:event.target.phone.value

        }
        let response = await axios.post("http://localhost:3000/users/signup", userDetails);
        console.log(response);
        alert("User Signed In Successfully");
    }
    catch(err){
        console.log("err "+err);
        alert(err);   
    }
}