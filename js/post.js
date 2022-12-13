const queryString = document.location.search;
const searchParams = new URLSearchParams(queryString);
const id = searchParams.get("id");
const output = document.querySelector("#output");
const bidOutput = document.querySelector("#bidOutput");

const API_BASE_URL = "https://nf-api.onrender.com";
const url = `${API_BASE_URL}/api/v1/auction/listings/${id}?_seller=true&_bids=true`;

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

    post.bids.forEach(e => {
        bidOutput.innerHTML+=`
        <p>Amount: ${e.amount}</p>
        <p>Bidder name: ${e.bidderName}</p>`
        
    });
    let dato = new Date(post.updated);
    let localDate = dato.toLocaleString("default", {day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"});
    if (post.media == null) {
        post.media = "";
    }
    output.innerHTML = `
    <div class="card p-3">
    <p style="text-align: right;">${localDate}</p>   
    <h2>${post.title}</h2>
    
    <p>Bids: ${post._count.bids}</p>
    <img src="${post.media}">
    <p>Description: ${post.description}</p>
    <p>Username: ${post.seller.name}</p>
    <img src="${post.seller.avatar}" style="max-width: 100px;">
    
    </div>
 `
};

