const errorMessage = document.getElementById('error-message');
const logoutSection = document.getElementById('logout-section');
const logoutButton = document.getElementById('logout-button');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');


async function checkAuthToken(){
    authToken = localStorage.getItem('auth_token');
    if(!authToken){
        return logoutSection.style.display = 'none';
    }

    let response = await fetch('/authenticate',{
        method: 'GET',
        headers: {
            'authorization': 'Bearer ' + authToken
        }
    })
    // If token has expired, remove token and reload page
    if(response.status !== 200){
        localStorage.removeItem('auth_token');
        return window.location.reload();
    }
    // If token is valid, set current username and show comment creation form
    else if(response.status === 200){
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
    }
}

logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('auth_token');
    M.toast({html: 'Logging out, refreshing page'});
    setTimeout(()=>{
        window.location.reload();
    },1500);
})

checkAuthToken();