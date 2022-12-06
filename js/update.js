const queryString = document.location.search;
const searchParams = new URLSearchParams(queryString);
const id = searchParams.get("id");
const output = document.querySelector("#output");

const API_BASE_URL = "https://nf-api.onrender.com";
const postUrl = `${API_BASE_URL}/api/v1/social/posts/${id}?_author=true`;

let listPost = (post) => {

    let date = new Date(post.updated);
    let localDate = date.toLocaleString("default", {day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"});
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

const tittel = document.querySelector("#title");
const textarea = document.querySelector("#text");
const image = document.querySelector("#image");
const buttonPost = document.querySelector("#postbut");

buttonPost.addEventListener("click", () => {
    update(postUrl);
    tittel.value = "";
    textarea.value = "";
    image.value = "";
});


async function fetchPosts (url) {
    try {
        const token = localStorage.getItem("accessToken");
        const put = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const response = await fetch (url, put);
        const json = await response.json();
        listPost(json);
    } catch (error) {
        console.log(error);
    }
}

fetchPosts(postUrl);


async function update (url) {
    const title = tittel.value;
    const bodyValue = textarea.value;
    const innhold = {
        title,
        body: bodyValue,
    };
    
    if (image.value != "") {
        const media = image.value;
        innhold["media"] = media;
    } 
    if (image.value = "") {
        localStorage.removeItem;
    }
    try {
        const token = localStorage.getItem("accessToken");
        const put = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(innhold)
        }
        await fetch (url, put);
        document.location.reload();
    } catch (error) {
        console.log(error);
    }
};