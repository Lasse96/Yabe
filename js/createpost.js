const API_BASE_URL = "https://nf-api.onrender.com";
const postsUrl = `${API_BASE_URL}/api/v1/auction/listings?_seller=true&_bids=true&sort=created&sortOrder=desc`;
const listingsUrl = `${API_BASE_URL}/api/v1/auction/listings/`;
const profileUrl = `${API_BASE_URL}/api/v1/auction/profiles/`;
const output = document.querySelector("#feed");
var allPosts = "";
let isUserLoggedIn = false;
checkIsUserLoggedIn();
fetchPosts(postsUrl);

//Fetching

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
    allPosts = await response.json();
    listPosts(allPosts);
  } catch (error) {
    console.log(error);
  }
}

function checkIsUserLoggedIn() {
  if (localStorage.getItem("accessToken") != null) {
    isUserLoggedIn = true;
  } else {
    isUserLoggedIn = false;
  }
}

function listPosts(posts) {
  const username = localStorage.getItem("username");
  let credits = localStorage.getItem("credits");
  let avatar = localStorage.getItem("avatar");
  let newPost = "";
  for (let post of posts) {
    const dropdowns = `
                <div class="dropdown position-absolute end-0 top-0 m-2 ">
                <button class="dropdown-toggle btn btn-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false">Edit</button>
                <ul class="dropdown-menu">
                <li class="delete btn" onclick="return confirm('Are you sure?');" delete="${post.id}">Delete</li>
                </ul>
                </div>`;

    let dato = new Date(post.endsAt);
    let localDate = dato.toLocaleString("default", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    let lastBidHtml = "";
    if (post.bids != null && post.bids.length > 0) {
      let lastBid = post.bids[post.bids.length - 1];
      lastBidHtml = `<p class="mt-4 text-dark h7 b">Highest bid: ${lastBid.amount}</p>`;
    } else {
      lastBidHtml = `<p class="mt-4 text-dark h7 b">No bids</p>`;
    }

    let descriptionHtml = "";
    if (post.description != null && post.description != "") {
      let desc = post.description;
      descriptionHtml = `<p class="mt-4 text-dark h6">Description: ${desc}</p>`;
    } else {
      descriptionHtml = `<p class="mt-4 text-dark h6">No description</p>`;
    }

    newPost += `
            <div class="col-md-4">
                <div class="card" style="background-color:whitesmoke; min-height: 500px;">
                  <div class="card-body">
                <img src="${
                  post.media
                }" class="card-img-top" alt=""style="max-height: 200px;">
                <a href="./post.html?id=${
                  post.id
                }" class="mt-4 text-dark card-title" >Title: ${post.title}</a>
                ${descriptionHtml}
                
                <p class="mt-4 text-dark">The listing ends at: ${localDate}</p>
                
                    <div style="display: ${isUserLoggedIn ? "block" : "none"};">
                  </div>
                     <div class="card-footer">
                     ${lastBidHtml}
                         <input type="number" class="rounded-2 p-3 mb-3 form-control border" name="bids" placeholder="Amount" id="bid-${
                           post.id
                         }">
                         <button onClick="bidding('${
                           post.id
                         }');" class="btn btn-secondary mb-4 bid" style="width: 100%;" >Bid</button>
                    </div>
                </div>
                ${username === post.seller.name ? dropdowns : ""}
                </div>
            </div>`;
  }

  //Dropdown
  const msg = document.querySelector("#msg");
  msg.innerHTML = `
    <div style="display: ${isUserLoggedIn ? "block" : "none"};">
    <div  class="d-flex">
    <div>
    <img src="${avatar}"  alt="" style="max-width: 200px; object-fit: cover;" class="rounded-circle mt-5 img-fluid" data-bs-toggle="modal" data-bs-target="#avatarModal">
    <div class="modal" id="avatarModal" style="background-color:#212529;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
      </div>
      <div class="modal-body">
      <div class="col-sm-6">
      <input type="text" name="avatarImg" class="rounded-2 mb-4 form-control border" placeholder="Put in link for new avatar" id="avatarImg">
      </div>
      <button id="updateAvatar" class="btn btn-dark mb-4">Change Avatar</button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Close</button>
      </div>

    </div>
  </div>
</div>
    
  </div>
      <div>
        <div class="d-flex">
          <img src="./image/username.png"  alt="" style="max-width: 175px;">
          <h2 class="text-dark font-monospace pt-5">${username}</h2>
        </div>
        <div class="d-flex">
          <img src="./image/credits.png"  alt="" style="max-width: 175px;">
          <h3 class="pt-5">${credits}</h3>
        </div>
      </div>
      <div class="justify-content-end">
      <img src="./image/sell.png" class="float-right" alt="" style="max-width: 350px;" data-bs-toggle="modal" data-bs-target="#listingModal">
      </div>
      </div>
    <div class="d-flex">
    
    <div class="modal" id="listingModal" style="background-color:#212529;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
      </div>
      <div class="modal-body">
      <form class="flex-column d-flex card">
        <input type="text" class="rounded-2 p-3 mb-3 form-control border" name="title" placeholder="Title" id="title">
        <textarea name="postInput" class="rounded-2 p-3 mb-3 form-control border" placeholder="Description" id="text"></textarea>
        <input type="text" name="media" class="rounded-2 p-3 mb-3 form-control border" placeholder="To get an image, add a link." id="image">
        <input type="datetime-local" class="rounded-2 p-3 mb-3 form-control border" name="deadline" placeholder="Deadline date" id="deadline">
    </form>
    </div>
        <div class="d-grid gap-4 mx-auto col-6">
        <button id="postbut" class="btn btn-dark mb-4">Create listing</button>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Close</button>
      </div>
    </div>`;
  output.innerHTML = newPost;
  const buttonPost = document.querySelector("#postbut");
  const updateAvatar = document.querySelector("#updateAvatar");

  updateAvatar.addEventListener("click", changeAvatar);

  buttonPost.addEventListener("click", () => {
    submit(listingsUrl);
    tittel.value = "";
    textarea.value = "";
    image.value = "";
    deadline.value = "";
  });

  const deleteBut = document.querySelectorAll(".delete");

  deleteBut.forEach((but) => {
    but.addEventListener("click", () => {
      const id = but.getAttribute("delete");
      deletePost(listingsUrl + id);
    });
  });
}

//Change avatar

async function changeAvatar() {
  try {
    const avatarImg = document.querySelector("#avatarImg");
    const token = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");
    const avImg = avatarImg.value;
    const img = {
      avatar: avImg,
    };
    const putAvatar = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(img),
    };
    let resultAvatar = await fetch(profileUrl + username + "/media", putAvatar);

    resultAvatar = await resultAvatar.json();
    localStorage.setItem("avatar", resultAvatar.avatar);

    document.location.reload();
  } catch (error) {
    console.log(error);
  }
}

//Bidding

async function bidding(id) {
  const bidAmountInput = document.querySelector(`#bid-${id}`);
  const amount = {
    amount: parseInt(bidAmountInput.value),
  };

  try {
    const token = localStorage.getItem("accessToken");
    const posting = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(amount),
    };
    const result = await fetch(listingsUrl + id + "/bids", posting);
    await updateUserInfo();
    document.location.reload();
  } catch (error) {
    console.log(error);
  }
}

async function updateUserInfo() {
  try {
    const token = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");
    const getCredits = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    let resultCredits = await fetch(profileUrl + username, getCredits);
    resultCredits = await resultCredits.json();
    localStorage.setItem("credits", resultCredits.credits);
    document.location.reload();
  } catch (error) {
    console.log(error);
  }
}

//Deleting

async function deletePost(url) {
  try {
    const token = localStorage.getItem("accessToken");
    const posting = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, posting);
    document.location.reload();
  } catch (error) {
    console.log(error);
  }
}

//Searching

const inputField = document.getElementById("q");
const searchbut = document.getElementById("search");
searchbut.addEventListener("click", filterPosts);
inputField.addEventListener("keyup", filterPosts);

function filterPosts() {
  const filterQuery = inputField.value.toLowerCase();
  const filtered = allPosts.filter((post) => {
    const t = `${post.title}`.toLowerCase();
    const a = `${post.description}`.toLowerCase();
    if (t.indexOf(filterQuery) > -1) return true;
    if (a.indexOf(filterQuery) > -1) return true;
    return false;
  });

  listPosts(filtered);
}

// Posting

async function submit(url) {
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
    innhold["media"] = [image.value];
  }

  try {
    const token = localStorage.getItem("accessToken");
    const posting = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(innhold),
    };
    const result = await fetch(url, posting);
    document.location.reload();
  } catch (error) {
    console.log(error);
  }
}
