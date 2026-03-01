// auth.js

// ================= IMPORT =================
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

// ================= REGISTER =================
window.registerUser = async (name, username, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      name: name,
      username: username,
      email: email,
      role: "member",
      createdAt: new Date()
    });

    alert("Akun berhasil dibuat dan data tersimpan!");
  } catch (error) {
    alert(error.message);
  }
};

// ================= LOGIN EMAIL/PASSWORD =================
window.loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login berhasil!");
  } catch (error) {
    alert(error.message);
  }
};

// ================= GOOGLE LOGIN =================
window.googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    alert("Login Google berhasil!");
  } catch (error) {
    alert(error.message);
  }
};

// ================= LOGOUT =================
window.logoutUser = async () => {
  try {
    await signOut(auth);
    alert("Logout berhasil!");
  } catch (error) {
    alert(error.message);
  }
};

// ================= UI CONTROL =================
const authBtn = document.getElementById("authBtn");
const authText = document.getElementById("authText");
const userEmail = document.getElementById("userEmail");

// Klik tombol sidebar
authBtn.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (user) {
    // Logout
    await logoutUser();
  } else {
    // Login / Register prompt sederhana
    const action = prompt("Ketik 'login' untuk masuk atau 'register' untuk buat akun:").toLowerCase();

    if (action === "login") {
      const email = prompt("Masukkan Email:");
      const password = prompt("Masukkan Password:");
      if (email && password) await loginUser(email, password);
    } else if (action === "register") {
      const name = prompt("Masukkan Nama:");
      const username = prompt("Masukkan Username:");
      const email = prompt("Masukkan Email:");
      const password = prompt("Masukkan Password:");
      if (name && username && email && password) await registerUser(name, username, email, password);
    } else {
      alert("Aksi tidak valid!");
    }
  }
});

// ================= AUTO UPDATE UI =================
onAuthStateChanged(auth, (user) => {
  if (user) {
    authText.innerText = "Logout";
    userEmail.style.display = "block";
    userEmail.innerText = "Login sebagai: " + (user.email || "Google User");
  } else {
    authText.innerText = "Masuk";
    userEmail.style.display = "none";
  }
});
