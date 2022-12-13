const API_BASE_URL = "https://nf-api.onrender.com";
const postsUrl = `${API_BASE_URL}/api/v1/auction/listings?_seller=true&_bids=true&sort=created&sortOrder=desc`;
const listingsUrl = `${API_BASE_URL}/api/v1/auction/listings/`;
const output = document.querySelector("#feed");
var allPosts = "";
let isUserLoggedIn = false;
checkIsUserLoggedIn();
fetchPosts(postsUrl);

//Fetching

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

function checkIsUserLoggedIn() {
    if (localStorage.getItem("accessToken") != null) {
        isUserLoggedIn = true;
    }
    else{
        isUserLoggedIn = false;
    }
}


function listPosts (posts) {
    const username = localStorage.getItem("username");
    const credits = localStorage.getItem("credits");
    

    let newPost = "";
    for (let post of posts) {    
        const dropdowns = `
                <div class="dropdown position-absolute end-0 bottom-0 m-2 ">
                <button class="dropdown-toggle btn btn-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false">Edit</button>
                <ul class="dropdown-menu">
                <li><a href="./update.html?id=${post.id}" class="update btn" update="${post.id}">Update</a></li>
                <li class="delete btn" onclick="return confirm('Are you sure?');" delete="${post.id}">Delete</li>
                </ul>
                </div>`
        
        let dato = new Date(post.endsAt);
        let localDate = dato.toLocaleString("default", {day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"});
        let lastBidHtml = "";
        if (post.bids != null && post.bids.length > 0) {
            let lastBid = post.bids[post.bids.length-1]
            lastBidHtml = `<p class="mt-4">Highest bid: ${lastBid.amount}</p>`
        }
        else{
            lastBidHtml = `<p class="mt-4">No bids</p>`
        }
        
        
        newPost += `
                <div class="card p-4 mt-4 d-flex position-relative">
                
                <a href="./post.html?id=${post.id}" class="mt-4">${post.title}</a>
                <p class="mt-4">${post.description}</p>
                <img src="${post.media}" class="" alt="" style="max-width: 50%;">
                <p class="mt-4">The listing ends at ${localDate}</p>
                ${lastBidHtml}
                <div style="display: ${isUserLoggedIn ? "block" : "none"};">
                <div class="d-flex">
                <input type="number" class="rounded-2 p-3 form-control border" name="bids" placeholder="How much do you want to bid?" id="bid-${post.id}" style="max-width: 300px;">
                <button onClick="bidding('${post.id}');" class="btn btn-secondary mb-4 bid" style="width: 100px;">Bid</button>
                </div>
                </div>
                ${username === post.seller.name ? dropdowns : ""}
                </div>`;
debugger;

    }

   

    //Dropdown
    const msg = document.querySelector("#msg");
    msg.innerHTML = `
    <div style="display: ${isUserLoggedIn ? "block" : "none"};">
    Hello ${username}!
    These are your credits: ${credits}
    
    <form class="flex-column d-flex">
                    <input type="text" class="rounded-2 p-3 form-control border" name="title" placeholder="Title" id="title">
                    <textarea name="postInput" class="mt-3 rounded-2 p-3 border" placeholder="Description" id="text"></textarea>
                    <input type="text" name="media" class="mt-3 mb-2 rounded-2 p-3 border" placeholder="To get an image, add a link." id="image">
                    <input type="datetime-local" class="rounded-2 p-3 form-control border" name="deadline" placeholder="Deadline date" id="deadline">
                </form>
                <div class="d-grid gap-4 mx-auto col-6">
                <button id="postbut" class="btn btn-secondary mb-4">Post</button></div></div>`;
    output.innerHTML = newPost;
    const buttonPost = document.querySelector("#postbut");

    buttonPost.addEventListener("click", () => {
        submit(listingsUrl);
        tittel.value = "";
        textarea.value = "";
        image.value = "";
        deadline.value = "";

    });

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
            deletePost(listingsUrl + id);
        })
    });
}; 

//Bidding

    

    async function bidding (id){

    const bidAmountInput = document.querySelector(`#bid-${id}`);
    const amount = {
        amount: parseInt (bidAmountInput.value),
    };
debugger;

    try {
        const token = localStorage.getItem("accessToken");
        const posting = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(amount)
        }
        const result = await fetch (listingsUrl + id + "/bids", posting);
        var test = await result.text();
        console.log(test)
        document.location.reload();
    } catch (error) {
        console.log(error);
    }


    }

//Deleting

async function deletePost (url) {
    debugger;
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
        document.location.reload();
    } catch (error) {
        console.log(error);
    }
};

const inputField = document.getElementById("q");
const searchbut = document.getElementById("search")
searchbut.addEventListener("click", filterPosts);
inputField.addEventListener('keyup', filterPosts);

function filterPosts () {
    const filterQuery = inputField.value.toLowerCase();
    const filtered = allPosts.filter((post)=>{
        const t = `${post.title}`.toLowerCase();
        const a = `${post.description}`.toLowerCase();;
        if (t.indexOf(filterQuery) > -1) return true;
        if (a.indexOf(filterQuery) > -1) return true;
        return false;
        
    })

    listPosts(filtered);
};


// Posting





async function submit (url) {
    const deadline = document.querySelector("#deadline");
    const tittel = document.querySelector("#title");
    const textarea = document.querySelector("#text");
    const image = document.querySelector("#image");
    const title = tittel.value;
    const description = textarea.value;
    const endsAt = deadline.value;
    const innhold = {
        title,
        description,
        endsAt,
    };
    if (image.value != "") {
        innhold["media"] = [image.value]
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
        const result = await fetch (url, posting);
        debugger;
        document.location.reload();
    } catch (error) {
        console.log(error);
    }
}




