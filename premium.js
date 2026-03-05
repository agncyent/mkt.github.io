document.addEventListener("DOMContentLoaded", function() {
    const badge = document.getElementById("premiumBadge");
    const name = document.getElementById("profileName");
    const type = document.getElementById("accountType");

    window.setPremiumUser = function(){
        if(badge) badge.style.display = "inline-block";
        if(name) name.classList.add("premium-name");
        if(type) type.innerText = "Premium Member";
    }
});
