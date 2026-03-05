// premium.js
function setPremiumUser(){
    localStorage.setItem("isPremium", "true"); // tandai user premium

    const badge = document.getElementById("premiumBadge");
    const name = document.getElementById("userName");
    const type = document.getElementById("accountType");

    if(badge) badge.style.display = "inline";
    if(name) name.classList.add("premium-name");
    if(type) type.innerText = "Premium Member";
}

// cek status premium tiap halaman load
document.addEventListener("DOMContentLoaded", function(){
    if(localStorage.getItem("isPremium") === "true"){
        setPremiumUser();
    }
});
