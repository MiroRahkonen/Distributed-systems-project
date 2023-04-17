const post = document.getElementById('post');
const comments = document.getElementById('comments');
const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit',postComment);

let currentUsername = '';
let commentlist;
let authToken;
const url = window.location.href;   
const spliturl = url.split('/');
const postID = spliturl[4]; //Getting the postID from current url

async function postComment(event){
    event.preventDefault();

    const formData = new FormData(event.target);
    const commentDetails = {
        postID: postID,
        username: currentUsername,
        message: formData.get('message')
    }

    let response = await fetch('/comment/create',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify(commentDetails)
    })
    let data = await response.json();
    const newCommentID = data._id;

    let upvoteDetails = {
        type: 'comment',
        postID: postID,
        commentID: newCommentID
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

async function initializePost(){
    let response,data;
    authToken = localStorage.getItem('auth_token');

    if(authToken){
        response = await fetch('/user/currentuser',{
        headers: {
                'authorization': 'Bearer ' + authToken
            }
        })
        data = await response.json();
        currentUsername = data.username;
    }

    response = await fetch(`/post/data/${postID}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(response.status !== 200){
        return window.location.href='/';
    }
    data = await response.json();
    postData = data;
    deletebutton = '';
    if(postData.username === currentUsername){
        deletebutton = `
        <div>
            <a class='btn right red' onclick='deletePost()'>
                <i class='material-icons'>delete</i>
            </a>
        </div>`
    }
    post.innerHTML = 
    `<div'>
        ${deletebutton}
        <h5 id='title'>${postData.title}</h5> 
        <p>Posted by: ${postData.username}</p>
        <p>${postData.message}</p>
    </div>`
}

async function deletePost(){
    let response = await fetch('/post/delete',{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({postID: postID})
    })

    if(response.status === 200){
        window.location.replace('/');
    }
}

async function initializeComments(){
    comments.innerHTML = '';
    editbuttons = '';

    let response = await fetch(`/comment/data/${postID}`,{
        method: 'GET'
    })
    let data = await response.json();
    commentlist = data;
    commentlist.forEach(async (comment,i)=>{
        
        response = await fetch(`/upvote/${comment._id}`,{
            method: 'GET'
        })
        let upvoteData = await response.json();
        console.log(upvoteData);
        
        if(comment.username === currentUsername){
            editbuttons = `
            <div>
                <a class='btn right red' onclick='deleteComment(${i})'>
                    <i class='material-icons'>delete</i>
                </a>     
            </div>`
        }
        //<p class='right'>Upvotes: ${comment.upvotes} </p>
        comments.innerHTML += `
        <div id='${i}' class='comment'>
            ${editbuttons}
            <p id='username'>Username: ${comment.username}</p>
            <p id='message'>Message: ${comment.message}</p>
        </div>
        `
    })
}

async function deleteComment(i){
    let response = await fetch('/comment/delete',{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({commentID: commentlist[i]._id})
    })

    if(response.status === 200){
        window.location.reload();
    }
}

initializePost();
initializeComments();