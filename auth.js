<li>
  <a href="#" id="authBtn">
    <i class="fas fa-sign-in-alt"></i> 
    <span id="authText">Masuk / Daftar</span>
  </a>
</li>

<div id="registerModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); justify-content:center; align-items:center;">
  <div style="background:white; padding:20px; border-radius:10px; width:300px;">
    <h3>Daftar Akun</h3>
    <input type="text" id="regName" placeholder="Nama" style="width:100%; margin:5px 0; padding:5px;">
    <input type="text" id="regUsername" placeholder="Username" style="width:100%; margin:5px 0; padding:5px;">
    <input type="email" id="regEmail" placeholder="Email" style="width:100%; margin:5px 0; padding:5px;">
    <input type="password" id="regPassword" placeholder="Password" style="width:100%; margin:5px 0; padding:5px;">
    <button id="registerBtn" style="margin-top:10px; width:100%;">Daftar</button>
    <hr>
    <button id="googleLoginBtn" style="width:100%;">Login dengan Google</button>
    <button id="closeModal" style="margin-top:5px; width:100%;">Tutup</button>
  </div>
</div>
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// ===== REGISTER =====
window.registerUser = async (name, username, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: name,
      username: username,
      email: email,
      role: "member",
      createdAt: new Date()
    });

    alert("Akun berhasil dibuat!");
  } catch (error) {
    alert("Error: " + error.message);
  }
};

// ===== GOOGLE LOGIN =====
window.googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    alert("Login Google berhasil!");
  } catch (error) {
    alert("Error: " + error.message);
  }
};

// ===== LOGOUT =====
window.logoutUser = async () => {
  try {
    await signOut(auth);
    alert("Logout berhasil!");
  } catch (err) {
    console.error(err);
  }
};

// ===== UI CONTROL =====
const authBtn = document.getElementById("authBtn");
const authText = document.getElementById("authText");
const userEmail = document.getElementById("userEmail");
const registerModal = document.getElementById("registerModal");
const registerBtn = document.getElementById("registerBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const closeModal = document.getElementById("closeModal");

authBtn.addEventListener("click", () => {
  const user = auth.currentUser;
  if (user) {
    logoutUser();
  } else {
    registerModal.style.display = "flex";
  }
});

closeModal.addEventListener("click", () => {
  registerModal.style.display = "none";
});

// Tombol Register
registerBtn.addEventListener("click", async () => {
  const name = document.getElementById("regName").value;
  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  if (!name || !username || !email || !password) {
    alert("Isi semua field!");
    return;
  }

  await registerUser(name, username, email, password);
  registerModal.style.display = "none";
});

// Tombol Google Login
googleLoginBtn.addEventListener("click", async () => {
  await googleLogin();
  registerModal.style.display = "none";
});

// Update tampilan login/logout
onAuthStateChanged(auth, (user) => {
  if (user) {
    authText.innerText = "Logout";
    userEmail.style.display = "block";
    userEmail.innerText = "Login sebagai: " + (user.email || "Google User");
  } else {
    authText.innerText = "Masuk / Daftar";
    userEmail.style.display = "none";
  }
});
