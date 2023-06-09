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

    //If creating the post was successful, redirect to new post
    if(response.status === 200){    
        M.toast({html: 'Post created! Redirecting to post'});
        setTimeout(()=>{
            window.location.href = `/post/${newpostID}`;
        },1500);
    }
}

async function initializePosts(){
    posts.innerHTML = '';
    response = await fetch('/post/data/all',{
        method: 'GET'
    })
    data = await response.json();
    postlist = data;
    postlist.forEach(async (post,i)=>{
        let button = '';

        response = await fetch(`/upvote/post/${post._id}`,{
            method: 'GET'
        })
        let upvoteData = await response.json();
        let upvoteCount = upvoteData.count;

        //Add button to delete this post if the user matches the current user
        if(post.username === currentUsername){
            button = `
                <a class="btn right red" onclick='deletePost(${i})'>
                    <i class="material-icons">delete</i>
                </a>`
        }
        posts.innerHTML += `
            <div class='post'>
                <div class='center-align'>
                    ${button}
                </div>
                <a id='title' class='post-link' href="http://localhost:3000/post/${post._id}">${post.title} </a>

                <h6 id='username'>Posted by: ${post.username}</h6>
                <h7>Upvotes: ${upvoteCount}</h7>
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
        M.toast({html: 'Post deleted!'});
        setTimeout(()=>{
            window.location.reload();
        },1500);
    }
}

async function checkAuthToken(){
    authToken = localStorage.getItem('auth_token');

    if(!authToken){
        return createPost.style.display = 'none';
    }

    let response = await fetch('/authenticate',{
        method: 'GET',
        headers: {
            'authorization': 'Bearer ' + authToken
        }
    })

    if(response.status !== 200){
        // token has expired, remove token and reload page
        localStorage.removeItem('auth_token');
        return window.location.reload();
    }
    else if(response.status === 200){
        // Token is valid
        data = await response.json();
        currentUsername = data.username;
        createPost.style.display = 'block';
    }
}

checkAuthToken();
initializePosts();