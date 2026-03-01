import { auth, db } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const authBtn = document.getElementById("authBtn");
const authText = document.getElementById("authText");
const userEmail = document.getElementById("userEmail");

// Profil user
let userProfileContainer = document.getElementById("userProfile");
if (!userProfileContainer) {
  userProfileContainer = document.createElement("li");
  userProfileContainer.id = "userProfile";
  userProfileContainer.style.display = "none";
  userProfileContainer.style.fontSize = "0.85rem";
  userProfileContainer.style.color = "#5CD6C0";
  document.querySelector(".sidebar ul").appendChild(userProfileContainer);
}

const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    alert("Login Google berhasil!");
  } catch (err) {
    if (err.code !== "auth/popup-closed-by-user") {
      alert("Error: " + err.message);
    }
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);
    alert("Logout berhasil!");
  } catch (err) {
    console.error(err);
  }
};

authBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (user) await logoutUser();
  else await googleLogin();
});

// Update tampilan login/logout & profil
onAuthStateChanged(auth, async (user) => {
  if (user) {
    authText.innerText = "Logout";
    userEmail.style.display = "block";
    userEmail.innerText = "Login sebagai: " + (user.email || "Google User");

    // Ambil data user dari Firestore
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // buat data baru jika belum ada
      await setDoc(docRef, {
        name: user.displayName || "User Google",
        email: user.email,
        photoURL: user.photoURL || "",
        role: "member",
        createdAt: new Date()
      });
    }

    const data = (await getDoc(docRef)).data();
    userProfileContainer.style.display = "block";
    userProfileContainer.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <img src="${data.photoURL || 'https://via.placeholder.com/32'}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">
        <span>${data.name}</span>
        <button id="editProfileBtn" style="margin-left:auto; font-size:0.8rem;">Edit</button>
      </div>
    `;

    document.getElementById("editProfileBtn").addEventListener("click", async () => {
      const newName = prompt("Masukkan nama baru:", data.name);
      if (newName) {
        await updateProfile(user, { displayName: newName });
        await setDoc(docRef, { name: newName }, { merge: true });
        userProfileContainer.querySelector("span").innerText = newName;
      }
    });

  } else {
    authText.innerText = "Masuk";
    userEmail.style.display = "none";
    userProfileContainer.style.display = "none";
  }
});
