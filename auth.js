// auth.js
import { auth, db } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// ===== GOOGLE LOGIN =====
window.googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Simpan data user di Firestore jika belum ada
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        name: user.displayName || "User Google",
        email: user.email,
        photoURL: user.photoURL || "",
        role: "member",
        createdAt: new Date()
      });
    }

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

// Profil bawah login (nama & foto)
let userProfileContainer = document.getElementById("userProfile");
if (!userProfileContainer) {
  userProfileContainer = document.createElement("div");
  userProfileContainer.id = "userProfile";
  userProfileContainer.style.display = "none";
  userProfileContainer.style.marginTop = "10px";
  userProfileContainer.style.fontSize = "0.9rem";
  userProfileContainer.style.color = "#5CD6C0";
  document.querySelector(".sidebar ul").appendChild(userProfileContainer);
}

// Tombol Masuk / Logout
authBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (user) {
    await logoutUser();
  } else {
    await googleLogin();
  }
});

// Update tampilan login/logout
onAuthStateChanged(auth, async (user) => {
  if (user) {
    authText.innerText = "Logout";
    userEmail.style.display = "block";
    userEmail.innerText = "Login sebagai: " + (user.email || "Google User");

    // Tampilkan profil user
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      userProfileContainer.style.display = "block";
      userProfileContainer.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${data.photoURL || 'https://via.placeholder.com/32'}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">
          <span>${data.name || 'User'}</span>
          <button id="editProfileBtn" style="margin-left:auto; padding:2px 5px; font-size:0.8rem;">Edit</button>
        </div>
      `;

      const editBtn = document.getElementById("editProfileBtn");
      editBtn.addEventListener("click", async () => {
        const newName = prompt("Masukkan nama baru:", data.name || "");
        if (newName) {
          // Update di Firebase Auth
          await updateProfile(user, { displayName: newName });
          // Update di Firestore
          await setDoc(docRef, { name: newName }, { merge: true });
          alert("Nama berhasil diperbarui!");
          userProfileContainer.querySelector("span").innerText = newName;
        }
      });
    }
  } else {
    authText.innerText = "Masuk";
    userEmail.style.display = "none";
    userProfileContainer.style.display = "none";
  }
});
