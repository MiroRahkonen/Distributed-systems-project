const post = document.getElementById('post');
const comments = document.getElementById('comments');
const createCommentSection = document.getElementById('create-comment');
const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit',postComment);

let currentUsername = '';
let commentlist;
let authToken;
const url = window.location.href;   
const spliturl = url.split('/');
const postID = spliturl[4]; //Getting the postID from current url

async function initializePost(){
    let response;

    response = await fetch(`/post/data/${postID}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(response.status !== 200){   //Redirecting to index if no post with URL is found
        return window.location.href='/';
    }
    postData = await response.json();
    button = '';

    response = await fetch(`/upvote/post/${postID}`,{
        method: 'GET'
    })
    let upvoteData = await response.json();
    let upvoteCount = upvoteData.count;
    let upvoters = upvoteData.upvoters;

    if(postData.username === currentUsername){
        button = `
            <a class='btn right red' onclick='deletePost()'>
                <i class='material-icons'>delete</i>
            </a>`
    }
    else if(currentUsername !== ''){
        if(upvoters.includes(currentUsername)){
            // If user has already upvoted, add button to remove upvote
            button = `
            <a class='btn right orange' onclick='postUpvote(-1)'>
                    <i class='material-icons'>thumb_up</i>
            </a>`
        }
        else{
            // If user hasn't upvoted, add upvote button
            button = `
            <a class='btn right grey' onclick='postUpvote(1)'>
                <i class='material-icons'>thumb_up</i>
            </a>`
        }
    }
    post.innerHTML = 
        `<div'>
            <div>
                ${button}
                <p class='right'>Upvotes: ${upvoteCount} </p>
            </div>
            <h5 id='title'>${postData.title}</h5> 
            <p>Posted by: ${postData.username}</p>
            <pre>${postData.message}</pre>
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
        M.toast({html: 'Post successfully deleted!'});
        setTimeout(()=>{
            window.location.replace('/');
        },1500);
    }
}

async function initializeComments(){
    comments.innerHTML = '';
    button = '';

    let response = await fetch(`/comment/data/${postID}`,{
        method: 'GET'
    })
    let data = await response.json();
    commentlist = data;

    // Going through each comment object, and creating a comment to be displayed
    commentlist.forEach(async (comment,i)=>{
        response = await fetch(`/upvote/comment/${comment._id}`,{
            method: 'GET'
        })
        let upvoteData = await response.json();
        const upvoteCount = upvoteData.count;
        const upvoters = upvoteData.upvoters;
        
        //If comment is posted by current user, add delete button
        if(comment.username === currentUsername){
            button = `
                <a class='btn right red' onclick='deleteComment(${i})'>
                    <i class='material-icons'>delete</i>
                </a>`
        }
        else if(currentUsername !== ''){
            if(upvoters.includes(currentUsername)){
                // If user has already upvoted, add button to remove upvote
                button = `
                <a class='btn right orange' onclick='commentUpvote(${i},-1)'>
                        <i class='material-icons'>thumb_up</i>
                </a>`
            }
            else{
                // If user hasn't upvoted, add upvote button
                button = `
                <a class='btn right grey' onclick='commentUpvote(${i},1)'>
                    <i class='material-icons'>thumb_up</i>
                </a>`
            }
        }
        comments.innerHTML += `
        <div class='comment'>
            <div>
                ${button}
                <p class='right'>Upvotes: ${upvoteCount} </p>
            </div>
            <p id='username'><span class='comment-poster'>${comment.username}</span>: ${comment.message}</p>
        </div>
        `
    })
}


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
    
    if(response.status !== 200){
        M.toast({html: 'Error posting comment, reloading'});
        setTimeout(()=>{
            return window.location.reload();
        },1500);
    }
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
        M.toast({html: 'Comment posted!'});
        setTimeout(()=>{
            window.location.reload();
        },1000);
    }
}


async function commentUpvote(i,upvoteChange){
    const commentID = commentlist[i]._id;
    let commentDetails = {
        commentID: commentID,
        upvoter: currentUsername,
        change: upvoteChange
    }
    let response = await fetch(`/upvote/comment/${commentID}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentDetails)
    })
    window.location.reload();
}

async function postUpvote(upvoteChange){

    let postDetails = {
        postID: postID,
        upvoter: currentUsername,
        change: upvoteChange
    }
    let response = await fetch(`/upvote/post/${postID}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postDetails)
    })
    window.location.reload();
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
        M.toast({html: 'Comment deleted!'});
        setTimeout(()=>{
            window.location.reload();
        },1500);
    }
}

async function checkAuthToken(){
    authToken = localStorage.getItem('auth_token');

    if(!authToken){
        return createCommentSection.style.display = 'none';
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
        data = await response.json();
        currentUsername = data.username;
        createCommentSection.style.display = 'block';
    }
}

checkAuthToken();
initializePost();
initializeComments();