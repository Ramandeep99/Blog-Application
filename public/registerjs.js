
const formFields = document.querySelector('form');

form.addEventListener('submit' , async (e) =>{
    e.preventDefault();

    // get values 
    const name = formFields.name.value;
    const email = formFields.email.value;
    const password = formFields.password.value;
    const confirm_password = formFields.confirm_password.value;
  
    try{
        const res = await fetch('/register' , {
            method : "POST",
            body : JSON.stringify({name , email , password , confirm_password}),
            headers : {"Content-Type" : "application/json"}
        });
    }
    catch(err){
        console.log(err);
    }

})