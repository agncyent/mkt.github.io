// auth.js
import { auth, db, googleProvider } from "./firebase.js";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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

    alert("Akun berhasil dibuat dan data tersimpan!");
  } catch (error) {
    alert(error.message);
  }
};

// ===== LOGIN EMAIL/PASSWORD =====
window.loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login berhasil!");
  } catch (error) {
    alert(error.message);
  }
};

// ===== LOGIN GOOGLE =====
window.googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Simpan data user Google ke Firestore jika belum ada
    const userDoc = doc(db, "users", user.uid);
    await setDoc(userDoc, {
      name: user.displayName,
      email: user.email,
      role: "member",
      createdAt: new Date()
    }, { merge: true });

    alert("Login Google berhasil!");
  } catch (error) {
    alert(error.message);
  }
};

// ===== LOGOUT =====
window.logoutUser = async () => {
  await signOut(auth);
  alert("Logout berhasil!");
};

// ===== UPDATE UI =====
const authBtn = document.getElementById("authBtn");
const authText = document.getElementById("authText");
const userEmail = document.getElementById("userEmail");

authBtn.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (user) {
    await logoutUser();
  } else {
    const method = prompt("Pilih login:\n1 = Email/Password\n2 = Google");
    if (method === "1") {
      const email = prompt("Masukkan Email:");
      const password = prompt("Masukkan Password:");
      if (email && password) await loginUser(email, password);
    } else if (method === "2") {
      await googleLogin();
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
