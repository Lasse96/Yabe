const queryString = document.location.search;
const searchParams = new URLSearchParams(queryString);
const id = searchParams.get("id");
const output = document.querySelector("#output");
const bidOutput = document.querySelector("#bidOutput");

const API_BASE_URL = "https://nf-api.onrender.com";
const url = `${API_BASE_URL}/api/v1/auction/listings/${id}?_seller=true&_bids=true`;

async function fetchPosts(url) {
  try {
    const token = localStorage.getItem("accessToken");
    const posting = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, posting);
    const json = await response.json();
    listPosts(json);
  } catch (error) {
    console.log(error);
  }
}

fetchPosts(url);

let listPosts = (post) => {
  post.bids.forEach((e) => {
    bidOutput.innerHTML += `
    <div class="border-top text-dark shadow p-4 mb-5 bg-body rounded">
      <div class="d-flex">
        <p class="fw-bold">Amount: </p>
        <p class="text-muted"> ${e.amount}</p>
      </div>
      <div class="d-flex">
        <p class="fw-bold">Bidder name: </p>
        <p class="text-muted"> ${e.bidderName}</p>
      </div>
    </div>
        `;
  });
  let dato = new Date(post.updated);
  let localDate = dato.toLocaleString("default", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  if (post.media == null) {
    post.media = "";
  }

  let descriptionHtml = "";
  if (post.description != null && post.description != "") {
    let desc = post.description;
    descriptionHtml = `<p class="mt-4 text-dark h6">Description: ${desc}</p>`;
  } else {
    descriptionHtml = `<p class="mt-4 text-dark h6">No description</p>`;
  }

  output.innerHTML = `
    <div class=" p-3 text-dark">
    <p style="text-align: right;">${localDate}</p>
    <div class="d-flex">
    <div class="shadow-lg p-4 mb-5 bg-body rounded">
    <img src="${post.media}" style="max-width: 400px;">
    <h2>${post.title}</h2>
    ${descriptionHtml}
    </div>
    <div class="ps-5 badge">
    <img src="${post.seller.avatar}" style="max-width: 100px;">
    <p class="text-secondary fs-6">Username: ${post.seller.name}</p>   
    <p class="text-muted fs-5">Bids: ${post._count.bids}</p>
    </div>
    </div>
    
    
    </div>
 `;
};
