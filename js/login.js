const API_BASE_URL = "https://nf-api.onrender.com";
const loginUrl = `${API_BASE_URL}/api/v1/auction/auth/login`;

const emailEr = document.querySelector("#emailEr");
const passwordEr = document.querySelector("#passwordEr");

const form = document.querySelector("#signin");

const loginButton = document.querySelector("#login");

const usernameIn = document.querySelector("#username");
const passwordIn = document.querySelector("#password");
const emailIn = document.querySelector("#email");


let valid = false;
let validation = (e) => {
    e.preventDefault();

    const email = emailIn.value.trim();
    const password = passwordIn.value.trim();
    const userReg = {
        email,
        password,
    }
    
    let emailValid = false;
    let passwordValid = false;
    
    if (password.length >= 8) {
        passwordValid = true;
        passwordEr.innerHTML = "";
    } else {
        passwordEr.innerHTML = "Must include 8 characters";
    }

    if (email.includes("@noroff.no") || email.includes("@stud.noroff.no")) {
        emailValid = true;
        emailEr.innerHTML = ""
    } else {
        emailEr.innerHTML = "Use a different email";
    }  

    if (passwordValid && emailValid) {
        valid = true;  
        login(loginUrl, userReg);
    }
};

loginButton.addEventListener("click", validation);

async function login(url, userInfo) {
    try {
        const post = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo),
        }
        const response = await fetch(url, post);
        const json = await response.json();
        const accessToken = json.accessToken;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("username", json.name)
        localStorage.setItem("credits", json.credits)
        if (response.ok == true) { 
            window.location.href = "./home.html"; 
        }
    } catch (error) {
        console.log(error);
    }
}