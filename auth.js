import { auth, db, googleProvider } from "./firebase.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// ===== GOOGLE LOGIN =====
window.googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Simpan user ke Firestore kalau baru login
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName || "",
      email: user.email,
      photoURL: user.photoURL || "",
      role: "member",
      createdAt: new Date()
    }, { merge: true });

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

// ===== UI ELEMENTS =====
const authBtn = document.getElementById("authBtn");
const authText = document.getElementById("authText");
const profileContainer = document.getElementById("profileContainer");
const profileName = document.getElementById("profileName");
const profilePic = document.getElementById("profilePic");
const overlay = document.getElementById("overlay");
const authModal = document.getElementById("authModal");

// Toggle auth modal
authBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (user) {
    logoutUser();
  } else {
    authModal.style.display = "flex";
  }
});

window.closeModal = () => {
  authModal.style.display = "none";
};

// ===== EDIT PROFILE =====
window.editProfile = async () => {
  const newName = prompt("Masukkan nama baru:", auth.currentUser.displayName || profileName.innerText);
  if (!newName) return;

  try {
    // Update nama di Firebase Auth
    await updateProfile(auth.currentUser, { displayName: newName });

    // Update Firestore
    await setDoc(doc(db, "users", auth.currentUser.uid), { name: newName }, { merge: true });

    // Update UI
    profileName.innerText = newName;
    alert("Nama berhasil diperbarui!");
  } catch (err) {
    console.error(err);
    alert("Gagal update nama: " + err.message);
  }
};

// Tombol Google Login di modal
const googleLoginBtn = document.querySelector("#authModal button.google");
googleLoginBtn.addEventListener("click", async () => {
  await googleLogin();
  authModal.style.display = "none";
});

// ===== UPDATE UI SESUAI LOGIN STATE =====
onAuthStateChanged(auth, (user) => {
  if (user) {
    authText.innerText = "Logout";
    profileContainer.style.display = "block";
    profileName.innerText = user.displayName || "Google User";
    profilePic.src = user.photoURL || "https://via.placeholder.com/60";
  } else {
    authText.innerText = "Masuk";
    profileContainer.style.display = "none";
  }
});
