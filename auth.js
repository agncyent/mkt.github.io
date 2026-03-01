// auth.js

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import { auth } from "./firebase.js";

// REGISTER
window.registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      role: "member",
      createdAt: new Date()
    });

    alert("Akun berhasil dibuat dan data tersimpan!");
  } catch (error) {
    alert(error.message);
  }
};

// LOGIN
window.loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login berhasil!");
  } catch (error) {
    alert(error.message);
  }
};

// GOOGLE LOGIN
window.googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    alert("Login Google berhasil!");
  } catch (error) {
    alert(error.message);
  }
};

// LOGOUT
window.logoutUser = async () => {
  await signOut(auth);
  alert("Logout berhasil!");
};

// AUTO CHECK LOGIN
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Login:", user.email);
  }
  import { db } from "./firebase.js";
  import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
});
// ===== UI CONTROL =====

const authBtn = document.getElementById("authBtn");
const authText = document.getElementById("authText");
const userEmail = document.getElementById("userEmail");

authBtn.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (user) {
    await logoutUser();
  } else {
    const email = prompt("Masukkan Email:");
    const password = prompt("Masukkan Password:");
    if (email && password) {
      await loginUser(email, password);
    }
  }
});

// Update tampilan saat login/logout
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
