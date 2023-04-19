const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit',async (event)=>{
    event.preventDefault();

    const formData = new FormData(event.target);
    const response = await fetch('/register',{
        method: 'POST',
        body: formData
    })
    const data = await response.json();
    if(response.status != 200){
        M.toast({html: data.message});
    }
    
    if(response.status === 200){
        return window.location.href='/login';
    }
})

//Redirect to index page if already logged in
function checkToken(){
    const authToken = localStorage.getItem('auth_token');
    if(authToken){
        window.location.href = '/';
    }
}

checkToken();