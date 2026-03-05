document.addEventListener("DOMContentLoaded", function() {

    const badge = document.getElementById("premiumBadge");
    const name = document.getElementById("profileName");
    const type = document.getElementById("accountType");

    // Fungsi ini dijalankan saat OTP berhasil
    window.setPremiumUser = function() {
        // Update tampilan halaman
        if(badge) badge.style.display = "inline-block";
        if(name) name.classList.add("premium-name");
        if(type) type.innerText = "Premium Member";

        // Opsional: update Firestore sebagai backup
        // import { auth, db, doc, updateDoc } from './firebase.js';
        // const user = auth.currentUser;
        // if(user){
        //     const userRef = doc(db, "users", user.uid);
        //     updateDoc(userRef, { premium: true, premiumVerifiedAt: new Date() });
        // }
    }

});
