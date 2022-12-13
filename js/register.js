const API_BASE_URL = "https://nf-api.onrender.com";
const regUrl = `${API_BASE_URL}/api/v1/auction/auth/register`;

const emailEr = document.querySelector("#emailEr");
const usernameEr = document.querySelector("#usernameEr");
const passwordEr = document.querySelector("#passwordEr");

const form = document.querySelector("#regForm");

const usernameIn = document.querySelector("#username");
const passwordIn = document.querySelector("#password");
const emailIn = document.querySelector("#email");
const avatarIn = document.querySelector("#avatar")

const signbutton = document.querySelector("#signUp");


let valid = false;
let validation = (e) => {
    e.preventDefault();
    
    const nameCheck = /^[a-z0-9_]{2,15}$/;
    const email = emailIn.value.trim();
    const name = usernameIn.value.trim().toLowerCase();
    const password = passwordIn.value.trim();
    const avatar = avatarIn.value.trim();
    const userReg = {
        name,
        email,
        password,
        avatar,
    }

    let emailValid = false;
    let nameValid = false;
    let passwordValid = false;

    if (name !== "") {
        if (nameCheck.test(name)) {
            nameValid = true;
            usernameEr.innerHTML = "";
        } else {
            usernameEr.innerHTML = "Please try another username"
        }  
        } else {
            usernameEr.innerHTML = "Please type a username";
        }

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
            emailEr.innerHTML = "Email does not work";
        }  

        if (emailValid && passwordValid && nameValid) {
            valid = true;  
            register(regUrl, userReg);
        }
};

signbutton.addEventListener("click", validation);

async function register(url, userInfo) {
    try {
        const post = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo),
        }
        const response = await fetch(url, post);
        if (response.ok == true) { 
            window.location.href = "./login.html"; 
        }
    } catch (error) {
        console.log(error);
    }
};