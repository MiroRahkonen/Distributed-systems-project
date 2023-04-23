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
        M.toast({html: 'Registration successful, redirecting to login page'});
        setTimeout(()=>{
            return window.location.href='/login';
        },2000);
    }
})

//Redirect to index page if already logged in
function checkAuthToken(){
    const authToken = localStorage.getItem('auth_token');
    if(authToken){
        window.location.href = '/';
    }
}

checkAuthToken();