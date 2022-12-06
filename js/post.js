const queryString = document.location.search;
const searchParams = new URLSearchParams(queryString);
const id = searchParams.get("id");
const output = document.querySelector("#output");

const API_BASE_URL = "https://nf-api.onrender.com";
const url = `${API_BASE_URL}/api/v1/social/posts/${id}?_author=true`;

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
        const json = await response.json();
        listPosts(json);
    } catch (error) {
        console.log(error);
    }
};

fetchPosts(url);

let listPosts = (post) => {

    let dato = new Date(post.updated);
    let localDate = dato.toLocaleString("default", {day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"});
    if (post.media == null) {
        post.media = "";
    }
    output.innerHTML = `
    <div class="card p-3">
    <p style="text-align: right;">${localDate}</p>   
    <h2>${post.title}</h2>
    <h3>${post.author.name}</h3>
    <p>${post.body}</p>
    <img src="${post.media}">
    </div>
 `
};

