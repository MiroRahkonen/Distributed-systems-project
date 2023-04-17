const createPost = document.getElementById('create-post');
const posts = document.getElementById('posts');
const postForm = document.getElementById('post-form');
postForm.addEventListener('submit',createNewPost);

let currentUsername = '';
let postlist;


async function createNewPost(event){
    event.preventDefault();
    const authToken = localStorage.getItem('auth_token');

    const formData = new FormData(event.target);
    const postDetails = {
        title: formData.get('title'),
        message: formData.get('message')
    }

    let response = await fetch('/post/create',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify(postDetails)
    })
    let data = await response.json();
    const newpostID = data._id;

    let upvoteDetails = {
        type: 'post',
        postID: newpostID
    }

    response = await fetch('/upvote/create',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify(upvoteDetails)
    });

    if(response.status === 200){
        window.location.reload();
    }
}

async function initializePosts(){
    posts.innerHTML = '';
    response = await fetch('/post/data/all',{
        method: 'GET'
    })
    data = await response.json();
    postlist = data;
    postlist.forEach((post,index)=>{
        let deletebutton = '';
        if(post.username === currentUsername){
            deletebutton = `
            <div class='center-align'>
                <a class="btn right red" onclick='deletePost(${index})'>
                    <i class="material-icons">delete</i>
                </a>
            </div>`
        }
        posts.innerHTML += `
            <div id='${index}' class='post'>
                ${deletebutton}
                <a id='title' class='post-link' href="http://localhost:3000/post/${post._id}">${post.title} </a>
                <p id='username'>Posted by: ${post.username}</p>
                <p id='message'>Message: ${post.message}</p>
            </div>
        `
    })
}

async function deletePost(i){
    let response = await fetch('/post/delete',{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({postID: postlist[i]._id})
    })

    if(response.status === 200){
        window.location.reload();
    }
}

async function checkToken(){
    const authToken = localStorage.getItem('auth_token');
    if(authToken){
        let response = await fetch('/user/currentuser',{
            headers: {
                'authorization': 'Bearer ' + authToken
            }
        })
        data = await response.json();
        currentUsername = data.username;
        createPost.style.display = 'block';
    }
    else{
        createPost.style.display = 'none';
    }
}

checkToken();
initializePosts();