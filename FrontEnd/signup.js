function handleFormSubmit(event){
    try{
    event.preventDefault();
    console.log("clicked"); 
    }
    catch(err){
        console.log("err "+err);
        
    }
}