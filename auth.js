import { auth } from "./firebase.js";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// ELEMENTS
const authBtn = document.getElementById("authBtn");
const authText = document.getElementById("authText");
const profileContainer = document.getElementById("profileContainer");
const profilePic = document.getElementById("profilePic");
const profileName = document.getElementById("profileName");

// GOOGLE LOGIN
async function googleLogin() {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (err) {
        alert("Error: " + err.message);
    }
}

// LOGOUT
async function logoutUser() {
    try {
        await signOut(auth);
    } catch (err) {
        console.error(err);
    }
}

// TOMBOL MASUK / LOGOUT
authBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
        await logoutUser();
    } else {
        await googleLogin();
    }
});

// UPDATE UI SESUAI LOGIN STATE
onAuthStateChanged(auth, (user) => {
    if (user) {
        authText.innerText = "Logout";
        profileContainer.style.display = "block";
        profileName.innerText = user.displayName || "Google User";
        profilePic.src = user.photoURL || "https://i.imgur.com/yf6G3Q2.png"; // default photo kalau kosong
    } else {
        authText.innerText = "Masuk";
        profileContainer.style.display = "none";
    }
});
