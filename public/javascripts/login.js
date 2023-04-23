const loginForm = document.getElementById('login-form');

// Executed when post is submitted
loginForm.addEventListener('submit',async (event)=>{
    event.preventDefault();

    const formData = new FormData(event.target);
    const response = await fetch('/login',{
        method: 'POST',
        body: formData
    })
    const data = await response.json();
    
    if(response.status != 200){
        M.toast({html: data.message});
    }
    if(data.token){
        localStorage.setItem('auth_token',data.token);
        
        M.toast({html: 'Login succesful, redirecting to index!'});
        setTimeout(()=>{
            return window.location.href='/';
        },1500);
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