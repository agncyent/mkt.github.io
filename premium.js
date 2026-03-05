import { auth, db, doc, getDoc } from './firebase.js';

document.addEventListener("DOMContentLoaded", async function() {

    const userNameEl = document.getElementById("userName");
    const badge = document.getElementById("premiumBadge");
    const type = document.getElementById("accountType");

    // Cek user login
    auth.onAuthStateChanged(async user => {
        if(user){
            userNameEl.innerText = user.displayName || "User";

            // Ambil data premium dari Firestore sebagai backup
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            const isPremium = userSnap.exists() ? userSnap.data().premium : false;

            if(isPremium){
                if(badge) badge.style.display = "inline-block";
                if(type) type.innerText = "Premium Member";
                userNameEl.classList.add("premium-name");
            }
        } else {
            userNameEl.innerText = "Guest";
            if(type) type.innerText = "Basic Member";
        }
    });

    // Fungsi global untuk OTP sukses
    window.setPremiumUser = async function(){
        if(badge) badge.style.display = "inline-block";
        if(type) type.innerText = "Premium Member";
        userNameEl.classList.add("premium-name");

        // Update Firestore backup
        const user = auth.currentUser;
        if(user){
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { premium: true, premiumVerifiedAt: new Date() });
        }
    }

});
