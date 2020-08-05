// const fetch = require('node-fetch')
// Synchronous
let a = 1;
let b = 2;


// setTimeout is a method which is Asynchronous by nature
setTimeout( function() {
    console.log("Asynchronous");
}, 0);

console.log(a);
console.log(b);

// Promise
let p = new Promise(function( resolve, reject ) {
    let sum = 5 + 5;
    if( sum == 10 ) {
        resolve({
            message: "Promise is resolved", status: 200
        })
    }else{
        reject('Promise is rejected');
    }
});

    p.then((response) => {
        console.log(response);
    }).catch((err) => {
        console.log(err)
    }).finally(() => {
        console.log('This will run either the promise is resolved or rejected')
    });

    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => {
            return response.json(response);
        })
        .then(data => {
            localStorage.setItem('posts', JSON.stringify(data))
        })

function getPosts() {
    let posts = JSON.parse(localStorage.getItem('posts'));
    let result = posts.map((post, i) => 
        `
        <li data-id = "${i}" class="list-group-item">
            <h2 class="text-wrap">${post.title}</h2>
            <p>${post.body}</p>
            <button id="edit" class="btn btn-primary">Edit</button>
            <button class="delete btn btn-danger" >Delete</button>
        </li>
        `
    ).reverse().join('');
    document.getElementById('posts').innerHTML = result;
    
}
 
document.addEventListener('DOMContentLoaded', getPosts);

document.addEventListener('click', (e) => {
    if(e.target && e.target.getAttribute('class') == 'delete btn btn-danger') {

        if(confirm('Are You Want To Delete?')){
            let index = e.target.parentElement.getAttribute('data-id');
            let posts = JSON.parse(localStorage.getItem('posts'));
            posts.splice(index, 1)
            localStorage.setItem('posts', JSON.stringify(posts))
            e.target.parentElement.remove()
        }
        
    }
})

document.getElementById('post-form').addEventListener('submit', e => {
    e.preventDefault();
    let title = document.getElementById('title').value;
    let body = document.getElementById('body').value;
    if(title && body) {
        let post = new Object;
        post.title = title;
        post.body = body;


        let posts = JSON.parse(localStorage.getItem('posts'));
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
        document.getElementById('title').value = "";
        document.getElementById('body').value = "";
        getPosts();
    }else{
        alert("You cannot add Empty Post")
    }    
})

document.addEventListener('click', (e) => {
    if(e.target && e.target.getAttribute('id') == 'edit') {
        let li = e.target.parentElement;
        let index = li.getAttribute('data-id');
        let editBtn = li.children[2];
        let oldData = JSON.parse(localStorage.getItem('posts'))
        let form = document.createElement('form');
        form.id = "editFrom";
        
        let editFrom = `
                <h2>Edit Goes Here!</h2>
                <div>
                    <label>Title</label>
                    <input class="form-control" type="text" id="title" value="${oldData[index].title}">
                </div>
                <div class="mb-3">
                    <label>Body</label>
                    <input class="form-control"  type="text" id="body" value="${oldData[index].body}">
                </div>
                <button class="update btn btn-primary">Update</button>
                <button class="cancel btn btn-secondary">Cancel</button>
        `;

        form.innerHTML = editFrom;
        li.appendChild(form);
        editBtn.disabled = true;
    }

    if(e.target && e.target.getAttribute('class') == 'cancel btn btn-secondary') {
        e.preventDefault();
        let li = e.target.parentElement.parentElement;
        let form = e.target.parentElement;
        li.removeChild(form);
        li.children[2].disabled = false;
    }

    if(e.target && e.target.getAttribute('class') == 'update btn btn-primary') {
        e.preventDefault();
        let li  = e.target.parentElement.parentElement;
        let form = e.target.parentElement;
        updateTitle = form.children[1].children[1].value;
        updateBody = form.children[2].children[1].value;

        if(updateBody && updateTitle) {
            let oldData = JSON.parse(localStorage.getItem('posts'));

            let index = li.getAttribute('data-id');
            oldData[index].title = updateTitle;
            oldData[index].body = updateBody;
    
            localStorage.setItem('posts', JSON.stringify(oldData));
            getPosts();
        }else{
            alert('Please write somthings');
        }
    }
})




