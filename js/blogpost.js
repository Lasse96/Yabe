const API_BASE_URL = "https://nf-api.onrender.com";
const postsUrl = `${API_BASE_URL}/api/v1/auction/listings?_active=true`;
const author = "?_author=true";
const output = document.querySelector("#feed");
var allPosts = "";

async function fetchPosts (url) {
    try {
        const token = localStorage.getItem("accessToken");
        const posting = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
        const response = await fetch (url, posting);
        allPosts = await response.json();
        listPosts(allPosts);
    } catch (error) {
        console.log(error);
    }
};

fetchPosts(postsUrl + author);
let listPosts = (posts) => {
    const username = localStorage.getItem("username");
    const credits = localStorage.getItem("credits");


    let newPost = "";
    for (let post of posts) {    
        const dropdowns = `
                <div class="dropdown position-absolute end-0 bottom-0 m-2 ">
                <but class="dropdown-toggle btn btn-secondary" type="but" data-bs-toggle="dropdown" aria-expanded="false">Edit</but>
                <ul class="dropdown-menu">
                <li><a href="./update.html?id=${post.id}" class="update btn" update="${post.id}">Update</a></li>
                <li class="delete btn" onclick="return confirm('Are you sure?');" delete="${post.id}">Delete</li>
                </ul>
                </div>`
        
        
            
        newPost += `
                <div class="card p-4 mt-4 d-flex position-relative>
                <img src="#" class="" alt="">
                <a href="./post.html?id=${post.id}">
                <p class="mt-4">${post.name}</p>
                <p class="mt-4">${post.avatar}</p>
                <p class="mt-4">${post.description}</p>
                <img src="${post.media}" class="" alt="" style="max-width: 100%;">
                <p class="mt-4">${post.created}</p>
                <p class="mt-4">${post.endsAt}</p>
                <p class="mt-4">${post._seller}</p>
                <p class="mt-4">Bids: ${post._count.bids}</p>
                ${username === post.name ? dropdowns : ""}
                
                </div>`;


    }
    const msg = document.querySelector("#msg");
    msg.innerHTML = `Hello ${username}!
    These are your credits: ${credits}`;
    output.innerHTML = newPost;

    const updatebut = document.querySelectorAll(".update");

    updatebut.forEach(but => {
        but.addEventListener("click", (e) => {
            const id = but.getAttribute("update");
        })
    });
    const deleteBut = document.querySelectorAll(".delete");

    deleteBut.forEach(but => {
        but.addEventListener("click", () => {
            const id = but.getAttribute("delete");
            deletePost(postsUrl + id);
        })
    });
};

async function deletePost (url) {
    try {
        const token = localStorage.getItem("accessToken");
        const posting = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
        const response = await fetch (url, posting);
        const json = await response.json();
        document.location.reload();
    } catch (error) {
        console.log(error);
    }
};

const inputField = document.getElementById("q");
const searchbut = document.getElementById("search")
searchbut.addEventListener("click", filterPosts);
inputField.addEventListener('keydown', filterPosts);

// inputField.addEventListener('keydown', inputfieldkeydown);

// function inputfieldkeydown(e) {
//    if (e.keyCode == 13) {                    Gjør at den gamle søkefunksjonen funker. altså at du må klikke Enter eller search.
//     filterPosts();
//    }
// };

function filterPosts () {
    const filterQuery = inputField.value.toLowerCase();
    const filtered = allPosts.filter((post)=>{
        const t = `${post.title}`.toLowerCase();
        const a = `${post.body}`.toLowerCase();
        const c = `${post.author.name}`.toString();
        if (t.indexOf(filterQuery) > -1) return true;
        if (a.indexOf(filterQuery) > -1) return true;
        if (c.indexOf(filterQuery) > -1) return true;
        return false;
        
    })

    listPosts(filtered);
};

const tittel = document.querySelector("#title");
const textarea = document.querySelector("#text");
const image = document.querySelector("#image");
const buttonPost = document.querySelector("#postbut");

buttonPost.addEventListener("click", () => {
    submit(postsUrl);
    tittel.value = "";
    textarea.value = "";
    image.value = "";
});


async function submit (url) {
    const title = tittel.value;
    const text = textarea.value;
    const innhold = {
        title,
        body: text,
    };
    
    if (image.value != "") {
        innhold["media"] = image.value
    } 

    try {
        const token = localStorage.getItem("accessToken");
        const posting = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(innhold)
        }
        await fetch (url, posting);
        document.location.reload();
    } catch (error) {
        console.log(error);
    }
}




