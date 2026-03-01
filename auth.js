import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// REGISTER FUNCTION
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

// GOOGLE LOGIN FUNCTION
window.googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    alert("Login Google berhasil!");
  } catch (error) {
    alert("Error: " + error.message);
  }
};

// LOGOUT FUNCTION
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
  if (user) logoutUser();
  else registerModal.style.display = "flex";
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

  if (!name || !username || !email || !password) return alert("Isi semua field!");
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
