const errorMessage = document.getElementById('error-message');
const logoutSection = document.getElementById('logout-section');
const logoutButton = document.getElementById('logout-button');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');


async function initializeHeader(){
    const authToken = localStorage.getItem('auth_token');

    if(!authToken){
        logoutSection.style.display = 'none';
    }
    else{
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
    }
}

logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('auth_token');
    return document.location.reload();
})

initializeHeader();