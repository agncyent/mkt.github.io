import { auth, db, doc, getDoc, onAuthStateChanged, updateDoc } from './firebase.js';

document.addEventListener("DOMContentLoaded", function(){

    const badge = document.getElementById("premiumBadge");
    const name = document.getElementById("profileName");
    const type = document.getElementById("accountType");

    onAuthStateChanged(auth, async (user) => {
        if(user){
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if(userSnap.exists()){
                const data = userSnap.data();
                if(data.premium){
                    if(badge) badge.style.display = "block";
                    if(name) name.classList.add("premium-name");
                    if(type) type.innerText = "Premium Member";
                }
            }
        }
    });

    // Fungsi untuk set premium saat OTP berhasil
    window.setPremiumUser = async function(){
        const user = auth.currentUser;
        if(user){
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                premium: true,
                premiumVerifiedAt: new Date()
            });

            if(badge) badge.style.display = "block";
            if(name) name.classList.add("premium-name");
            if(type) type.innerText = "Premium Member";
        }
    }

});
