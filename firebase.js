// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxrKRuwslFf-W4IGuzMoUG9yKadA7KdeM",
  authDomain: "mkt4x-web.firebaseapp.com",
  projectId: "mkt4x-web",
  storageBucket: "mkt4x-web.firebasestorage.app",
  messagingSenderId: "791692098940",
  appId: "1:791692098940:web:bfbe7bfb5175cb958538f9",
  measurementId: "G-YD4EZCHKFX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
